import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BlockedScreen } from "@/components/dashboard/blocked-screen"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/sign-in?redirect=/dashboard")
  }

  if (session.user.isBlocked) {
    return <BlockedScreen email={session.user.email} />
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role === "admin" ? "admin" : "customer",
      }}
    >
      {children}
    </DashboardShell>
  )
}
