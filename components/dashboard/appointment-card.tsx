"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  CalendarPlus,
  Check,
  Clock3,
  MessageSquareText,
  Scissors,
  UserRound,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import type { Appointment } from "@/lib/types"
import { formatCurrency, formatDate, formatDuration } from "@/lib/format"
import { downloadAppointmentIcs } from "@/lib/calendar"
import { Badge, AppointmentStatusBadge, PaymentStatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/modal"
import { PayButton } from "@/components/payments/pay-button"

export function AppointmentCard({
  appointment,
  mode,
  onChanged,
}: {
  appointment: Appointment
  mode: "customer" | "admin"
  onChanged?: () => void
}) {
  const [busy, setBusy] = React.useState(false)
  const [confirm, setConfirm] = React.useState<null | "confirm" | "cancel">(null)
  const service = appointment.service
  const customer = appointment.customer

  async function updateStatus(status: "confirmed" | "cancelled") {
    setBusy(true)
    try {
      if (status === "cancelled" && mode === "customer") {
        await apiFetch(`/api/appointments/${appointment.id}/cancel`, { method: "PATCH" })
      } else {
        await apiFetch(`/api/appointments/${appointment.id}/status`, {
          method: "PATCH",
          body: { status },
        })
      }
      toast.success(
        status === "confirmed"
          ? "Appointment confirmed — the customer can now pay."
          : "Appointment cancelled."
      )
      setConfirm(null)
      onChanged?.()
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update the appointment."
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="surface-card overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <Link
          href={`/services/${service?.id ?? appointment.serviceId}`}
          className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-20 sm:w-28"
        >
          {service?.image ? (
            <Image
              src={service.image}
              alt={service.serviceName}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Scissors className="size-5" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base leading-snug font-semibold">
                {service?.serviceName ?? "Salon treatment"}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {service?.category ?? "Salon service"}
                {service?.duration ? ` · ${formatDuration(service.duration)}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <AppointmentStatusBadge status={appointment.status} />
              <PaymentStatusBadge status={appointment.paymentStatus} />
            </div>
          </div>

          <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-primary" />
              {formatDate(appointment.appointmentDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5 text-primary" />
              {appointment.timeSlot}
            </span>
            {mode === "admin" ? (
              <span className="inline-flex items-center gap-1.5 sm:col-span-2">
                <UserRound className="size-3.5 text-primary" />
                {customer?.name}
                <span className="text-muted-foreground/70">({customer?.email})</span>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Scissors className="size-3.5 text-primary" />
              {formatCurrency(appointment.servicePrice)}
            </span>
          </div>

          {appointment.message ? (
            <p className="mt-2.5 flex gap-1.5 rounded-lg bg-muted/60 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
              <MessageSquareText className="mt-0.5 size-3.5 shrink-0" />
              {appointment.message}
            </p>
          ) : null}

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {mode === "admin" ? (
              <>
                {appointment.status === "pending" ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setConfirm("confirm")}
                    disabled={busy}
                    className="gap-1.5"
                  >
                    <Check className="size-3.5" /> Confirm
                  </Button>
                ) : null}
                {appointment.status !== "cancelled" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirm("cancel")}
                    disabled={busy || appointment.paymentStatus === "paid"}
                    className="gap-1.5 text-destructive"
                  >
                    <X className="size-3.5" /> Cancel
                  </Button>
                ) : null}
                {appointment.paymentStatus === "paid" ? (
                  <Badge variant="success" dot>
                    Payment received
                  </Badge>
                ) : null}
              </>
            ) : (
              <>
                {appointment.status === "confirmed" && appointment.paymentStatus === "unpaid" ? (
                  <PayButton
                    appointmentId={appointment.id}
                    amount={formatCurrency(appointment.servicePrice)}
                  />
                ) : null}
                {appointment.status === "pending" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirm("cancel")}
                    disabled={busy}
                    className="gap-1.5 text-destructive"
                  >
                    <X className="size-3.5" /> Cancel request
                  </Button>
                ) : null}
                {appointment.status === "confirmed" && appointment.paymentStatus === "paid" ? (
                  <Badge variant="success" dot>
                    Paid · thank you
                  </Badge>
                ) : null}
                {appointment.status !== "cancelled" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => {
                      const saved = downloadAppointmentIcs(appointment)
                      if (saved) {
                        toast.success("Calendar file downloaded")
                      } else {
                        toast.error("Could not create a calendar file for this booking")
                      }
                    }}
                  >
                    <CalendarPlus className="size-3.5" /> Add to calendar
                  </Button>
                ) : null}
                <Link
                  href={`/services/${service?.id ?? appointment.serviceId}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View service
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => updateStatus(confirm === "confirm" ? "confirmed" : "cancelled")}
        loading={busy}
        destructive={confirm === "cancel"}
        title={confirm === "confirm" ? "Confirm this appointment?" : "Cancel appointment?"}
        description={
          confirm === "confirm"
            ? `Confirm ${customer?.name ?? "the customer's"} appointment on ${formatDate(
                appointment.appointmentDate
              )} at ${appointment.timeSlot}. They will be able to pay online.`
            : `This will cancel the ${service?.serviceName ?? "appointment"} on ${formatDate(
                appointment.appointmentDate
              )} at ${appointment.timeSlot}. This cannot be undone.`
        }
        confirmLabel={confirm === "confirm" ? "Confirm appointment" : "Cancel appointment"}
      />
    </article>
  )
}

export function AppointmentSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse gap-4 rounded-2xl border border-border/70 bg-card p-5"
        >
          <div className="size-20 shrink-0 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
