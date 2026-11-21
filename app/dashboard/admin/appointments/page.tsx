"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { CalendarDays, Search, X } from "lucide-react"

import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, Appointment } from "@/lib/types"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { Input } from "@/components/ui/form-controls"
import { Button } from "@/components/ui/button"
import { AppointmentCard, AppointmentSkeletonList } from "@/components/dashboard/appointment-card"
import { cn } from "@/lib/utils"

const filters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
] as const

export default function AdminAppointmentsPage() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status")
  const { data, loading, error, reload } = useApiData<ApiResponse<Appointment[]>>(
    "/api/appointments"
  )

  const [filter, setFilter] = React.useState<(typeof filters)[number]["value"]>(
    filters.some((item) => item.value === initialStatus)
      ? (initialStatus as (typeof filters)[number]["value"])
      : "all"
  )
  const [search, setSearch] = React.useState("")

  const appointments = data?.data ?? []
  const counts = appointments.reduce<Record<string, number>>(
    (acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1
      return acc
    },
    { all: appointments.length }
  )

  const visible = appointments.filter((appointment) => {
    const matchesStatus = filter === "all" || appointment.status === filter
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      appointment.customer?.name?.toLowerCase().includes(query) ||
      appointment.customer?.email?.toLowerCase().includes(query) ||
      appointment.service?.serviceName?.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Confirm requests, manage the salon calendar and keep every guest informed."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by customer, email or service…"
            className="pl-10"
            aria-label="Search appointments"
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
      </div>

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
        <AppointmentSkeletonList count={4} />
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
              mode="admin"
              onChanged={reload}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No appointments match"
          description="Try another status filter or clear the search to see all bookings."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFilter("all")
                setSearch("")
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  )
}
