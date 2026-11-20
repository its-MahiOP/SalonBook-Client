import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { LinkButton } from "@/components/ui/link-button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=2000&q=80"
          alt="Warm, elegant SalonBook salon interior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#251a1d]/92 via-[#352327]/75 to-[#352327]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#221a1c]/60 via-transparent to-transparent" />
      </div>

      <div className="container-page flex min-h-[620px] flex-col justify-center py-20 sm:min-h-[660px]">
        <div className="max-w-2xl text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
            <Sparkles className="size-3.5 text-[#f0c9ce]" />
            Beauty, booked beautifully
          </span>

          <h1 className="mt-6 font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Your next beautiful moment starts at{" "}
            <span className="text-[#f0c9ce]">SalonBook</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Discover expert haircuts, radiant facials, flawless makeup and calming spa
            rituals. Choose your treatment, pick a time and let our stylists take care
            of the rest.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href="/services"
              size="lg"
              className="h-12 gap-2 px-6 text-sm shadow-lg shadow-black/20"
            >
              Explore Salon Services <ArrowRight className="size-4" />
            </LinkButton>
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
            >
              Create an Account
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <span className="flex -space-x-2">
                {["#f0c9ce", "#e7b7be", "#d99aa4"].map((color) => (
                  <span
                    key={color}
                    className="size-8 rounded-full border-2 border-[#352327]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              <span>
                <strong className="font-semibold text-white">2,400+</strong> happy clients
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-[#f0c9ce] text-[#f0c9ce]" />
              <strong className="font-semibold text-white">4.9</strong> average rating
            </span>
            <span className="hidden sm:block">Open 7 days a week</span>
          </div>
        </div>
      </div>
    </section>
  )
}
