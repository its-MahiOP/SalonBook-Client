import { CalendarCheck, ShieldCheck, Sparkles } from "lucide-react"

import { PublicShell } from "@/components/layout/public-shell"
import { Hero } from "@/components/home/hero"
import { CategoryGrid } from "@/components/home/category-grid"
import { ClosingCta, ExperienceSection } from "@/components/home/experience"
import { ServiceCard } from "@/components/services/service-card"
import { SectionHeading, EmptyState } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"
import { publicApiFetch } from "@/lib/api"
import { CATEGORIES } from "@/lib/constants"
import type { ApiResponse, Service, ServiceCategory } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [servicesResponse, categoriesResponse] = await Promise.all([
    publicApiFetch<ApiResponse<Service[]>>("/api/services?limit=6&sort=newest"),
    publicApiFetch<ApiResponse<ServiceCategory[]>>("/api/services/categories"),
  ])

  const featured = servicesResponse?.data ?? []
  const categories =
    categoriesResponse?.data ??
    CATEGORIES.map((name) => ({ name, count: 0 }))

  return (
    <PublicShell>
      <Hero />

      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured treatments"
            title="Loved by our guests this season"
            description="Handpicked salon services our clients keep coming back for — from everyday polish to special-occasion glow."
            action={{ href: "/services", label: "Browse all services" }}
          />

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((service, index) => (
                <ServiceCard key={service.id} service={service} priority={index < 3} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-10"
              icon={Sparkles}
              title="Our service menu is being refreshed"
              description="New treatments are on their way. Please check back shortly or create an account to be ready to book."
              action={<LinkButton href="/sign-up">Create an account</LinkButton>}
            />
          )}
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/40 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Explore by category"
            title="Find exactly what you need"
            description="Whether it is a fresh cut, a glow-up facial or a quiet hour at the spa, start with the category that suits your day."
            align="center"
          />
          <div className="mt-10">
            <CategoryGrid categories={categories} />
          </div>
        </div>
      </section>

      <ExperienceSection />

      <section className="pb-4 sm:pb-10">
        <div className="container-page grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: CalendarCheck,
              title: "Request in seconds",
              text: "Choose a date and time that works for you — no phone calls needed.",
            },
            {
              icon: ShieldCheck,
              title: "Secure online payment",
              text: "Pay for confirmed appointments safely through Stripe checkout.",
            },
            {
              icon: Sparkles,
              title: "Carefully confirmed",
              text: "Our team reviews every request and confirms your slot personally.",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="surface-card flex gap-3.5 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <ClosingCta />
    </PublicShell>
  )
}
