"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertTriangle, Clock, X } from "lucide-react"

import { APP_ROUTES } from "@/lib/routes"
import type { TrialStatus } from "@/lib/trial"

const PLAN_TAB = `${APP_ROUTES.settings}?tab=plan`

export function TrialBanner({ status }: { status: TrialStatus }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!status.isTrialing) return
    // Defer off the synchronous effect path (avoids cascading-render lint rule).
    queueMicrotask(() =>
      setDismissed(localStorage.getItem(`nula-trial-dismissed-${status.daysLeft}`) === "1"),
    )
  }, [status.isTrialing, status.daysLeft])

  if (status.plan !== "trial") return null

  if (status.isExpired) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-amber-300/60 bg-amber-100 px-4 py-2 text-sm text-amber-900">
        <span className="inline-flex items-center gap-2 font-medium">
          <AlertTriangle className="size-4" />
          Your free trial has ended.
        </span>
        <Link href={PLAN_TAB} className="font-semibold underline underline-offset-2 hover:opacity-80">
          Upgrade to keep using Nula
        </Link>
      </div>
    )
  }

  if (dismissed) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-nula-violet/15 bg-nula-violet/8 px-4 py-2 text-sm text-foreground">
      <span className="inline-flex items-center gap-2">
        <Clock className="size-4 text-nula-violet" />
        <span className="font-medium">
          {status.daysLeft} day{status.daysLeft === 1 ? "" : "s"} left
        </span>{" "}
        in your free Nula trial.
      </span>
      <Link
        href={PLAN_TAB}
        className="font-semibold text-nula-violet underline underline-offset-2 hover:opacity-80"
      >
        Upgrade
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(`nula-trial-dismissed-${status.daysLeft}`, "1")
          setDismissed(true)
        }}
        className="ml-1 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
