"use client"

import * as React from "react"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </span>
      <p className="mt-6 text-xs font-bold tracking-[0.2em] text-destructive uppercase">
        Something went wrong
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        A small snag in the salon
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        We could not finish loading this page. Please try again — if the problem keeps
        happening, the salon team is happy to help.
      </p>
      {error.digest ? (
        <p className="mt-2 rounded-full bg-muted px-3 py-1 font-mono text-[11px] text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={reset} className="h-11 gap-2">
          <RotateCcw className="size-4" /> Try again
        </Button>
        <LinkButton href="/" variant="outline" className="h-11 gap-2">
          <Home className="size-4" /> Back to home
        </LinkButton>
      </div>
    </div>
  )
}
