# Lead Integration Module — Design

Status: **Design proposal** (not yet implemented beyond the existing intake core).
Goal: capture leads from **any** channel — web form embeds, inbound email, phone
calls, and webhooks (plus CSV and third‑party integrations) — through **one
normalized pipeline** that always leaves the CRM clean: deduped, scored, and
consistently **tagged, grouped, and routed**.

---

## 1. Principles

1. **One pipeline, many adapters.** Every channel normalizes to a single
   canonical lead payload and flows through the same `ingest → normalize →
   dedupe → enrich/score → segment → automate → notify` core. Channels are thin
   "source adapters"; business logic lives in one place.
2. **Segmentation is a first‑class step, not an afterthought.** Every lead is
   tagged and grouped at intake by a declarative **routing‑rules engine**, using
   a consistent taxonomy. No lead lands untagged or ungrouped.
3. **Clean by construction.** Dedupe + merge, normalized tags/groups, consent
   capture, and idempotency are built into the core so the data stays
   manageable as volume grows.
4. **Safe & observable.** Per‑source keys, spam protection, consent, idempotency,
   an auditable raw‑event log, and per‑source metrics.
5. **Build on what exists.** Reuse and refactor the current intake rather than
   rebuilding it.

---

## 2. What exists today (starting point)

| Capability | Where |
|---|---|
| Core intake (validate → score → dedupe → AI summary → create/update → source+interest tag → "New Leads" group → activity → automations) | `lib/leads/intake.ts` (`processLeadIntake`) |
| Lead webhook (`POST /api/webhooks/leads`, `LEAD_WEBHOOK_SECRET`) | `app/api/webhooks/leads/route.ts` |
| Marketing web form → emails (Resend) + Turnstile + intake | `app/api/contact/route.ts`, `components/marketing/contact-form.tsx` |
| Inbound message → match/create contact + message + activity | `lib/inbox/messages.ts`, `app/api/webhooks/messages/route.ts` |
| CSV import | `app/actions/contacts.ts` (`importContactsFromCsv`) |
| Scoring | `lib/leads/scoring.ts` |
| Automations on intake | `lib/automations/engine.ts` (`processLeadAutomations`) |
| Default tags/groups per industry | `lib/crm-defaults.ts` |

**Gaps this module closes:** channels are separate and inconsistent; there is no
concept of a configurable **lead source**; segmentation is hard‑coded (source
tag + one interest tag + "New Leads"); no field mapping, no routing rules, no
raw‑event audit/idempotency, no admin UI to add/manage sources, and no inbound
email or phone‑call channels.

---

## 3. Architecture

```
                         ┌─────────────────── Source adapters ───────────────────┐
  Web form embed  ─┐     │ /api/lead/[sourceKey]  (embed + generic webhook)       │
  Generic webhook ─┼────▶│ /api/webhooks/leads    (existing, kept)                │
  Inbound email   ─┤     │ /api/inbound/email     (provider parse)                │
  Phone/call      ─┤     │ /api/inbound/call      (Twilio/CallRail)               │
  CSV / import    ─┤     │ server action (batch)                                  │
  Zapier/native   ─┘     └───────────────┬────────────────────────────────────────┘
                                          │ raw event  (lead_events: audit + idempotency)
                                          ▼
                       ┌──────────────  Lead Intake Core  ──────────────┐
                       │ 1 normalize   → canonical LeadPayload           │
                       │ 2 field-map   → apply the source's mapping      │
                       │ 3 dedupe/merge→ email/phone match + merge policy│
                       │ 4 enrich/score→ leadScore, AI summary           │
                       │ 5 SEGMENT     → routing-rules engine:           │
                       │                 tags, groups, owner, lifecycle, │
                       │                 campaign enrollment             │
                       │ 6 automate    → processLeadAutomations          │
                       │ 7 notify      → email/inbox/activity            │
                       └──────────────────────┬─────────────────────────┘
                                              ▼
                                   Contacts · Tags · Groups · Deals · Inbox
```

`processLeadIntake` is refactored into this core; adapters only translate a raw
request into a canonical payload + a `sourceKey`.

### Canonical `LeadPayload`
Superset of today's `leadIntakeSchema`, channel‑agnostic:

