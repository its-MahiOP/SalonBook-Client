import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free SalonBook account and book salon appointments online.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Join SalonBook"
      title="Create your account"
      description="It takes less than a minute to start booking trusted salon treatments near you."
    >
      <SignUpForm />
    </AuthShell>
  )
}
