import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
}) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "SB"

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "User avatar"}
        width={size}
        height={size}
        className={cn(
          "shrink-0 rounded-full border border-border/60 object-cover",
          className
        )}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#7d4a55] font-semibold text-primary-foreground",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  )
}