```ts
{
  // identity
  firstName?, lastName?, fullName?, email?, phone?,
  // context
  source?, sourceKey, channel: "web_form"|"email"|"call"|"webhook"|"csv"|"api",
  message?, notes?, interest?, keywords?: string[],
  // marketing attribution
  utm?: { source?, medium?, campaign?, term?, content? }, referrer?, landingPage?,
  // location
  address?, city?, state?, zip?, timezone?,
  // consent & dedupe
  consent?: { marketing?: boolean, capturedAt?, ip?, textProof? },
  externalId?,            // provider id for idempotency
  raw?: Record<string, unknown>,  // original payload, stored on the event
  workspaceId?,           // resolved from sourceKey in multi-tenant
}
```

### New data model
- **`lead_sources`** — one row per configured source: `id`, `workspaceId`,
  `name`, `channel`, `key` (public), `secret` (for signed webhooks), `enabled`,
  `fieldMapping` (jsonb), `defaults` (jsonb: source tag/group/owner), `spam`
  (turnstile/honeypot toggles), `createdAt`.
- **`lead_routing_rules`** — ordered rules: `id`, `workspaceId`, `sourceId?`
  (null = all sources), `priority`, `conditions` (jsonb), `actions` (jsonb:
  addTags/addGroups/assignOwner/setLifecycle/enrollCampaign/setLeadStatus),
  `enabled`.
- **`lead_events`** — raw audit + idempotency: `id`, `workspaceId`, `sourceId`,
  `channel`, `externalId?`, `dedupeHash`, `status` (received/processed/failed/
  duplicate), `contactId?`, `payload` (jsonb), `error?`, `createdAt`. Unique on
  `(sourceId, externalId)` for idempotent retries.

---

## 4. Segmentation & tagging (the core emphasis)

Every lead is organized at intake so the CRM stays clean and usable.

**Taxonomy conventions** (enforced by helpers/slugify):
- Source tags: `source-{channel-or-name}` (e.g. `source-facebook`, `source-website-form`).
- Interest/intent tags: `interest-{topic}` from keywords/interest.
- Campaign/UTM tags: `campaign-{utm_campaign}`.
- Lifecycle stays a single field (`lifecycleStage`); tags describe facts, groups describe audiences (existing rule).

**Routing‑rules engine** — declarative, ordered, previewable:
```
WHEN  channel = "web_form" AND utm.campaign = "spring-promo"
THEN  addTags[source-website, campaign-spring-promo]
      addGroups["Spring Promo Leads"]
      enrollCampaign "New Lead Follow-Up"
      assignOwner round-robin

WHEN  leadScore >= 80
THEN  addTags[high-intent]  addGroups["Hot Leads"]  notify owner

WHEN  interest contains "pricing"
THEN  addTags[interest-pricing]  setLeadStatus "Working"
```
- Rules run after scoring; actions are additive and idempotent (reuse the
  `apply_tag` / `add_to_group` executors already built for the AI module).
- **Defaults**: each source carries baseline `defaults` (a source tag + a group)
  so even with zero rules, leads are tagged and grouped.
- **Dedupe/merge policy**: match on normalized email + phone (existing logic);
  on match, merge fields (fill blanks, keep highest score, union tags/groups,
  append notes) instead of creating duplicates — extends current update path.
- **Consent**: capture opt‑in + proof; leads without marketing consent are
  tagged `no-marketing` and excluded from campaign audiences.

An admin can **preview** what a rule set would do against recent `lead_events`
before enabling it (same interpret→preview→approve pattern as the AI command bar).

---

## 5. Channels (source adapters)

| Channel | How it comes in | Notes |
|---|---|---|
| **Web form embed** | Hosted embeddable snippet (`<script>` + styled form, or a copy‑paste HTML form) posting to `POST /api/lead/{sourceKey}` | Turnstile + honeypot; field mapping; per‑source styling; success/redirect config |
| **Generic webhook** | `POST /api/lead/{sourceKey}` (or existing `/api/webhooks/leads`) with signed secret | Provider presets: Facebook Lead Ads, Typeform, Calendly, Google Forms, Jotform |
| **Inbound email** | Provider inbound‑parse (Resend/Postmark/Mailgun/SendGrid) → `POST /api/inbound/email`; per‑workspace address like `leads+{workspaceKey}@inbox.nulacrm.ai` | Parse sender/subject/body; also creates an Inbox conversation |
| **Phone calls** | Call‑tracking (Twilio / CallRail) webhooks → `POST /api/inbound/call` | Missed‑call = lead; store recording + transcription as activity; caller‑ID → phone match/create |
| **CSV / bulk** | Existing import, upgraded with dedupe + field mapping + routing rules | Runs the same core per row |
| **Zapier / Make / native** | Public API + Zapier app wrapping `/api/lead/{sourceKey}` | Opens up long‑tail integrations |

