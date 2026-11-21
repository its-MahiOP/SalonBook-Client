import Link from "next/link"
import { CreditCard, Undo2 } from "lucide-react"

import { PublicShell } from "@/components/layout/public-shell"
import { LinkButton } from "@/components/ui/link-button"

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ appointment_id?: string }>
}) {
  const params = await searchParams

  return (
    <PublicShell>
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-xl shadow-primary/10 sm:p-9">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <Undo2 className="size-8" />
          </div>
          <p className="mt-5 text-xs font-bold tracking-[0.18em] text-amber-600 uppercase">
            Payment cancelled
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            No payment was taken
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            You closed the secure Stripe checkout before completing payment. Your
            appointment is still confirmed and waiting for payment whenever you are ready.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <LinkButton href="/dashboard/customer/appointments" className="h-11 gap-2">
              <CreditCard className="size-4" /> Return to my appointments
            </LinkButton>
            <LinkButton href="/services" variant="outline" className="h-11">
              Browse services
            </LinkButton>
          </div>

          {params.appointment_id ? (
            <p className="mt-4 text-[11px] text-muted-foreground">
              Appointment reference: {params.appointment_id}
            </p>
          ) : null}

          <p className="mt-5 text-[11px] text-muted-foreground">
            Prefer to pay at the salon?{" "}
            <Link href="/" className="font-semibold text-primary hover:underline">
              Contact us
            </Link>{" "}
            and we will help.
          </p>
        </div>
      </div>
    </PublicShell>
  )
}
