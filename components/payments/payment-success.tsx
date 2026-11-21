"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Clock3, CreditCard, ShieldCheck } from "lucide-react"

import { apiFetch } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Spinner } from "@/components/ui/loader"

type SessionStatus = {
  paid: boolean
  pending: boolean
  transaction: {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
  } | null
}

export function PaymentSuccess({ sessionId }: { sessionId?: string }) {
  const [status, setStatus] = React.useState<SessionStatus | null>(null)
  const [loading, setLoading] = React.useState(Boolean(sessionId))
  const [attempts, setAttempts] = React.useState(0)

  React.useEffect(() => {
    if (!sessionId) return
    let active = true
    let timer: ReturnType<typeof setTimeout>

    async function check() {
      try {
        const response = await apiFetch<ApiResponse<SessionStatus>>(
          `/api/payments/session/${encodeURIComponent(sessionId as string)}`,
          { auth: true }
        )
        if (!active) return
        setStatus(response.data)
        setLoading(false)
        if (!response.data.paid && attempts < 6) {
          timer = setTimeout(() => setAttempts((value) => value + 1), 2500)
        }
      } catch {
        if (!active) return
        setLoading(false)
      }
    }

    check()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [sessionId, attempts])

  const paid = Boolean(status?.paid)

  return (
    <PublicShell>
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-xl shadow-primary/10 sm:p-9">
          {loading ? (
            <>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Spinner className="size-7 text-primary" />
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                Confirming your payment…
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We are securely verifying your Stripe payment. This usually takes only a
                few seconds.
              </p>
            </>
          ) : paid ? (
            <>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>
              <p className="mt-5 text-xs font-bold tracking-[0.18em] text-emerald-600 uppercase">
                Payment successful
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                Your appointment is paid
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Thank you! Your payment has been verified and your appointment is fully
                confirmed. We look forward to seeing you.
              </p>

              {status?.transaction ? (
                <div className="mt-6 space-y-2 rounded-2xl bg-muted/60 p-4 text-left text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Amount paid</span>
                    <strong>
                      {formatCurrency(
                        status.transaction.amount,
                        status.transaction.currency
                      )}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Paid on</span>
                    <span>{formatDateTime(status.transaction.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <ShieldCheck className="size-4" /> Verified by Stripe
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <LinkButton href="/dashboard/customer/appointments" className="h-11 gap-2">
                  <CreditCard className="size-4" /> My appointments
                </LinkButton>
                <LinkButton
                  href="/dashboard/customer/transactions"
                  variant="outline"
                  className="h-11"
                >
                  Payment history
                </LinkButton>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <Clock3 className="size-8" />
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                Payment is being verified
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Stripe is still confirming this payment. Your appointment will be marked
                as paid as soon as the webhook is processed — no further action is needed.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  type="button"
                  className="h-11"
                  onClick={() => setAttempts((value) => value + 1)}
                >
                  Check again
                </Button>
                <LinkButton
                  href="/dashboard/customer/appointments"
                  variant="outline"
                  className="h-11"
                >
                  View my appointments
                </LinkButton>
              </div>
            </>
          )}

          <p className="mt-5 text-[11px] text-muted-foreground">
            Need help with a payment?{" "}
            <Link href="/" className="font-semibold text-primary hover:underline">
              Contact the salon
            </Link>{" "}
            and quote your Stripe receipt.
          </p>
        </div>
      </div>
    </PublicShell>
  )
}
