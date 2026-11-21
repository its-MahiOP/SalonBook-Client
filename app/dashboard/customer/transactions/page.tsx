"use client"

import { ReceiptText, CreditCard } from "lucide-react"

import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, Transaction } from "@/lib/types"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"
import { TransactionStatusBadge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/loader"

export default function CustomerTransactionsPage() {
  const { data, loading, error, reload } = useApiData<ApiResponse<Transaction[]>>(
    "/api/transactions/my"
  )
  const transactions = data?.data ?? []
  const totalPaid = transactions
    .filter((transaction) => transaction.status === "paid")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Every successful Stripe payment for your SalonBook appointments."
        action={
          <LinkButton href="/services" variant="outline">
            Book another treatment
          </LinkButton>
        }
      />

      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Lifetime salon payments
          </p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CreditCard className="size-4" />
          Secured by Stripe
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <div className="surface-card p-6 text-sm text-destructive">
          {error}{" "}
          <button type="button" onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      ) : transactions.length > 0 ? (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border/70 bg-muted/50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3">Appointment</th>
                  <th className="px-4 py-3">Paid on</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3.5">
                      <p className="font-medium">
                        {transaction.service?.serviceName ?? "Salon treatment"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Ref {shortId(transaction.stripeSessionId, 12)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {transaction.appointment
                        ? `${transaction.appointment.appointmentDate} · ${transaction.appointment.timeSlot}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-4 py-3.5">
                      <TransactionStatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ReceiptText}
          title="No payments yet"
          description="Once the salon confirms an appointment, you can pay securely online and your receipts will appear here."
          action={<LinkButton href="/services">Browse services</LinkButton>}
        />
      )}
    </div>
  )
}
