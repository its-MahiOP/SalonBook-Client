import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/ui/section"
import { ProfileForm } from "@/components/dashboard/profile-form"

export const dynamic = "force-dynamic"

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in?redirect=/dashboard/admin/profile")
  if (session.user.role !== "admin") redirect("/dashboard/customer/profile")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator profile"
        description="Your admin account details, photo and security settings."
      />
      <ProfileForm
        user={{
          name: session.user.name,
          email: session.user.email,
          phone: session.user.phone,
          image: session.user.image,
          role: "admin",
        }}
      />
    </div>
  )
}
