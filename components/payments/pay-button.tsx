"use client"

import * as React from "react"
import { CreditCard } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/loader"

export function PayButton({
  appointmentId,
  amount,
  className,
  label,
}: {
  appointmentId: string
  amount: string
  className?: string
  label?: string
}) {
  const [loading, setLoading] = React.useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      const response = await apiFetch<ApiResponse<{ url: string }>>(
        "/api/payments/checkout",
        { method: "POST", body: { appointmentId } }
      )
      if (response.data?.url) {
        window.location.href = response.data.url
        return
      }
      toast.error("Payment could not be started. Please try again.")
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Payment could not be started. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handlePay}
      disabled={loading}
      className={className ?? "gap-1.5"}
    >
      {loading ? <Spinner className="size-3.5" /> : <CreditCard className="size-3.5" />}
      {label ?? `Pay ${amount}`}
    </Button>
  )
}
