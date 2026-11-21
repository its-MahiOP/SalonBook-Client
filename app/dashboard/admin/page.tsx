"use client"

import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CircleDollarSign,
  Clock3,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

import { useApiData } from "@/lib/hooks/use-api-data"
import type { AdminStats, ApiResponse } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/format"
import { PageHeader } from "@/components/ui/section"
import { StatCard } from "@/components/ui/stat-card"
import { LinkButton } from "@/components/ui/link-button"
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

export default function AdminOverviewPage() {
  const { data, loading, error, reload } = useApiData<ApiResponse<AdminStats>>(
    "/api/stats/admin"
  )
  const stats = data?.data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salon overview"
        description="A live view of bookings, customers and revenue across SalonBook."
        action={
          <LinkButton href="/dashboard/admin/services/new" className="gap-1.5">
            <CalendarPlus className="size-4" /> Add service
          </LinkButton>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="surface-card p-6 text-sm text-destructive">
          {error}{" "}
          <button type="button" onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              icon={CircleDollarSign}
              tone="green"
              hint={`${stats?.totalSuccessfulPayments ?? 0} successful payments`}
            />
            <StatCard
              label="Appointments"
              value={stats?.totalAppointments ?? 0}
              icon={CalendarDays}
              hint={`${stats?.confirmed ?? 0} confirmed · ${stats?.pending ?? 0} pending`}
            />
            <StatCard
              label="Awaiting review"
              value={stats?.pending ?? 0}
              icon={Clock3}
              tone="gold"
              hint="Confirm or cancel requests"
            />
            <StatCard
              label="Customers"
              value={stats?.totalCustomers ?? 0}
              icon={Users}
              tone="blue"
              hint={`${stats?.activeServices ?? 0} active services`}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
            <section className="surface-card overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">Recent appointment requests</h2>
                  <p className="text-xs text-muted-foreground">
                    The newest five bookings across the salon
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/appointments"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Manage all
                </Link>
              </div>

              {stats && stats.recentAppointments.length > 0 ? (
                <div className="divide-y divide-border/60">
                  {stats.recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          src={appointment.customer?.image}
                          name={appointment.customer?.name}
                          size={34}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {appointment.customer?.name}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {appointment.service?.serviceName} ·{" "}
                            {formatDate(appointment.appointmentDate)} ·{" "}
                            {appointment.timeSlot}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <AppointmentStatusBadge status={appointment.status} />
                        <PaymentStatusBadge status={appointment.paymentStatus} />
                        <span className="text-xs font-semibold">
                          {formatCurrency(appointment.servicePrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No appointment requests yet.
                </p>
              )}
            </section>

            <aside className="space-y-4">
              <div className="surface-card p-5">
                <h2 className="text-base font-semibold">Growth snapshot</h2>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="size-4 text-emerald-600" /> Confirmed visits
                    </span>
                    <strong>{stats?.confirmed ?? 0}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="size-4 text-primary" /> Active services
                    </span>
                    <strong>{stats?.activeServices ?? 0}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Scissors className="size-4 text-amber-600" /> Cancelled
                    </span>
                    <strong>{stats?.cancelled ?? 0}</strong>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-[#3b2a2e] p-5 text-white">
                <div className="pointer-events-none absolute -right-8 -bottom-10 size-36 rounded-full bg-primary/30 blur-2xl" />
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#f0c9ce] uppercase">
                  Daily ritual
                </p>
                <p className="mt-2 font-heading text-lg leading-snug">
                  Review pending requests each morning so no guest waits too long.
                </p>
                <Link
                  href="/dashboard/admin/appointments?status=pending"
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#f0c9ce] hover:underline"
                >
                  Review pending <ArrowRight className="size-3" />
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
