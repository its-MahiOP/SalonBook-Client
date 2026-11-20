import Image from "next/image"
import { Check, HeartHandshake, Leaf, Sparkles, Timer } from "lucide-react"
import { LinkButton } from "@/components/ui/link-button"

const features = [
  {
    icon: HeartHandshake,
    title: "Stylists who listen",
    description:
      "Every appointment starts with a proper consultation, so the result always feels like you.",
  },
  {
    icon: Leaf,
    title: "Kind, premium products",
    description:
      "We choose salon-grade, skin-friendly products that care for your hair and skin as much as you do.",
  },
  {
    icon: Timer,
    title: "Booking that respects your time",
    description:
      "Pick a slot that suits you, get an instant request and confirmation without a single phone call.",
  },
]

export function ExperienceSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 sm:aspect-[5/6]">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
              alt="A SalonBook stylist carefully styling a client's hair"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -right-3 bottom-6 w-56 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-right-8 sm:w-64 sm:p-5">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                Signature care
              </span>
            </div>
            <p className="mt-2 font-heading text-lg leading-snug font-semibold">
              “I left feeling completely myself again.”
            </p>
            <p className="mt-2 text-xs text-muted-foreground">— Amara, regular guest</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mb-2.5 text-xs font-bold tracking-[0.2em] text-primary uppercase">
            The SalonBook experience
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            More than a salon visit — a little ritual for yourself
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            From the first consultation to the final mirror moment, our space is designed
            to feel unhurried, warm and entirely yours. Come as you are; leave feeling
            polished and restored.
          </p>

          <div className="mt-8 space-y-5">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-primary" /> Certified stylists
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-primary" /> Hygienic, calm space
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-primary" /> Easy online booking
            </span>
          </div>

          <LinkButton href="/services" className="mt-8 h-11 px-6">
            Find your treatment
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

export function ClosingCta() {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#3b2a2e] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#f0c9ce] uppercase">
              A little time for you
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Ready to book your next beautiful moment?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
              Create your free account, choose a treatment and request a time. We will
              confirm your appointment and take care of everything else.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton
                href="/sign-up"
                size="lg"
                className="h-11 border border-white/20 bg-white px-6 text-[#32262a] hover:bg-white/90"
              >
                Create your account
              </LinkButton>
              <LinkButton
                href="/services"
                size="lg"
                variant="outline"
                className="h-11 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                Explore services
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
