"use server"

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { getActingUser, requireRole } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { leadRoutingRules } from "@/lib/db/schema"
import type { RoutingActions, RoutingConditions, RoutingRule } from "@/lib/crm-types"
import { randomId } from "@/lib/library-helpers"
import {
  getRoutingRules,
  previewRoutingRules,
  type LeadContext,
  type RoutingOutcome,
} from "@/lib/leads/routing"
import { getWorkspaceScopeIds } from "@/lib/workspace-scope"

export type RoutingRuleInput = {
  name: string
  priority?: number
  enabled?: boolean
  conditions: RoutingConditions
  actions: RoutingActions
}

function cleanConditions(c: RoutingConditions): RoutingConditions {
  const out: RoutingConditions = {}
  if (c.channel?.trim()) out.channel = c.channel.trim()
  if (c.sourceKey?.trim()) out.sourceKey = c.sourceKey.trim()
  if (typeof c.minScore === "number" && !Number.isNaN(c.minScore)) out.minScore = c.minScore
  const keywords = (c.keywords ?? []).map((k) => k.trim()).filter(Boolean)
  if (keywords.length) out.keywords = keywords
  return out
}

function cleanActions(a: RoutingActions): RoutingActions {
  const out: RoutingActions = {}
  const tags = (a.addTags ?? []).map((t) => t.trim()).filter(Boolean)
  const gps = (a.addGroups ?? []).map((g) => g.trim()).filter(Boolean)
  if (tags.length) out.addTags = tags
  if (gps.length) out.addGroups = gps
  if (a.setLeadStatus?.trim()) out.setLeadStatus = a.setLeadStatus.trim()
  if (a.setLifecycle?.trim()) out.setLifecycle = a.setLifecycle.trim()
  return out
}

export async function listRoutingRules(): Promise<RoutingRule[]> {
  const { workspaceId } = await getActingUser()
  const scopeIds = await getWorkspaceScopeIds(workspaceId)
  return getRoutingRules(scopeIds)
}

export async function createRoutingRule(input: RoutingRuleInput): Promise<RoutingRule> {
  const { workspaceId } = await requireRole("Admin")
  const name = input.name.trim()
  if (!name) throw new Error("Rule name is required")
  const [row] = await db
    .insert(leadRoutingRules)
    .values({
      id: randomId("rule"),
      userId: workspaceId,
      name,
      priority: input.priority ?? 0,
      enabled: input.enabled ?? true,
      conditions: cleanConditions(input.conditions),
      actions: cleanActions(input.actions),
    })
    .returning()
  revalidatePath("/app/settings")
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

export async function updateRoutingRule(
  id: string,
  patch: Partial<RoutingRuleInput>,
): Promise<void> {
  const { workspaceId } = await requireRole("Admin")
  const set: Record<string, unknown> = {}
  if (patch.name !== undefined) set.name = patch.name.trim()
  if (patch.priority !== undefined) set.priority = patch.priority
  if (patch.enabled !== undefined) set.enabled = patch.enabled
  if (patch.conditions !== undefined) set.conditions = cleanConditions(patch.conditions)
  if (patch.actions !== undefined) set.actions = cleanActions(patch.actions)
  if (Object.keys(set).length === 0) return
  await db
    .update(leadRoutingRules)
    .set(set)
    .where(and(eq(leadRoutingRules.id, id), eq(leadRoutingRules.userId, workspaceId)))
  revalidatePath("/app/settings")
}

export async function deleteRoutingRule(id: string): Promise<void> {
  const { workspaceId } = await requireRole("Admin")
  await db
    .delete(leadRoutingRules)
    .where(and(eq(leadRoutingRules.id, id), eq(leadRoutingRules.userId, workspaceId)))
  revalidatePath("/app/settings")
}

export async function previewRouting(sample: LeadContext): Promise<RoutingOutcome> {
  const { workspaceId } = await getActingUser()
  const scopeIds = await getWorkspaceScopeIds(workspaceId)
  return previewRoutingRules(scopeIds, sample)
}
