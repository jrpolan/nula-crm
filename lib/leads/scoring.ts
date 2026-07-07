import { leadScoreLabel } from "@/lib/crm-types"

export type LeadScoringInput = {
  source?: string
  email?: string
  phone?: string
  message?: string
  notes?: string
  keywords?: string[]
  interest?: string
}

const HIGH_INTENT_SOURCES = ["referral", "google-ads", "google", "facebook", "website-form", "booking"]
const INTENT_KEYWORDS = [
  "pricing",
  "price",
  "book",
  "appointment",
  "available",
  "schedule",
  "cost",
  "today",
  "asap",
  "urgent",
]

export function calculateLeadScore(input: LeadScoringInput): number {
  let score = 25
  const source = (input.source ?? "").toLowerCase()
  const text = `${input.message ?? ""} ${input.notes ?? ""} ${input.interest ?? ""}`.toLowerCase()

  if (HIGH_INTENT_SOURCES.some((s) => source.includes(s))) score += 20
  if (source.includes("referral")) score += 15

  for (const kw of INTENT_KEYWORDS) {
    if (text.includes(kw)) score += 8
  }

  for (const kw of input.keywords ?? []) {
    if (text.includes(kw.toLowerCase())) score += 5
  }

  if (input.email?.trim()) score += 8
  if (input.phone?.trim()) score += 12

  return Math.min(100, Math.max(0, score))
}

export function recommendedNextActionForLead(score: number, source?: string): string {
  const label = leadScoreLabel(score)
  if (label === "Hot") {
    return "Call within 15 minutes and send the intro offer follow-up sequence."
  }
  if (label === "Warm") {
    return "Send a personalized follow-up email and schedule a call within 24 hours."
  }
  if (label === "Nurture") {
    return "Add to new lead nurture sequence and follow up within 48 hours."
  }
  return `Review lead quality from ${source || "unknown source"} before outreach.`
}
