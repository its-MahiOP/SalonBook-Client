import { PageHeader } from "@/components/ui/section"
import { ServiceForm } from "@/components/admin/service-form"

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add a new service"
        description="Create a treatment for the salon menu. It will appear publicly once saved as active."
      />
      <ServiceForm />
    </div>
  )
}
