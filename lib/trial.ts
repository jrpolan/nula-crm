/** Length of the free trial for new workspaces. */
export const TRIAL_DAYS = 7

/** The moment a trial started `from` should end. */
export function trialEndDate(from: Date = new Date()): Date {
  return new Date(from.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
}

export type WorkspacePlan = "trial" | "active"

export type TrialStatus = {
  plan: string
  trialEndsAt: string | null
  daysLeft: number
  isTrialing: boolean
  isExpired: boolean
}

/**
 * Derive a workspace's trial state from its stored plan + trial end date.
 * A missing end date is treated as a full fresh trial (fail-open) so nobody is
 * accidentally locked out.
 */
export function computeTrialStatus(plan: string, trialEndsAt: Date | null): TrialStatus {
  const iso = trialEndsAt ? trialEndsAt.toISOString() : null

  if (plan !== "trial") {
    return { plan, trialEndsAt: iso, daysLeft: 0, isTrialing: false, isExpired: false }
  }
  if (!trialEndsAt) {
    return { plan, trialEndsAt: null, daysLeft: TRIAL_DAYS, isTrialing: true, isExpired: false }
  }

  const ms = trialEndsAt.getTime() - Date.now()
  const daysLeft = Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
  return { plan, trialEndsAt: iso, daysLeft, isTrialing: ms > 0, isExpired: ms <= 0 }
}
