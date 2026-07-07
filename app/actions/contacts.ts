"use server"

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { activities, contactGroups, contactTags, contacts, groups, tags } from "@/lib/db/schema"
import { getActingUser, workspaceUserIdMatches } from "@/lib/auth-helpers"
import { randomId } from "@/lib/library-helpers"
import { mapContact } from "@/lib/mappers"
import type { Contact, LifecycleStage } from "@/lib/crm-types"

export type ContactInput = {
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  source?: string
  lifecycleStage?: LifecycleStage
  notes?: string
  productsPurchased?: string
  leadScore?: number
}

export async function createContact(input: ContactInput): Promise<Contact> {
  const { user, workspaceId } = await getActingUser()
  if (!input.firstName?.trim()) throw new Error("First name is required")

  const firstName = input.firstName.trim()
  const lastName = input.lastName?.trim() ?? ""

  const [row] = await db
    .insert(contacts)
    .values({
      id: randomId("ct"),
      userId: workspaceId,
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" "),
      email: input.email ?? "",
      phone: input.phone ?? "",
      address: input.address ?? "",
      city: input.city ?? "",
      state: input.state ?? "",
      zip: input.zip ?? "",
      source: input.source ?? "manual",
      lifecycleStage: input.lifecycleStage ?? "New Lead",
      notes: input.notes ?? "",
      productsPurchased: input.productsPurchased ?? "",
      leadScore: input.leadScore ?? 0,
      lastActivityAt: new Date(),
    })
    .returning()

  await db.insert(activities).values({
    id: randomId("a"),
    userId: workspaceId,
    type: "created",
    message: `added contact ${firstName} ${lastName}`.trim(),
    contactId: row.id,
    actorId: user.id,
  })

  revalidatePath("/contacts")
  revalidatePath("/dashboard")
  return mapContact(row)
}

export async function updateContact(id: string, input: Partial<ContactInput>): Promise<Contact> {
  const { scopeIds } = await getActingUser()

  const patch: Record<string, string | number | Date | null> = {}
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) patch[key] = value as string | number
  }
  if (input.firstName || input.lastName) {
    const first = input.firstName ?? ""
    const last = input.lastName ?? ""
    patch.name = [first, last].filter(Boolean).join(" ")
  }
  patch.lastActivityAt = new Date()

  const [row] = await db
    .update(contacts)
    .set(patch)
    .where(and(eq(contacts.id, id), workspaceUserIdMatches(contacts.userId, scopeIds)))
    .returning()
  if (!row) throw new Error("Contact not found")

  revalidatePath("/contacts")
  revalidatePath(`/contacts/${id}`)
  return mapContact(row)
}

export async function deleteContact(id: string): Promise<void> {
  const { scopeIds } = await getActingUser()

  await db.delete(contactTags).where(eq(contactTags.contactId, id))
  await db.delete(contactGroups).where(eq(contactGroups.contactId, id))
  await db.delete(activities).where(and(eq(activities.contactId, id), workspaceUserIdMatches(activities.userId, scopeIds)))
  await db.delete(contacts).where(and(eq(contacts.id, id), workspaceUserIdMatches(contacts.userId, scopeIds)))

  revalidatePath("/contacts")
  revalidatePath("/dashboard")
}

export async function addTagToContact(contactId: string, tagId: string) {
  const { user, workspaceId } = await getActingUser()
  await db.insert(contactTags).values({ contactId, tagId, addedBy: user.id }).onConflictDoNothing()
  await db.insert(activities).values({
    id: randomId("a"),
    userId: workspaceId,
    type: "tag_added",
    message: "tag added to contact",
    contactId,
    actorId: user.id,
  })
  revalidatePath(`/contacts/${contactId}`)
}

export async function addContactToGroup(contactId: string, groupId: string) {
  const { user, workspaceId } = await getActingUser()
  await db.insert(contactGroups).values({ contactId, groupId, addedBy: user.id }).onConflictDoNothing()
  await db.insert(activities).values({
    id: randomId("a"),
    userId: workspaceId,
    type: "group_changed",
    message: "contact added to group",
    contactId,
    actorId: user.id,
  })
  revalidatePath(`/contacts/${contactId}`)
  revalidatePath("/groups")
}
