import { PageLoader } from "@/components/ui/loader"

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <PageLoader label="Preparing your SalonBook experience…" />
    </div>
  )
}
