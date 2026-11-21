import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your SalonBook account to manage appointments and payments.",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const redirectTo =
    params.redirect && params.redirect.startsWith("/") && !params.redirect.startsWith("//")
      ? params.redirect
      : undefined

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to SalonBook"
      description="Pick up where you left off — view your appointments, request a new treatment or complete a payment."
    >
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  )
}
