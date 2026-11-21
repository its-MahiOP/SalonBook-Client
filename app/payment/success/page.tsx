import { PaymentSuccess } from "@/components/payments/payment-success"

export const dynamic = "force-dynamic"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  return <PaymentSuccess sessionId={params.session_id} />
}
