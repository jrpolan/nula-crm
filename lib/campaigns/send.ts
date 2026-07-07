import "server-only"

import type { campaigns } from "@/lib/db/schema"

type CampaignRow = typeof campaigns.$inferSelect
type ContactRow = {
  id: string
  email: string
  phone: string
  firstName: string
  optInStatus: string
}

type SequenceStep = {
  step: number
  channel: string
  subject?: string
  body?: string
  delayDays?: number
}

export async function sendCampaignMessages(campaign: CampaignRow, contacts: ContactRow[]) {
  const sequence = (campaign.sequence ?? []) as SequenceStep[]
  const resendKey = process.env.RESEND_API_KEY?.trim()
  const contactIds = contacts.map((c) => c.id)

  if (contactIds.length === 0) {
    return {
      sent: false,
      contactIds: [],
      message: "No eligible recipients in audience. Campaign saved as scheduled.",
    }
  }

  if (!resendKey) {
    return {
      sent: false,
      contactIds,
      message: `Campaign approved for ${contactIds.length} recipient(s). Add RESEND_API_KEY to send emails.`,
    }
  }

  const firstEmail = sequence.find((s) => s.channel === "email")
  if (!firstEmail) {
    return {
      sent: false,
      contactIds,
      message: "No email step in sequence. Campaign marked active without sends.",
    }
  }

  let sentCount = 0
  const from = process.env.RESEND_FROM_EMAIL?.trim() ?? "onboarding@resend.dev"

  for (const contact of contacts) {
    if (!contact.email) continue
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: contact.email,
          subject: firstEmail.subject ?? campaign.name,
          html: `<p>${(firstEmail.body ?? "").replace(/\n/g, "<br>")}</p>`,
        }),
      })
      if (response.ok) sentCount++
    } catch (error) {
      console.error("Resend send failed:", error)
    }
  }

  return {
    sent: sentCount > 0,
    contactIds,
    message:
      sentCount > 0
        ? `Sent first email to ${sentCount} of ${contactIds.length} recipient(s).`
        : `Could not send emails. Campaign saved — check RESEND_API_KEY and recipient addresses.`,
  }
}
