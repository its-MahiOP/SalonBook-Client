import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { SignOutButton } from "@/components/dashboard/sign-out-button"

export function BlockedScreen({ email }: { email?: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl shadow-primary/10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Your account is blocked
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Access to booking and account tools has been paused for{" "}
          <span className="font-medium text-foreground">{email}</span>. Please contact the
          salon team so we can help you resolve this.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <SignOutButton variant="default" className="h-11 w-full justify-center" />
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border text-sm font-medium transition hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Need help? Call +1 (555) 014-2200 or email hello@salonbook.com
        </p>
      </div>
    </div>
  )
}
