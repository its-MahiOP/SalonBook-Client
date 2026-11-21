"use client"

import { PackageSearch } from "lucide-react"

import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse, Service } from "@/lib/types"
import { PageHeader } from "@/components/ui/section"
import { LinkButton } from "@/components/ui/link-button"
import { ServiceForm } from "@/components/admin/service-form"
import { PageLoader } from "@/components/ui/loader"

export function EditServiceLoader({ id }: { id: string }) {
  const { data, loading, error, reload } = useApiData<ApiResponse<Service>>(
    `/api/services/${id}`
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit service" description="Loading the treatment details…" />
        <PageLoader label="Loading service…" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit service" />
        <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
          <PackageSearch className="size-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">Service could not be loaded</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {error ?? "This service may have been removed from the salon menu."}
          </p>
          <div className="mt-5 flex gap-2">
            <LinkButton href="/dashboard/admin/services" variant="outline">
              Back to services
            </LinkButton>
            <button
              type="button"
              onClick={reload}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${data.data.serviceName}`}
        description="Update the treatment details, pricing or availability."
      />
      <ServiceForm service={data.data} />
    </div>
  )
}
