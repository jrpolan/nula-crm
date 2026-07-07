"use server"

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { automations } from "@/lib/db/schema"
import { getActingUser, workspaceUserIdMatches } from "@/lib/auth-helpers"
import {
  runInactiveCustomerAutomation,
  seedDefaultAutomations,
} from "@/lib/automations/engine"

export async function listAutomations() {
  const { workspaceId, scopeIds } = await getActingUser()
  await seedDefaultAutomations(workspaceId)

  const rows = await db
    .select()
    .from(automations)
    .where(workspaceUserIdMatches(automations.userId, scopeIds))
    .orderBy(automations.name)

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    trigger: r.trigger,
    action: r.action,
    enabled: r.enabled,
    lastRunAt: r.lastRunAt?.toISOString() ?? null,
    config: r.config,
  }))
}

export async function toggleAutomation(automationId: string, enabled: boolean) {
  const { scopeIds } = await getActingUser()
  await db
    .update(automations)
    .set({ enabled })
    .where(and(eq(automations.id, automationId), workspaceUserIdMatches(automations.userId, scopeIds)))
  revalidatePath("/automations")
  return { ok: true }
}

export async function runInactiveDetectionNow() {
  const { workspaceId } = await getActingUser()
  const result = await runInactiveCustomerAutomation(workspaceId)
  revalidatePath("/automations")
  revalidatePath("/dashboard")
  revalidatePath("/campaigns")
  return result
}
