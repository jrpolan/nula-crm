"use client"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CAMPAIGN_TEMPLATES } from "@/lib/crm-defaults"
import type { Campaign } from "@/lib/crm-types"

export function CampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaigns"
        description="Email, SMS, and sequences — built from templates and AI drafts."
      />

      <div>
        <h2 className="mb-3 text-sm font-semibold">Templates</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {CAMPAIGN_TEMPLATES.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{t.goal}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Your campaigns</h2>
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No campaigns yet. Use the AI command bar: &quot;Create a reactivation campaign for customers who
              haven&apos;t bought in 90 days.&quot;
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription>{c.goal}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge>{c.type}</Badge>
                  <Badge variant="secondary">{c.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
