import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Check,
  Clock3,
  HeartHandshake,
  Leaf,
  Scissors,
  Sparkles,
} from "lucide-react"

import { PublicShell } from "@/components/layout/public-shell"
import { BookingPanel } from "@/components/booking/booking-panel"
import { ServiceCard } from "@/components/services/service-card"
import { SectionHeading } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { publicApiFetch } from "@/lib/api"
import { formatCurrency, formatDuration } from "@/lib/format"
import type { ApiResponse, Service } from "@/lib/types"

export const dynamic = "force-dynamic"

type Params = Promise<{ id: string }>

async function getService(id: string) {
  const response = await publicApiFetch<ApiResponse<Service>>(`/api/services/${id}`)
  return response?.data ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const service = await getService(id)
  if (!service) return { title: "Service not found" }
  return {
    title: service.serviceName,
    description: service.description.slice(0, 155),
    openGraph: {
      title: `${service.serviceName} · SalonBook`,
      description: service.description.slice(0, 155),
      images: service.image ? [{ url: service.image }] : undefined,
    },
  }
}

const promises = [
  "Personal consultation before we begin",
  "Premium, skin-friendly salon products",
  "Finished and styled to suit you",
]

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const service = await getService(id)
  if (!service) notFound()

  const relatedResponse = await publicApiFetch<ApiResponse<Service[]>>(
    `/api/services?category=${encodeURIComponent(service.category)}&limit=4`
  )
  const related = (relatedResponse?.data ?? [])
    .filter((item) => item.id !== service.id)
    .slice(0, 3)

  return (
    <PublicShell>
      <div className="border-b border-border/60 bg-secondary/40">
        <div className="container-page py-4">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-foreground">{service.serviceName}</span>
          </nav>
        </div>
      </div>

      <section className="py-8 sm:py-12">
        <div className="container-page">
          <Link
            href="/services"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Back to all services
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted shadow-lg shadow-primary/10">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.serviceName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image available
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge variant="brand" className="bg-white/95 text-[#8d4f5b] ring-white/50">
                    {service.category}
                  </Badge>
                  {service.status === "inactive" ? (
                    <Badge variant="neutral" className="bg-white/95">
                      Unavailable
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                  Salon treatment
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {service.serviceName}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-primary" />
                    {formatDuration(service.duration)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Scissors className="size-4 text-primary" />
                    Expert stylist
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="size-4 text-primary" />
                    {formatCurrency(service.price)}
                  </span>
                </div>

                <p className="mt-5 text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {promises.map((promise) => (
                    <div
                      key={promise}
                      className="flex items-start gap-2 rounded-xl border border-border/70 bg-card p-3.5 text-xs leading-relaxed text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {promise}
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-border/70 bg-card p-5">
                  <h2 className="text-sm font-semibold">Good to know</h2>
                  <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex gap-2.5">
                      <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />
                      Arrive five minutes early so we can settle you in and talk through
                      your treatment.
                    </li>
                    <li className="flex gap-2.5">
                      <HeartHandshake className="mt-0.5 size-4 shrink-0 text-primary" />
                      Let us know about allergies or sensitivities in the notes when you
                      book.
                    </li>
                    <li className="flex gap-2.5">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" />
                      Please give at least 24 hours notice if you need to change your
                      appointment.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <BookingPanel service={service} />
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border/60 bg-secondary/30 py-14">
          <div className="container-page">
            <SectionHeading
              eyebrow="You may also like"
              title={`More ${service.category.toLowerCase()} treatments`}
              action={{ href: `/services?category=${encodeURIComponent(service.category)}`, label: "See category" }}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PublicShell>
  )
}
