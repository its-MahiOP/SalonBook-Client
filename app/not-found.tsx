import Link from "next/link"
import { Scissors, Home, Search } from "lucide-react"

import { LinkButton } from "@/components/ui/link-button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Scissors className="size-8" />
      </span>
      <p className="mt-6 text-xs font-bold tracking-[0.2em] text-primary uppercase">
        Error 404
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        This page has been trimmed away
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you are looking for does not exist, or the treatment may no longer be on
        our menu. Let us help you find your way back.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <LinkButton href="/" className="h-11 gap-2">
          <Home className="size-4" /> Back to home
        </LinkButton>
        <LinkButton href="/services" variant="outline" className="h-11 gap-2">
          <Search className="size-4" /> Browse services
        </LinkButton>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Need a hand?{" "}
        <Link href="/" className="font-semibold text-primary hover:underline">
          hello@salonbook.com
        </Link>
      </p>
    </div>
  )
}
