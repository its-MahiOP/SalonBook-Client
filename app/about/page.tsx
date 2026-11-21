import type { Metadata } from "next"
import Link from "next/link"
import { Award, HeartHandshake, Leaf, Sparkles, Timer, Users } from "lucide-react"

import { PublicShell } from "@/components/layout/public-shell"
import { PageHeader } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet SalonBook — a boutique salon experience built around expert stylists, calm spaces and easy online booking.",
}

const values = [
  {
    icon: Sparkles,
    title: "Craft first",
    description:
      "Every cut, colour and treatment is delivered by stylists who train continuously and take pride in the details.",
  },
  {
    icon: HeartHandshake,
    title: "Warm hospitality",
    description:
      "From the welcome tea to the final mirror reveal, we want every visit to feel unhurried and personal.",
  },
  {
    icon: Leaf,
    title: "Thoughtful products",
    description:
      "We favour gentle, cruelty-free formulas and recycle wherever we can without compromising results.",
  },
]

const stats = [
  { icon: Users, value: "12k+", label: "Happy guests" },
  { icon: Award, value: "18", label: "Expert stylists" },
  { icon: Timer, value: "9 yrs", label: "Serving the city" },
]

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="container-page py-10 sm:py-14">
        <PageHeader
          title="A salon built around you"
          description="SalonBook began with a simple idea: great beauty services should be easy to find, easy to book and a pleasure to experience."
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="surface-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Our story</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                We opened our doors in a small two-chair studio and quickly learned that guests
                return for more than a good haircut. They come back for the calm hour away from
                everything else, the stylist who remembers their name, and the confidence that
                comes with leaving exactly as they hoped.
              </p>
              <p>
                Today SalonBook is a full-service salon with a team of specialists across hair,
                skin, nails and spa treatments. What has not changed is the way we work: one guest
                at a time, with a plan made for them.
              </p>
              <p>
                Our online booking is designed to match that experience. Choose a service, pick a
                time that suits you and manage everything from your dashboard — no phone tag, no
                double bookings, no surprises at the desk.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <LinkButton href="/services" className="h-10 px-4">
                Browse services
              </LinkButton>
              <LinkButton href="/contact" variant="outline" className="h-10 px-4">
                Visit the salon
              </LinkButton>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="surface-card flex items-center gap-4 p-5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-semibold leading-none">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="surface-card p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-3 text-base font-semibold">{value.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            )
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#7d4a55] p-6 text-primary-foreground sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Ready when you are
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/85">
            Create a free account to book appointments, track your visit history and keep your
            payment receipts in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <LinkButton
              href="/sign-up"
              variant="secondary"
              className="h-10 px-4 text-foreground"
            >
              Create an account
            </LinkButton>
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center rounded-lg border border-white/30 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </PublicShell>
  )
}
