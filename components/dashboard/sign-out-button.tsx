"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SignOutButton({
  className,
  variant = "ghost",
  children,
}: {
  className?: string
  variant?: "ghost" | "outline" | "default" | "destructive"
  children?: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function handleSignOut() {
    setLoading(true)
    try {
      await authClient.signOut()
      toast.success("You have been signed out")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Could not sign out. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleSignOut}
      disabled={loading}
      className={cn("gap-2", className)}
    >
      <LogOut className="size-4" />
      {children ?? "Logout"}
    </Button>
  )
}
