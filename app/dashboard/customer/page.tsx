"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Timer,
  Wallet,
  XCircle,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, CustomerStats } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/format"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { StatCard } from "@/components/ui/stat-card"
import { LinkButton } from "@/components/ui/link-button"
import { TableSkeleton } from "@/components/ui/loader"
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/ui/badge"
import { PayButton } from "@/components/payments/pay-button"

export default function CustomerOverviewPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { data, loading, error, reload } = useApiData<ApiResponse<CustomerStats>>(
    "/api/stats/customer"
  )
  const stats = data?.data

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="Here is a snapshot of your SalonBook appointments and payments."
        action={<LinkButton href="/services">Book a treatment</LinkButton>}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Total Appointment Requests"
              value={stats?.total ?? 0}
              icon={CalendarDays}
              hint="Every request you have made"
            />
            <StatCard
              label="Pending Appointments"
              value={stats?.pending ?? 0}
              icon={Timer}
              tone="gold"
              hint="The salon is reviewing these"
            />
            <StatCard
              label="Confirmed Appointments"
              value={stats?.confirmed ?? 0}
              icon={CheckCircle2}
              tone="green"
              hint="Ready for your visit"
            />
            <StatCard
              label="Cancelled Appointments"
              value={stats?.cancelled ?? 0}
              icon={XCircle}
              hint="Cancelled bookings"
            />
            <StatCard
              label="Lifetime Spend"
              value={formatCurrency(stats?.totalSpent ?? 0)}
              icon={Wallet}
              tone="plum"
              hint={`${stats?.paidAppointments ?? 0} paid appointment${
                stats?.paidAppointments === 1 ? "" : "s"
              }`}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <section className="surface-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Ready to pay</h2>
                  <p className="text-xs text-muted-foreground">
                    Confirmed appointments waiting for online payment
                  </p>
                </div>
                <Link
                  href="/dashboard/customer/appointments"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  All appointments
                </Link>
              </div>

              {stats && stats.upcoming.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcoming.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 rounded-xl border border-border/70 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {appointment.service.serviceName}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{formatDate(appointment.appointmentDate)}</span>
                          <span>{appointment.timeSlot}</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(appointment.servicePrice)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AppointmentStatusBadge status={appointment.status} />
                        <PaymentStatusBadge status={appointment.paymentStatus} />
                        <PayButton
                          appointmentId={appointment.id}
                          amount={formatCurrency(appointment.servicePrice)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={CreditCard}
                  title="Nothing waiting for payment"
                  description="Once the salon confirms your next appointment, you will be able to pay for it here."
                  className="border-0 bg-transparent py-8"
                  action={
                    <LinkButton href="/services" variant="outline" size="sm">
                      Browse services
                    </LinkButton>
                  }
                />
              )}
            </section>

            <aside className="space-y-4">
              <div className="surface-card p-5">
                <h2 className="text-base font-semibold">Quick actions</h2>
                <div className="mt-3 space-y-2">
                  {[
                    {
                      href: "/services",
                      label: "Book a new treatment",
                      icon: Sparkles,
                    },
                    {
                      href: "/dashboard/customer/appointments",
                      label: "Manage appointments",
                      icon: CalendarCheck,
                    },
                    {
                      href: "/dashboard/customer/transactions",
                      label: "View payment history",
                      icon: CreditCard,
                    },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-center gap-3 rounded-xl border border-border/70 px-3.5 py-3 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <action.icon className="size-4 text-primary" />
                      <span className="flex-1">{action.label}</span>
                      <ArrowRight className="size-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-[#3b2a2e] p-5 text-white">
                <div className="pointer-events-none absolute -top-10 -right-8 size-32 rounded-full bg-primary/30 blur-2xl" />
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#f0c9ce] uppercase">
                  A little reminder
                </p>
                <p className="mt-2 font-heading text-lg leading-snug">
                  Arrive five minutes early and let us take care of the rest.
                </p>
                <p className="mt-2 text-xs text-white/55">
                  Need to change a confirmed visit? Call +1 (555) 014-2200.
                </p>
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="mt-4 text-[11px] font-semibold text-[#f0c9ce] underline-offset-4 hover:underline"
                >
                  Refresh my dashboard
                </button>
              </div>
            </aside>
          </div>
        </>
      )}

      {loading ? <TableSkeleton rows={2} /> : null}
    </div>
  )
}
