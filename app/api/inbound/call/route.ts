import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"
import { activities } from "@/lib/db/schema"
import { randomId } from "@/lib/library-helpers"
import { processLeadIntake } from "@/lib/leads/intake"
import { resolveSourceByPublicKey, type LeadChannel } from "@/lib/leads/sources"

export const runtime = "nodejs"

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function first(data: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = str(data[k])
    if (v) return v
  }
  return ""
}

export async function POST(request: NextRequest) {
  const key = str(new URL(request.url).searchParams.get("key"))
  const source = key ? await resolveSourceByPublicKey(key) : null
  if (!source || !source.enabled) {
    return NextResponse.json({ ok: false, error: "Unknown call source" }, { status: 404 })
  }
  const workspaceId = source.userId

  const contentType = request.headers.get("content-type") ?? ""
  const data: Record<string, unknown> = {}
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}))
    if (body && typeof body === "object") Object.assign(data, body)
  } else {
    const form = await request.formData().catch(() => null)
    if (form) for (const [k, v] of form.entries()) data[k] = typeof v === "string" ? v : ""
  }

  // Provider-agnostic (Twilio / CallRail) field extraction.
  const phone = first(data, ["From", "Caller", "caller_id", "customer_phone_number", "phone"])
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Missing caller phone" }, { status: 400 })
  }
  const callerName = first(data, ["CallerName", "caller_name", "customer_name"])
  const status =
    first(data, ["CallStatus", "call_status", "answered"]) || "received"
  const recordingUrl = first(data, ["RecordingUrl", "recording", "recording_url", "recording_player"])
  const transcript = first(data, ["TranscriptionText", "transcription", "transcript"])
  const duration = first(data, ["CallDuration", "RecordingDuration", "duration"])

  const isMissed = /no-?answer|busy|failed|missed|no/i.test(status)
  const [firstName, ...rest] = (callerName || `Caller ${phone}`).split(/\s+/)

  const summaryParts = [
    `Inbound call (${status})`,
    duration ? `${duration}s` : "",
    transcript ? `Transcript: ${transcript}` : "",
  ].filter(Boolean)

  let contactId: string
  try {
    const result = await processLeadIntake(
      {
        firstName: firstName || "Caller",
        lastName: rest.join(" "),
        phone,
        source: source.key,
        message: summaryParts.join(" — "),
      },
      {
        source: { key: source.key, name: source.name, channel: source.channel as LeadChannel },
        workspaceId,
      },
    )
    contactId = result.contactId
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not process call" },
      { status: 400 },
    )
  }

  const activityMessage = [
    `${isMissed ? "Missed call" : "Inbound call"} from ${phone}${callerName ? ` (${callerName})` : ""}`,
    duration ? `· ${duration}s` : "",
    transcript ? `\nTranscript: ${transcript}` : "",
    recordingUrl ? `\nRecording: ${recordingUrl}` : "",
  ]
    .filter(Boolean)
    .join(" ")

  await db.insert(activities).values({
    id: randomId("a"),
    userId: workspaceId,
    type: "call_made",
    message: activityMessage,
    contactId,
    actorId: "inbound-call",
  })

  return NextResponse.json({ ok: true, contactId })
}
