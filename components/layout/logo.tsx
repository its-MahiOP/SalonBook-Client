import Link from "next/link"
import { Scissors } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  compact = false,
  light = false,
}: {
  className?: string
  compact?: boolean
  light?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="SalonBook home"
    >
      <span className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#8d4f5b] text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
        <Scissors className="size-[18px]" />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-xl font-semibold tracking-tight",
              light ? "text-white" : "text-foreground"
            )}
          >
            SalonBook
          </span>
          <span
            className={cn(
              "mt-0.5 text-[10px] font-semibold tracking-[0.22em] uppercase",
              light ? "text-white/70" : "text-muted-foreground"
            )}
          >
            Beauty & Care
          </span>
        </span>
      ) : null}
    </Link>
  )
}
