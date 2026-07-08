import { DealsView } from "./deals-view"
import { getDeals } from "@/lib/queries"
import { appPageMetadata } from "@/lib/seo"
import { APP_ROUTES } from "@/lib/routes"

export const metadata = appPageMetadata(
  "Deals",
  "Track your sales pipeline in Nula CRM — deals by stage, value, and next steps.",
  APP_ROUTES.deals,
)

export const dynamic = "force-dynamic"

export default async function DealsPage() {
  const deals = await getDeals()
  return <DealsView deals={deals} />
}
