import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function AutomationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Automations" description="When this happens, do that — coming in Phase 5." />
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          New lead follow-up, reactivation detection, and review requests will live here.
        </CardContent>
      </Card>
    </div>
  )
}
