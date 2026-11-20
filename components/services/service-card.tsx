import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3 } from "lucide-react"
import type { Service } from "@/lib/types"
import { formatCurrency, formatDuration } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <Link
        href={`/services/${service.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {service.image ? (
          <Image
            src={service.image}
            alt={service.serviceName}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <Badge variant="brand" className="bg-white/95 text-[#8d4f5b] ring-white/50">
            {service.category}
          </Badge>
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#32262a] shadow-sm">
            {formatCurrency(service.price)}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-semibold">
          <Link href={`/services/${service.id}`} className="hover:text-primary">
            {service.serviceName}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock3 className="size-3.5 text-primary" />
            {formatDuration(service.duration)}
          </span>
          <Link
            href={`/services/${service.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-1.5"
          >
            View Details <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
