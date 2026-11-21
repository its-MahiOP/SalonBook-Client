import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/ui/section"
import { ProfileForm } from "@/components/dashboard/profile-form"

export const dynamic = "force-dynamic"

export default async function CustomerProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in?redirect=/dashboard/customer/profile")

  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile"
        description="Manage your photo, contact details and password."
      />
      <ProfileForm
        user={{
          name: session.user.name,
          email: session.user.email,
          phone: session.user.phone,
          image: session.user.image,
          role: "customer",
        }}
      />
    </div>
  )
}
