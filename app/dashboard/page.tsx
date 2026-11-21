import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in?redirect=/dashboard")

  redirect(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer")
}
