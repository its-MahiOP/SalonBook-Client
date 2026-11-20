import * as React from "react"
import { cn } from "@/lib/utils"
import { titleCase } from "@/lib/format"

type BadgeVariant = "brand" | "success" | "warning" | "danger" | "neutral" | "info"

const badgeStyles: Record<BadgeVariant, string> = {
  brand: "bg-primary/10 text-primary ring-primary/20",
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-600/25 dark:text-amber-300",
  danger: "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-300",
  neutral: "bg-muted text-muted-foreground ring-border",
  info: "bg-sky-500/10 text-sky-700 ring-sky-600/20 dark:text-sky-300",
}

export function Badge({
  children,
  variant = "neutral",
  className,
  dot = false,
}: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset whitespace-nowrap uppercase",
        badgeStyles[variant],
        className
      )}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export function AppointmentStatusBadge({ status }: { status: string }) {
  const variant: BadgeVariant =
    status === "confirmed" ? "success" : status === "pending" ? "warning" : "danger"
  return <Badge variant={variant} dot>{titleCase(status)}</Badge>
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "paid" ? "success" : "neutral"} dot>
      {titleCase(status)}
    </Badge>
  )
}

export function ServiceStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "active" ? "success" : "neutral"} dot>
      {titleCase(status)}
    </Badge>
  )
}

export function TransactionStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "paid" ? "success" : "danger"} dot>
      {status === "paid" ? "Successful" : "Failed"}
    </Badge>
  )
}
