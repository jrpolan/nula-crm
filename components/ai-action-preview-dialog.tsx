"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { approveAiAction, cancelAiAction } from "@/app/actions/ai"
import type { AiActionPreview } from "@/lib/crm-types"

export function AiActionPreviewDialog({
  open,
  onOpenChange,
  actionId,
  preview,
  requiresApproval,
  onComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionId: string
  preview: AiActionPreview
  requiresApproval: boolean
  onComplete: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleApprove() {
    setLoading(true)
    try {
      const result = await approveAiAction(actionId)
      toast.success(result.summary)
      onOpenChange(false)
      onComplete()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not execute action")
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    await cancelAiAction(actionId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Proposed action</DialogTitle>
          <DialogDescription>{preview.title}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          <p className="text-muted-foreground">{preview.description}</p>
          {preview.criteria.length > 0 ? (
            <div>
              <p className="mb-2 font-medium">Criteria</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {preview.criteria.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {preview.warnings.length > 0 ? (
            <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
              {preview.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          ) : null}
          {preview.impactCount > 0 ? (
            <p className="font-medium">Estimated impact: {preview.impactCount} contact(s)</p>
          ) : null}
        </div>

        {requiresApproval ? (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Approve"}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
