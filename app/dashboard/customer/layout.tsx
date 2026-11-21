import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in?redirect=/dashboard/customer")
  if (session.user.role === "admin") redirect("/dashboard/admin")

  return <>{children}</>
}
