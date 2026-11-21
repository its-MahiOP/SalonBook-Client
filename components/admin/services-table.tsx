"use client"

import * as React from "react"
import Image from "next/image"
import { ExternalLink, Pencil, Plus, Scissors, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, Service } from "@/lib/types"
import { formatCurrency, formatDuration } from "@/lib/format"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/form-controls"
import { ServiceStatusBadge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/modal"
import { TableSkeleton } from "@/components/ui/loader"

export function ServicesTable() {
  const { data, loading, error, reload } = useApiData<ApiResponse<Service[]>>(
    "/api/services?limit=100"
  )
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [deleting, setDeleting] = React.useState<Service | null>(null)
  const [busy, setBusy] = React.useState(false)

  const services = data?.data ?? []
  const visible = services.filter((service) => {
    const matchesSearch =
      !search.trim() ||
      `${service.serviceName} ${service.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function handleDelete() {
    if (!deleting) return
    setBusy(true)
    try {
      await apiFetch(`/api/services/${deleting.id}`, { method: "DELETE" })
      toast.success("Service removed from the menu")
      setDeleting(null)
      reload()
    } catch (deleteError) {
      toast.error(
        deleteError instanceof ApiError ? deleteError.message : "Could not delete the service"
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleToggle(service: Service) {
    setBusy(true)
    try {
      const nextStatus = service.status === "active" ? "inactive" : "active"
      await apiFetch(`/api/services/${service.id}`, {
        method: "PATCH",
        body: { status: nextStatus },
      })
      toast.success(
        nextStatus === "active" ? "Service is now bookable" : "Service hidden from guests"
      )
      reload()
    } catch (toggleError) {
      toast.error(
        toggleError instanceof ApiError ? toggleError.message : "Could not update the service"
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Service menu"
        description="Add treatments, update pricing and control what guests can book."
        action={
          <LinkButton href="/dashboard/admin/services/new" className="gap-1.5">
            <Plus className="size-4" /> Add service
          </LinkButton>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by service name or category…"
            className="pl-10"
            aria-label="Search services"
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
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          className="sm:w-48"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </Select>
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
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/70 bg-muted/50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visible.map((service) => (
                  <tr key={service.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {service.image ? (
                            <Image
                              src={service.image}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              <Scissors className="size-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{service.serviceName}</p>
                          <p className="max-w-64 truncate text-[11px] text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{service.category}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(service.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDuration(service.duration)}
                    </td>
                    <td className="px-4 py-3">
                      <ServiceStatusBadge status={service.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleToggle(service)}
                          disabled={busy}
                          aria-label={
                            service.status === "active" ? "Hide service" : "Publish service"
                          }
                          title={service.status === "active" ? "Hide service" : "Publish"}
                          className="text-muted-foreground"
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                        <LinkButton
                          href={`/dashboard/admin/services/${service.id}/edit`}
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${service.serviceName}`}
                          title="Edit service"
                          className="text-muted-foreground"
                        >
                          <Pencil className="size-4" />
                        </LinkButton>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(service)}
                          aria-label={`Delete ${service.serviceName}`}
                          title="Delete service"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {visible.map((service) => (
              <div key={service.id} className="surface-card p-4">
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{service.serviceName}</p>
                    <p className="text-[11px] text-muted-foreground">{service.category}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="font-semibold">{formatCurrency(service.price)}</span>
                      <span className="text-muted-foreground">
                        {formatDuration(service.duration)}
                      </span>
                      <ServiceStatusBadge status={service.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggle(service)}
                    disabled={busy}
                  >
                    {service.status === "active" ? "Hide" : "Publish"}
                  </Button>
                  <LinkButton
                    href={`/dashboard/admin/services/${service.id}/edit`}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Edit
                  </LinkButton>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleting(service)}
                    className="text-destructive"
                    aria-label={`Delete ${service.serviceName}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Scissors}
          title={search || statusFilter !== "all" ? "No matching services" : "No services yet"}
          description={
            search || statusFilter !== "all"
              ? "Try another search or status filter."
              : "Add your first treatment so guests can start booking."
          }
          action={
            <LinkButton href="/dashboard/admin/services/new">Add a service</LinkButton>
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={busy}
        destructive
        title="Delete this service?"
        description={`“${deleting?.serviceName ?? ""}” will be removed from the salon menu. Existing appointments keep their recorded details.`}
        confirmLabel="Delete service"
      />
    </div>
  )
}
