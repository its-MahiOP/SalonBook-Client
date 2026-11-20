import Link from "next/link"
import {
  Brush,
  Droplets,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react"
import type { ServiceCategory } from "@/lib/types"

const categoryStyles: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; gradient: string; blurb: string }
> = {
  "Haircut & Styling": {
    icon: Scissors,
    gradient: "from-rose-100 to-rose-50 dark:from-rose-950/50 dark:to-rose-900/20",
    blurb: "Precision cuts and polished finishes",
  },
  "Hair Coloring": {
    icon: Palette,
    gradient: "from-amber-100 to-amber-50 dark:from-amber-950/50 dark:to-amber-900/20",
    blurb: "Glossy tones and dimensional colour",
  },
  "Hair Treatment": {
    icon: Droplets,
    gradient: "from-sky-100 to-sky-50 dark:from-sky-950/50 dark:to-sky-900/20",
    blurb: "Repair, hydrate and restore shine",
  },
  "Facial & Skincare": {
    icon: Sparkles,
    gradient: "from-emerald-100 to-emerald-50 dark:from-emerald-950/50 dark:to-emerald-900/20",
    blurb: "Fresh, glowing and cared-for skin",
  },
  Makeup: {
    icon: Brush,
    gradient: "from-purple-100 to-purple-50 dark:from-purple-950/50 dark:to-purple-900/20",
    blurb: "Soft glam to bridal perfection",
  },
  "Manicure & Pedicure": {
    icon: Hand,
    gradient: "from-pink-100 to-pink-50 dark:from-pink-950/50 dark:to-pink-900/20",
    blurb: "Neat nails and long-lasting polish",
  },
  "Spa & Massage": {
    icon: Flower2,
    gradient: "from-teal-100 to-teal-50 dark:from-teal-950/50 dark:to-teal-900/20",
    blurb: "Slow down, breathe and unwind",
  },
}

export function CategoryGrid({ categories }: { categories: ServiceCategory[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const style =
          categoryStyles[category.name] || categoryStyles["Haircut & Styling"]
        const Icon = style.icon
        return (
          <Link
            key={category.name}
            href={`/services?category=${encodeURIComponent(category.name)}`}
            className="group surface-card relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
          >
            <div
              className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-[#8d4f5b] shadow-inner`}
            >
              <Icon className="size-6" />
            </div>
            <h3 className="text-base font-semibold">{category.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {style.blurb}
            </p>
            <p className="mt-3 text-xs font-semibold text-primary">
              {category.count} {category.count === 1 ? "service" : "services"} →
            </p>
          </Link>
        )
      })}

      <Link
        href="/services"
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#3b2a2e] p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
          <Sparkles className="size-6 text-[#f0c9ce]" />
        </div>
        <div className="mt-6">
          <h3 className="font-heading text-base font-semibold">Not sure where to start?</h3>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            Browse the full menu and find your perfect treatment.
          </p>
          <span className="mt-3 inline-block text-xs font-semibold text-[#f0c9ce]">
            View all services →
          </span>
        </div>
      </Link>
    </div>
  )
}
