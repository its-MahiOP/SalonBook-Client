"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Info,
  Lock,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { apiFetch, ApiError } from "@/lib/api"
import type { ApiResponse, Appointment, Service, TimeSlot } from "@/lib/types"
import { formatCurrency, formatDate, formatDuration, todayIsoDate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Badge } from "@/components/ui/badge"
import { Input, Label, Textarea, FieldError } from "@/components/ui/form-controls"
import { Spinner } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

function tomorrowIso() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function BookingPanel({ service }: { service: Service }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const [date, setDate] = React.useState(tomorrowIso)
  const [slotData, setSlotData] = React.useState<{ date: string; slots: TimeSlot[] } | null>(
    null
  )
  const [selectedSlot, setSelectedSlot] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [created, setCreated] = React.useState<Appointment | null>(null)
  const [payLoading, setPayLoading] = React.useState(false)

  const today = todayIsoDate()
  const isCustomer = user?.role === "customer"
  const slots = slotData?.date === date ? slotData.slots : []
  const slotsLoading = isCustomer && slotData?.date !== date

  React.useEffect(() => {
    if (!user || user.role !== "customer") return
    let active = true
    apiFetch<ApiResponse<TimeSlot[]>>(
      `/api/appointments/available-slots?date=${encodeURIComponent(date)}`,
      { auth: false }
    )
      .then((response) => {
        if (active) setSlotData({ date, slots: response.data ?? [] })
      })
      .catch(() => {
        if (active) setSlotData({ date, slots: [] })
      })
    return () => {
      active = false
    }
  }, [date, user])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!selectedSlot) {
      setError("Please choose an available time slot")
      return
    }

    setLoading(true)
    try {
      const response = await apiFetch<ApiResponse<Appointment>>("/api/appointments", {
        method: "POST",
        body: {
          serviceId: service.id,
          appointmentDate: date,
          timeSlot: selectedSlot,
          message: message.trim(),
        },
      })
      setCreated(response.data)
      setSlotData((current) =>
        current && current.date === date
          ? {
              date: current.date,
              slots: current.slots.map((slot) =>
                slot.time === selectedSlot ? { ...slot, available: false } : slot
              ),
            }
          : current
      )
      toast.success("Appointment requested — we will confirm it shortly.")
      router.refresh()
    } catch (submitError) {
      const text =
        submitError instanceof ApiError
          ? submitError.message
          : "We could not request this appointment. Please try again."
      setError(text)
      if (submitError instanceof ApiError && submitError.status === 401) {
        toast.error("Please sign in again to continue.")
      } else {
        toast.error(text)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handlePay() {
    if (!created) return
    setPayLoading(true)
    try {
      const response = await apiFetch<ApiResponse<{ url: string }>>(
        "/api/payments/checkout",
        { method: "POST", body: { appointmentId: created.id } }
      )
      if (response.data?.url) {
        window.location.href = response.data.url
        return
      }
      toast.error("Payment could not be started. Please try again.")
    } catch (payError) {
      toast.error(
        payError instanceof ApiError
          ? payError.message
          : "Payment could not be started. Please try again."
      )
    } finally {
      setPayLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="surface-card flex min-h-64 items-center justify-center p-6">
        <Spinner className="size-6 text-primary" />
      </div>
    )
  }

  if (created) {
    return (
      <div className="surface-card overflow-hidden">
        <div className="border-b border-border/70 bg-emerald-500/10 px-5 py-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4" /> Appointment requested
          </p>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Thank you, {user?.name.split(" ")[0]}. Your request for{" "}
            <strong className="text-foreground">{service.serviceName}</strong> is waiting
            for confirmation. You can pay once our team confirms your slot.
          </p>
          <div className="space-y-2 rounded-xl bg-muted/60 p-3.5 text-sm">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              {formatDate(created.appointmentDate)}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 text-primary" />
              {created.timeSlot}
            </p>
            <p className="flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              {formatCurrency(created.servicePrice)} ·{" "}
              <Badge variant="warning" dot>
                {created.status}
              </Badge>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={handlePay}
              disabled={payLoading}
              className="h-11 w-full gap-2"
            >
              {payLoading ? <Spinner /> : <CreditCard className="size-4" />}
              Pay {formatCurrency(created.servicePrice)}
            </Button>
            <LinkButton
              href="/dashboard/customer/appointments"
              variant="outline"
              className="h-11 w-full"
            >
              View my appointments
            </LinkButton>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            Online payment becomes available after the salon confirms your appointment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border/70 bg-secondary/50 px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight">
            {formatCurrency(service.price)}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock3 className="size-3.5 text-primary" />
            {formatDuration(service.duration)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Price includes consultation and finishing.
        </p>
      </div>

      <div className="p-5">
        {!user ? (
          <div className="space-y-4">
            <div className="flex gap-2.5 rounded-xl bg-primary/8 p-3.5 text-sm text-muted-foreground">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="leading-relaxed">
                Sign in to your customer account to choose a time and request this
                appointment.
              </p>
            </div>
            <LinkButton href="/sign-in" className="h-11 w-full gap-2">
              Sign in to book
            </LinkButton>
            <LinkButton href="/sign-up" variant="outline" className="h-11 w-full">
              Create a free account
            </LinkButton>
          </div>
        ) : user.role === "admin" ? (
          <div className="space-y-3">
            <div className="flex gap-2.5 rounded-xl bg-amber-500/10 p-3.5 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <p className="leading-relaxed">
                You are signed in as an administrator. Bookings are made from customer
                accounts.
              </p>
            </div>
            <LinkButton href="/dashboard/admin/services" variant="outline" className="h-11 w-full">
              Manage services
            </LinkButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="appointmentDate" required>
                Appointment date
              </Label>
              <Input
                id="appointmentDate"
                type="date"
                min={today}
                value={date}
                onChange={(event) => {
                  setSelectedSlot("")
                  setDate(event.target.value)
                }}
                required
              />
            </div>

            <div>
              <Label required>Available times</Label>
              {slotsLoading ? (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-9 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                  No times are published for this date. Please choose another day.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      aria-pressed={selectedSlot === slot.time}
                      className={cn(
                        "rounded-lg border px-1 py-2 text-xs font-medium transition",
                        selectedSlot === slot.time
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : slot.available
                            ? "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                            : "cursor-not-allowed border-dashed border-border/70 text-muted-foreground/50 line-through"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="message">Notes for your stylist (optional)</Label>
              <Textarea
                id="message"
                rows={3}
                maxLength={500}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Allergies, inspiration photos or anything we should know…"
              />
            </div>

            <FieldError>{error}</FieldError>

            <Button
              type="submit"
              disabled={loading || slotsLoading}
              className="h-11 w-full gap-2 shadow-md shadow-primary/20"
            >
              {loading ? (
                <>
                  <Spinner /> Requesting…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Request appointment
                </>
              )}
            </Button>

            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Info className="mt-px size-3.5 shrink-0" />
              Your slot is confirmed by our team before payment is requested. No charge is
              made now.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
