"use client"

import * as React from "react"
import { CircleDollarSign, Download, ReceiptText, Search, X } from "lucide-react"
import { toast } from "sonner"

import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, Transaction } from "@/lib/types"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { downloadCsv } from "@/lib/csv"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { Input } from "@/components/ui/form-controls"
import { Avatar } from "@/components/ui/avatar"
import { TransactionStatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/loader"

export default function AdminTransactionsPage() {
  const { data, loading, error, reload } = useApiData<ApiResponse<Transaction[]>>(
    "/api/transactions"
  )
  const [search, setSearch] = React.useState("")

  const transactions = data?.data ?? []
  const paid = transactions.filter((transaction) => transaction.status === "paid")
  const revenue = paid.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

  const visible = transactions.filter((transaction) => {
    const query = search.trim().toLowerCase()
    return (
      !query ||
      transaction.customer?.name?.toLowerCase().includes(query) ||
      transaction.customer?.email?.toLowerCase().includes(query) ||
      transaction.service?.serviceName?.toLowerCase().includes(query) ||
      transaction.stripeSessionId?.toLowerCase().includes(query)
    )
  })

  function exportCsv() {
    if (visible.length === 0) {
      toast.error("There are no transactions to export")
      return
    }

    const rows: unknown[][] = [
      [
        "Customer",
        "Email",
        "Treatment",
        "Appointment date",
        "Time slot",
        "Paid on",
        "Stripe session",
        "Amount",
        "Currency",
        "Status",
      ],
      ...visible.map((transaction) => [
        transaction.customer?.name ?? "Deleted customer",
        transaction.customer?.email ?? "",
        transaction.service?.serviceName ?? "",
        transaction.appointment?.appointmentDate ?? "",
        transaction.appointment?.timeSlot ?? "",
        formatDateTime(transaction.createdAt),
        transaction.stripeSessionId,
        transaction.amount,
        (transaction.currency || "usd").toUpperCase(),
        transaction.status,
      ]),
    ]

    downloadCsv(`salonbook-transactions-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    toast.success(`Exported ${visible.length} transaction${visible.length === 1 ? "" : "s"}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Verified Stripe payments recorded against confirmed salon appointments."
        action={
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2"
            onClick={exportCsv}
            disabled={loading || visible.length === 0}
          >
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card flex items-center gap-4 p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <CircleDollarSign className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Total revenue
            </p>
            <p className="mt-0.5 text-2xl font-semibold">{formatCurrency(revenue)}</p>
          </div>
        </div>
        <div className="surface-card flex items-center gap-4 p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ReceiptText className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Successful payments
            </p>
            <p className="mt-0.5 text-2xl font-semibold">{paid.length}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer, service or session…"
          className="pl-10"
          aria-label="Search transactions"
        />
        {search ? (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <div className="surface-card p-6 text-sm text-destructive">
          {error}{" "}
          <button type="button" onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      ) : visible.length > 0 ? (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border/70 bg-muted/50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3">Paid on</th>
                  <th className="px-4 py-3">Stripe session</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visible.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={transaction.customer?.image}
                          name={transaction.customer?.name}
                          size={32}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {transaction.customer?.name ?? "Deleted customer"}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {transaction.customer?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {transaction.service?.serviceName ?? "Salon treatment"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {transaction.appointment
                          ? `${transaction.appointment.appointmentDate} · ${transaction.appointment.timeSlot}`
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {shortId(transaction.stripeSessionId, 10)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-4 py-3">
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
          title={search ? "No transactions match" : "No transactions yet"}
          description={
            search
              ? "Try another customer name, treatment or session reference."
              : "Payments appear here automatically after a verified Stripe checkout completes."
          }
        />
      )}
    </div>
  )
}
