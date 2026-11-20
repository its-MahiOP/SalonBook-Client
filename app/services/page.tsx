import type { Metadata } from "next"
import { Sparkles } from "lucide-react"

import { PublicShell } from "@/components/layout/public-shell"
import { ServiceCard } from "@/components/services/service-card"
import { ServicesToolbar } from "@/components/services/services-toolbar"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"
import { publicApiFetch } from "@/lib/api"
import type { ApiResponse, Service } from "@/lib/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Explore SalonBook haircuts, colouring, facials, makeup, nails and spa treatments. Filter by category and price.",
}

type SearchParams = Promise<{
  search?: string
  category?: string
  sort?: string
}>

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.category) query.set("category", params.category)
  if (params.sort) query.set("sort", params.sort)

  const response = await publicApiFetch<ApiResponse<Service[]>>(
    `/api/services${query.toString() ? `?${query.toString()}` : ""}`
  )

  const services = response?.data ?? []
  const total = response?.total ?? services.length

  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/50">
        <div className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="container-page relative py-12 sm:py-16">
          <PageHeader
            title="Our salon menu"
            description="Every treatment is performed by experienced stylists using salon-grade products. Choose your service, pick a time and we will take care of the rest."
            action={
              <LinkButton href="/dashboard/customer/appointments" variant="outline" size="sm">
                My appointments
              </LinkButton>
            }
          />
          <ServicesToolbar total={total} />
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-page">
          {services.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} priority={index < 3} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No treatments match your search"
              description="Try a different keyword or clear the filters to see the full salon menu."
              action={<LinkButton href="/services">View all services</LinkButton>}
            />
          )}
        </div>
      </section>
    </PublicShell>
  )
}
