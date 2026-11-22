"use client"

import * as React from "react"
import { CalendarClock } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import type { ApiResponse, Appointment, TimeSlot } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/form-controls"
import { Modal } from "@/components/ui/modal"
import { Skeleton, Spinner } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

function todayIsoDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

export function RescheduleDialog({
  appointment,
  open,
  onClose,
  onChanged,
}: {
  appointment: Appointment
  open: boolean
  onClose: () => void
  onChanged?: () => void
}) {
  const [date, setDate] = React.useState(appointment.appointmentDate)
  const [slotData, setSlotData] = React.useState<{
    date: string
    slots: TimeSlot[]
  } | null>(null)
  const [selectedSlot, setSelectedSlot] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  // Reset the form whenever the dialog opens for an appointment. Doing this
  // while rendering (instead of in an effect) avoids a cascading render.
  const resetKey = open ? `${appointment.id}:${appointment.appointmentDate}` : null
  const [lastResetKey, setLastResetKey] = React.useState<string | null>(null)
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey)
    if (resetKey) {
      setDate(appointment.appointmentDate)
      setSelectedSlot("")
      setSlotData(null)
    }
  }

  React.useEffect(() => {
    if (!open) return
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
  }, [open, date])

  const slots = slotData?.date === date ? slotData.slots : []
  const loading = !slotData || slotData.date !== date
  const originalSlot = appointment.appointmentDate === date ? appointment.timeSlot : ""

  async function handleSave() {
    if (!selectedSlot) {
      toast.error("Pick a new time slot first")
      return
    }

    setSaving(true)
    try {
      const response = await apiFetch<ApiResponse<Appointment>>(
        `/api/appointments/${appointment.id}/reschedule`,
        {
          method: "PATCH",
          body: { appointmentDate: date, timeSlot: selectedSlot },
        }
      )
      toast.success(
        response.message || `Appointment moved to ${formatDate(date)} at ${selectedSlot}`
      )
      onClose()
      onChanged?.()
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not reschedule this appointment"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reschedule appointment"
      description={`Move your ${appointment.service?.serviceName ?? "appointment"} to another day or time.`}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving || !selectedSlot}>
            {saving ? <Spinner /> : <CalendarClock className="size-4" />}
            {saving ? "Saving..." : "Save new time"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="rescheduleDate">New date</Label>
          <Input
            id="rescheduleDate"
            type="date"
            min={todayIsoDate()}
            value={date}
            onChange={(event) => {
              setSelectedSlot("")
              setDate(event.target.value)
            }}
          />
        </div>

        <div>
          <Label>New time</Label>
          {loading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-9 rounded-lg" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
              This day is fully booked. Try another date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const isOriginal = slot.time === originalSlot
                const unavailable = !slot.available && !isOriginal
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={unavailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-medium transition",
                      unavailable && "cursor-not-allowed border-border/60 bg-muted/60 text-muted-foreground/60 line-through",
                      !unavailable && selectedSlot === slot.time
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : !unavailable &&
                          "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {slot.time}
                    {isOriginal ? <span className="block text-[9px] font-normal opacity-70">current</span> : null}
                  </button>
                )
              })}
            </div>
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Currently booked for {formatDate(appointment.appointmentDate)} at{" "}
            {appointment.timeSlot}. Your booking stays pending until the salon confirms the
            change.
          </p>
        </div>
      </div>
    </Modal>
  )
}
