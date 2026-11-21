"use client"

import * as React from "react"
import { CalendarDays, Plus } from "lucide-react"

import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, Appointment } from "@/lib/types"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"
import { Button } from "@/components/ui/button"
import { AppointmentCard, AppointmentSkeletonList } from "@/components/dashboard/appointment-card"
import { cn } from "@/lib/utils"

const filters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
] as const

export default function CustomerAppointmentsPage() {
  const { data, loading, error, reload } = useApiData<ApiResponse<Appointment[]>>(
    "/api/appointments/my"
  )
  const [filter, setFilter] = React.useState<(typeof filters)[number]["value"]>("all")

  const appointments = data?.data ?? []
  const visible =
    filter === "all"
      ? appointments
      : appointments.filter((appointment) => appointment.status === filter)

  const counts = appointments.reduce<Record<string, number>>(
    (acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1
      return acc
    },
    { all: appointments.length }
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="My appointments"
        description="Track every request, pay for confirmed visits and manage your bookings."
        action={
          <LinkButton href="/services" className="gap-1.5">
            <Plus className="size-4" /> New booking
          </LinkButton>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {filters.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={filter === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(item.value)}
            className={cn("gap-1.5", filter === item.value && "shadow-sm")}
          >
            {item.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                filter === item.value ? "bg-white/20" : "bg-muted"
              )}
            >
              {counts[item.value] ?? 0}
            </span>
          </Button>
        ))}
      </div>

      {loading ? (
        <AppointmentSkeletonList />
      ) : error ? (
        <div className="surface-card p-6 text-sm text-destructive">
          {error}{" "}
          <button type="button" onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      ) : visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              mode="customer"
              onChanged={reload}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title={
            filter === "all"
              ? "No appointments yet"
              : `No ${filter} appointments`
          }
          description={
            filter === "all"
              ? "Choose a treatment from our salon menu and request your first appointment."
              : "Try a different filter to see your other appointments."
          }
          action={
            filter === "all" ? (
              <LinkButton href="/services">Browse services</LinkButton>
            ) : (
              <Button type="button" variant="outline" onClick={() => setFilter("all")}>
                Show all appointments
              </Button>
            )
          }
        />
      )}
    </div>
  )
}
