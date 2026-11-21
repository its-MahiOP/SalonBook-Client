"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input, Label, FieldError } from "@/components/ui/form-controls"
import { PasswordInput } from "@/components/auth/password-input"
import { GoogleIcon } from "@/components/auth/google-icon"
import { Spinner } from "@/components/ui/loader"

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address"
    }
    if (!password) nextErrors.password = "Please enter your password"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      })
      if (error) {
        toast.error(error.message || "Invalid email or password")
        return
      }

      const session = await authClient.getSession()
      const user = session.data?.user
      if (!user) {
        toast.error("Could not load your account. Please try again.")
        return
      }
      if (user.isBlocked) {
        await authClient.signOut()
        toast.error("Your account has been blocked. Please contact the salon for help.")
        return
      }

      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`)
      router.push(
        redirectTo || (user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer")
      )
      router.refresh()
    } catch {
      toast.error("Sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo || "/dashboard",
        errorCallbackURL: "/sign-in",
      })
    } catch {
      toast.error("Google sign in could not be started. Please try again.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="surface-card p-6 sm:p-7">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="email" required>
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="password" required>
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          <FieldError>{errors.password}</FieldError>
        </div>

        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="mt-1 h-11 w-full gap-2 text-sm shadow-md shadow-primary/20"
        >
          {loading ? (
            <>
              <Spinner /> Signing in…
            </>
          ) : (
            <>
              Sign In <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={loading || googleLoading}
        className="h-11 w-full gap-2.5 text-sm"
      >
        {googleLoading ? <Spinner /> : <GoogleIcon className="size-4" />}
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to SalonBook?{" "}
        <Link href="/sign-up" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
