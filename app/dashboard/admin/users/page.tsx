"use client"

import * as React from "react"
import { Eye, Search, ShieldBan, ShieldCheck, Users, X } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, SessionUser } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { Input } from "@/components/ui/form-controls"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog, Modal } from "@/components/ui/modal"
import { TableSkeleton } from "@/components/ui/loader"

type AdminUser = SessionUser & { createdAt?: string; appointmentCount: number }

export default function AdminUsersPage() {
  const { data, loading, error, reload } = useApiData<ApiResponse<AdminUser[]>>("/api/users")
  const [search, setSearch] = React.useState("")
  const [target, setTarget] = React.useState<AdminUser | null>(null)
  const [viewUser, setViewUser] = React.useState<AdminUser | null>(null)
  const [busy, setBusy] = React.useState(false)

  const users = data?.data ?? []
  const visible = users.filter((user) => {
    const query = search.trim().toLowerCase()
    return (
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone || "").toLowerCase().includes(query)
    )
  })

  async function toggleBlock() {
    if (!target) return
    setBusy(true)
    try {
      const next = !target.isBlocked
      await apiFetch(`/api/users/${target.id}/block`, {
        method: "PATCH",
        body: { isBlocked: next },
      })
      toast.success(next ? "Customer blocked" : "Customer unblocked")
      setTarget(null)
      reload()
    } catch (blockError) {
      toast.error(
        blockError instanceof ApiError ? blockError.message : "Could not update the customer"
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="View registered guests and manage account access."
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or phone…"
          className="pl-10"
          aria-label="Search customers"
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
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border/70 bg-muted/50 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Bookings</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visible.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.image} name={user.name} size={36} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.phone || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">{user.appointmentCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.isBlocked ? (
                        <Badge variant="danger" dot>
                          Blocked
                        </Badge>
                      ) : (
                        <Badge variant="success" dot>
                          Active
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewUser(user)}
                          className="gap-1.5"
                          title="View customer details"
                        >
                          <Eye className="size-3.5" /> View
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setTarget(user)}
                          className={user.isBlocked ? "gap-1.5" : "gap-1.5 text-destructive"}
                        >
                          {user.isBlocked ? (
                            <>
                              <ShieldCheck className="size-3.5" /> Unblock
                            </>
                          ) : (
                            <>
                              <ShieldBan className="size-3.5" /> Block
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            Showing {visible.length} of {users.length} customers
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={search ? "No customers match your search" : "No customers yet"}
          description={
            search
              ? "Try a different name, email or phone number."
              : "Customers will appear here as soon as they create an account."
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        onConfirm={toggleBlock}
        loading={busy}
        destructive={!target?.isBlocked}
        title={target?.isBlocked ? "Unblock this customer?" : "Block this customer?"}
        description={
          target?.isBlocked
            ? `${target?.name} will be able to sign in and book appointments again.`
            : `${target?.name} will not be able to sign in or book appointments until unblocked.`
        }
        confirmLabel={target?.isBlocked ? "Unblock customer" : "Block customer"}
      />

      <Modal
        open={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        title="Customer details"
        description="Full profile information and booking activity for this registered customer."
      >
        {viewUser ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-4">
              <Avatar src={viewUser.image} name={viewUser.name} size={54} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold">{viewUser.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{viewUser.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                    {viewUser.role}
                  </span>
                  {viewUser.isBlocked ? (
                    <Badge variant="danger" dot>
                      Blocked
                    </Badge>
                  ) : (
                    <Badge variant="success" dot>
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-xl border border-border/70 p-3.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</p>
                <p className="mt-1 font-medium">{viewUser.phone || "Not provided"}</p>
              </div>
              <div className="rounded-xl border border-border/70 p-3.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Date Registered</p>
                <p className="mt-1 font-medium">
                  {viewUser.createdAt ? formatDate(viewUser.createdAt) : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 p-3.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Total Appointments</p>
                <p className="mt-1 text-lg font-semibold">{viewUser.appointmentCount}</p>
              </div>
              <div className="rounded-xl border border-border/70 p-3.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Account Status</p>
                <p className="mt-1 font-medium">
                  {viewUser.isBlocked ? "Blocked from booking" : "In good standing"}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant={viewUser.isBlocked ? "default" : "destructive"}
                size="sm"
                onClick={() => {
                  setTarget(viewUser)
                  setViewUser(null)
                }}
              >
                {viewUser.isBlocked ? "Unblock this customer" : "Block this customer"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
