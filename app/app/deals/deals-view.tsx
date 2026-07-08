"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateDeal } from "@/app/actions/deals"
import { DEAL_STAGES, formatRevenue, type Deal, type DealStage } from "@/lib/crm-types"
import { contactPath } from "@/lib/routes"

export function DealsView({ deals }: { deals: Deal[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const dealsInStage = (stage: DealStage) => deals.filter((d) => d.stage === stage)
  const stageTotalCents = (stage: DealStage) =>
    dealsInStage(stage).reduce((sum, d) => sum + d.estimatedValueCents, 0)
  const totalValueCents = deals.reduce((sum, d) => sum + d.estimatedValueCents, 0)

  function moveDeal(dealId: string, stage: DealStage) {
    startTransition(async () => {
      try {
        await updateDeal(dealId, { stage })
        toast.success(`Moved to ${stage}`)
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not move deal")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Deals"
        description={`Your pipeline across every stage — ${deals.length} deal${
          deals.length === 1 ? "" : "s"
        }, ${formatRevenue(totalValueCents)} total.`}
      />

      {deals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No deals yet. Open a contact and add a deal to start building your pipeline.
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = dealsInStage(stage)
            return (
              <div key={stage} className="flex w-72 shrink-0 flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold">{stage}</h2>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {stageDeals.length} · {formatRevenue(stageTotalCents(stage))}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {stageDeals.map((d) => (
                    <Card key={d.id}>
                      <CardContent className="flex flex-col gap-2 p-3">
                        <p className="text-sm font-medium leading-snug">{d.title}</p>
                        <Link
                          href={contactPath(d.contactId)}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {d.contactName}
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold tabular-nums">
                            {formatRevenue(d.estimatedValueCents)}
                          </span>
                          {d.probability ? (
                            <span className="text-xs text-muted-foreground">{d.probability}%</span>
                          ) : null}
                        </div>
                        <Select
                          value={d.stage}
                          onValueChange={(v) => {
                            if (v && v !== d.stage) moveDeal(d.id, v as DealStage)
                          }}
                          disabled={pending}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEAL_STAGES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 ? (
                    <p className="rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">
                      No deals
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