All adapters: resolve `sourceKey → lead_sources` (→ `workspaceId`), record a
`lead_events` row (idempotency/audit), then call the intake core.

---

## 6. Admin UI

New **Settings → Lead sources** area:
- List sources with per‑source status + recent volume/error counts.
- Create a source (pick channel) → get the embed snippet / webhook URL + secret /
  inbound address.
- **Field mapping** editor (provider field → canonical field).
- **Routing rules** builder (conditions → actions) with live preview against
  recent events.
- **Test** button (send a sample lead) and a **recent events** log (view raw
  payload, status, resulting contact, retry failed).

Ties into **Reports** (leads by source already exists) for per‑source conversion.

---

## 7. Cross‑cutting concerns

- **Security**: per‑source public key + signing secret; HMAC signature
  verification for webhooks; Turnstile/honeypot for public forms; rate limiting
  per source/IP.
- **Idempotency & reliability**: `(sourceId, externalId)` unique + `dedupeHash`;
  safe retries; failed events land in a dead‑letter state and are replayable
  from the UI. Move heavy work (AI summary, sends) to an async queue as volume
  grows.
- **Privacy/consent**: store consent + proof; honor opt‑out; PII stays in the
  contact record; raw payloads on `lead_events` are retention‑capped.
- **Multi‑tenant**: `sourceKey` resolves the workspace (replaces reliance on
  `NULA_SHARED_WORKSPACE_ID` for public endpoints).

---

## 8. Development phases

Each phase is independently shippable and **keeps segmentation central**.

### Phase 0 — Foundation & refactor
- Introduce `lead_sources` + `lead_events` tables and migrations.
- Refactor `processLeadIntake` into the intake core with a `sourceKey` +
  canonical `LeadPayload`; make the existing `/api/webhooks/leads` and the
  marketing form route through it as the first two sources.
- Add source **defaults** (source tag + group) so every lead is tagged/grouped.
- Minimal **Settings → Lead sources** list + create + recent events log.
- *Ships:* unified core, auditability, a "sources" concept — no behavior loss.

### Phase 1 — Web form embed
- Per‑source `POST /api/lead/{sourceKey}` endpoint.
- Embeddable form: copy‑paste HTML + a hosted `<script>` widget; Turnstile +
  honeypot; configurable fields, success message/redirect.
- Field mapping v1 (map incoming fields → canonical).
- *Segmentation:* source defaults + UTM capture → `campaign-*` tags.

### Phase 2 — Routing‑rules / segmentation engine
- `lead_routing_rules` model + evaluation step in the core (after scoring).
- Actions reuse existing tag/group/campaign executors; add owner assignment
  (round‑robin) and lifecycle/lead‑status setters.
- Rules **builder UI** with preview against recent events.
- Dedupe/**merge** policy hardened (union tags/groups, keep best data).
- *This is the "clean, manageable segmentation" milestone.*

### Phase 3 — Inbound email
- Provider inbound parsing → `POST /api/inbound/email`; per‑workspace address.
- Parse → canonical payload → core; also open/append an Inbox conversation.

### Phase 4 — Phone calls
- Twilio/CallRail integration → `POST /api/inbound/call`.
- Missed call / voicemail → lead; store recording + transcription as an
  activity; caller‑ID phone dedupe.

### Phase 5 — Provider presets, generic webhooks & Zapier
- Preset mappings for Facebook Lead Ads, Typeform, Calendly, Google Forms, etc.
- Signed generic webhooks; public API + Zapier app.

### Phase 6 — Reliability, scale & observability
- Async queue + retries + dead‑letter replay; rate limiting.
- Per‑source metrics dashboard; CSV import upgraded to the core (dedupe + rules).

---

## 9. Recommended first step

Start with **Phase 0 + Phase 2** together: the refactor gives one clean pipeline,
and the routing‑rules engine delivers the segmentation goal immediately for the
channels we already have (web form + webhook), before adding email/phone. New
channels (Phases 1, 3, 4, 5) then plug into a pipeline that already organizes
every lead consistently.
