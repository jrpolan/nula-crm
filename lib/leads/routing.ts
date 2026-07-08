import "server-only"

import { and, asc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  activities,
  contactGroups,
  contactTags,
  contacts,
  groups,
  leadRoutingRules,
  tags,
} from "@/lib/db/schema"
import { slugifyTag } from "@/lib/crm-defaults"
import type {
  RoutingActions,
  RoutingConditions,
  RoutingOutcome,
  RoutingRule,
} from "@/lib/crm-types"
import { randomId } from "@/lib/library-helpers"
import { workspaceUserIdMatches } from "@/lib/workspace-scope"

export type { RoutingOutcome } from "@/lib/crm-types"

export type LeadContext = {
  channel: string
  sourceKey: string
  leadScore: number
  text: string
}

/** All conditions must match (AND). An empty condition set matches everything. */
export function matchesConditions(conditions: RoutingConditions, ctx: LeadContext): boolean {
  if (conditions.channel && conditions.channel !== ctx.channel) return false
  if (conditions.sourceKey && conditions.sourceKey !== ctx.sourceKey) return false
  if (typeof conditions.minScore === "number" && ctx.leadScore < conditions.minScore) return false
  if (conditions.keywords && conditions.keywords.length > 0) {
    const haystack = ctx.text.toLowerCase()
    const hit = conditions.keywords.some((k) => k.trim() && haystack.includes(k.trim().toLowerCase()))
    if (!hit) return false
  }
  return true
}

function toRule(row: typeof leadRoutingRules.$inferSelect): RoutingRule {
  return {
    id: row.id,
    name: row.name,
    priority: row.priority,
    enabled: row.enabled,
    conditions: row.conditions ?? {},
    actions: row.actions ?? {},
    createdAt: row.createdAt.toISOString(),
  }
}

export async function getRoutingRules(scopeIds: string[]): Promise<RoutingRule[]> {
  const rows = await db
    .select()
    .from(leadRoutingRules)
    .where(workspaceUserIdMatches(leadRoutingRules.userId, scopeIds))
    .orderBy(asc(leadRoutingRules.priority), asc(leadRoutingRules.createdAt))
  return rows.map(toRule)
}

async function ensureTagByName(workspaceId: string, scopeIds: string[], name: string) {
  const slug = slugifyTag(name)
  const [existing] = await db
    .select()
    .from(tags)
    .where(and(workspaceUserIdMatches(tags.userId, scopeIds), eq(tags.slug, slug)))
    .limit(1)
  if (existing) return existing
  const [created] = await db
    .insert(tags)
    .values({
      id: randomId("t"),
      userId: workspaceId,
      name,
      slug,
      description: "Applied by a lead routing rule",
    })
    .returning()
  return created
}

async function ensureGroupByName(workspaceId: string, scopeIds: string[], name: string) {
  const slug = slugifyTag(name)
  const [existing] = await db
    .select()
    .from(groups)
    .where(and(workspaceUserIdMatches(groups.userId, scopeIds), eq(groups.slug, slug)))
    .limit(1)
  if (existing) return existing
  const [created] = await db
    .insert(groups)
    .values({
      id: randomId("g"),
      userId: workspaceId,
      name,
      slug,
      description: "Applied by a lead routing rule",
      type: "audience",
    })
    .returning()
  return created
}

/** Merge the actions of every matching enabled rule (in priority order) and
 * apply them to the contact. Later rules win for lead status / lifecycle. */
export async function applyRoutingRules(params: {
  workspaceId: string
  scopeIds: string[]
  contactId: string
  ctx: LeadContext
}): Promise<RoutingOutcome> {
  const { workspaceId, scopeIds, contactId, ctx } = params
  const rules = (await getRoutingRules(scopeIds)).filter((r) => r.enabled)

  const outcome: RoutingOutcome = { matchedRules: [], addedTags: [], addedGroups: [] }

  for (const rule of rules) {
    if (!matchesConditions(rule.conditions, ctx)) continue
    outcome.matchedRules.push(rule.name)
    const actions: RoutingActions = rule.actions ?? {}

    for (const tagName of actions.addTags ?? []) {
      if (!tagName.trim()) continue
      const tag = await ensureTagByName(workspaceId, scopeIds, tagName.trim())
      await db
        .insert(contactTags)
        .values({ contactId, tagId: tag.id, addedBy: "lead-routing" })
        .onConflictDoNothing()
      if (!outcome.addedTags.includes(tag.name)) outcome.addedTags.push(tag.name)
    }

    for (const groupName of actions.addGroups ?? []) {
      if (!groupName.trim()) continue
      const group = await ensureGroupByName(workspaceId, scopeIds, groupName.trim())
      await db
        .insert(contactGroups)
        .values({ contactId, groupId: group.id, addedBy: "lead-routing" })
        .onConflictDoNothing()
      if (!outcome.addedGroups.includes(group.name)) outcome.addedGroups.push(group.name)
    }

    if (actions.setLeadStatus) outcome.leadStatus = actions.setLeadStatus
    if (actions.setLifecycle) outcome.lifecycle = actions.setLifecycle
  }

  if (outcome.leadStatus || outcome.lifecycle) {
    await db
      .update(contacts)
      .set({
        ...(outcome.leadStatus ? { leadStatus: outcome.leadStatus } : {}),
        ...(outcome.lifecycle ? { lifecycleStage: outcome.lifecycle } : {}),
      })
      .where(eq(contacts.id, contactId))
  }

  if (outcome.matchedRules.length > 0) {
    const bits = [
      outcome.addedTags.length ? `tagged ${outcome.addedTags.join(", ")}` : "",
      outcome.addedGroups.length ? `added to ${outcome.addedGroups.join(", ")}` : "",
      outcome.leadStatus ? `status → ${outcome.leadStatus}` : "",
      outcome.lifecycle ? `stage → ${outcome.lifecycle}` : "",
    ].filter(Boolean)
    await db.insert(activities).values({
      id: randomId("a"),
      userId: workspaceId,
      type: "note_added",
      message: `Routing rules applied (${outcome.matchedRules.join("; ")})${bits.length ? `: ${bits.join("; ")}` : ""}`,
      contactId,
      actorId: "lead-routing",
    })
  }

  return outcome
}

/** Dry-run evaluation for the rule-builder preview. No DB writes. */
export async function previewRoutingRules(
  scopeIds: string[],
  ctx: LeadContext,
): Promise<RoutingOutcome> {
  const rules = (await getRoutingRules(scopeIds)).filter((r) => r.enabled)
  const outcome: RoutingOutcome = { matchedRules: [], addedTags: [], addedGroups: [] }
  for (const rule of rules) {
    if (!matchesConditions(rule.conditions, ctx)) continue
    outcome.matchedRules.push(rule.name)
    for (const t of rule.actions.addTags ?? []) {
      if (t.trim() && !outcome.addedTags.includes(t.trim())) outcome.addedTags.push(t.trim())
    }
    for (const g of rule.actions.addGroups ?? []) {
      if (g.trim() && !outcome.addedGroups.includes(g.trim())) outcome.addedGroups.push(g.trim())
    }
    if (rule.actions.setLeadStatus) outcome.leadStatus = rule.actions.setLeadStatus
    if (rule.actions.setLifecycle) outcome.lifecycle = rule.actions.setLifecycle
  }
  return outcome
}
