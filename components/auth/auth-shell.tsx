import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SALON_INFO } from "@/lib/constants"

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80"
          alt="A calm, beautifully styled salon space"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241a1d]/95 via-[#2f2125]/55 to-[#2f2125]/20" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Logo light />

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide backdrop-blur">
              <Sparkles className="size-3.5 text-[#f0c9ce]" />
              Beauty, booked beautifully
            </span>
            <h2 className="mt-5 font-heading text-3xl leading-tight font-semibold text-balance">
              A little time for yourself, perfectly planned.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Book trusted salon treatments, manage every appointment and pay securely —
              all in one calm, simple place.
            </p>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="font-heading text-base leading-snug">
                “The easiest salon booking I have ever used. I could see everything,
                choose my time and pay in one go.”
              </p>
              <p className="mt-2 text-xs text-white/55">— Priya, SalonBook guest</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#f0c9ce]" /> Secure Stripe payments
            </span>
            <span>{SALON_INFO.phone}</span>
            <span>{SALON_INFO.email}</span>
          </div>
        </div>
      </aside>

      <main className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Back to home
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-start justify-center px-4 pb-12 sm:px-8 lg:items-center">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-primary uppercase">
                {eyebrow}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
