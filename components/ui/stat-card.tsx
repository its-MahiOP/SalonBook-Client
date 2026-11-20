import * as React from "react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "rose",
}: {
  label: string
  value: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  hint?: string
  tone?: "rose" | "gold" | "green" | "blue" | "plum" | "neutral"
}) {
  const tones = {
    rose: "bg-primary/10 text-primary",
    gold: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    blue: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    plum: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    neutral: "bg-muted text-muted-foreground",
  }

  return (
    <div className="surface-card flex items-start gap-4 p-5">
      {Icon ? (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            tones[tone]
          )}
        >
          <Icon className="size-5" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  )
}
