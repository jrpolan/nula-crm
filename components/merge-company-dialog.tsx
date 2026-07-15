"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Loader2, Merge } from "lucide-react"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listCompanies, mergeCompany } from "@/app/actions/companies"
import { companyPath } from "@/lib/routes"
import type { Company } from "@/lib/crm-types"

export function MergeCompanyDialog({
  open,
  onOpenChange,
  company,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company
}) {
  const router = useRouter()
  const { data: comps } = useSWR<Company[]>(open ? "companies" : null, listCompanies)
  const [targetId, setTargetId] = useState("")
  const [merging, setMerging] = useState(false)

  const others = (comps ?? []).filter((c) => c.id !== company.id)

  async function handleMerge() {
    if (!targetId) {
      toast.error("Pick a company to merge into")
      return
    }
    setMerging(true)
    try {
      await mergeCompany(company.id, targetId)
      toast.success("Companies merged")
      onOpenChange(false)
      router.push(companyPath(targetId))
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not merge companies")
    } finally {
      setMerging(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge company</DialogTitle>
          <DialogDescription>
            Move all contacts and locations from <strong>{company.name}</strong> into another
            company, then delete <strong>{company.name}</strong>. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Merge into</FieldLabel>
            <Select value={targetId} onValueChange={(v) => setTargetId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a company…">
                  {(v: string) => others.find((c) => c.id === v)?.name ?? "Choose a company…"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {others.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={merging}>
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={merging || !targetId}>
            {merging ? <Loader2 className="animate-spin" /> : <Merge />}
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
