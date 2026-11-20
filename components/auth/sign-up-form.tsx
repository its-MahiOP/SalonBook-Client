"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, ImagePlus, Link2, UploadCloud, X } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { uploadImage, validateImageFile } from "@/lib/upload"
import { Button } from "@/components/ui/button"
import { Input, Label, FieldError } from "@/components/ui/form-controls"
import { PasswordInput } from "@/components/auth/password-input"
import { GoogleIcon } from "@/components/auth/google-icon"
import { Spinner } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

const passwordRules = [
  { label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
]

export function SignUpForm() {
  const router = useRouter()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [imageMode, setImageMode] = React.useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = React.useState("")
  const [uploadedImage, setUploadedImage] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)

  const preview = uploadedImage || (imageMode === "url" ? imageUrl : "")
  const passwordChecks = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }))

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const error = validateImageFile(file)
    if (error) {
      toast.error(error)
      event.target.value = ""
      return
    }

    setUploading(true)
    try {
      const url = await uploadImage(file, "avatar")
      setUploadedImage(url)
      toast.success("Profile photo uploaded")
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2) nextErrors.name = "Please enter your full name"
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address"
    }
    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters"
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      nextErrors.password = "Password needs one uppercase and one lowercase letter"
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match"
    }
    if (imageMode === "url" && imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
      nextErrors.image = "Image URL must start with http:// or https://"
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const finalImage = uploadedImage || (imageMode === "url" ? imageUrl.trim() : "")
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: finalImage || undefined,
      })

      if (error) {
        toast.error(error.message || "We could not create your account")
        return
      }

      const session = await authClient.getSession()
      const role = session.data?.user.role
      toast.success("Welcome to SalonBook! Your account is ready.")
      router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/customer")
      router.refresh()
    } catch {
      toast.error("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/sign-up",
      })
    } catch {
      toast.error("Google sign up could not be started. Please try again.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="surface-card p-6 sm:p-7">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="name" required>
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="e.g. Amara Khan"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError>{errors.name}</FieldError>
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="password" required>
              Password
            </Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            <FieldError>{errors.password}</FieldError>
          </div>
          <div>
            <Label htmlFor="confirmPassword" required>
              Confirm password
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            <FieldError>{errors.confirmPassword}</FieldError>
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-3">
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Password must include
          </p>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {passwordChecks.map((rule) => (
              <span
                key={rule.label}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px]",
                  rule.passed ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                )}
              >
                <Check
                  className={cn(
                    "size-3.5",
                    rule.passed ? "opacity-100" : "opacity-30"
                  )}
                />
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <Label>Profile photo (optional)</Label>
          <div className="mb-2.5 flex gap-1 rounded-lg bg-muted p-1">
            {[
              { id: "upload" as const, label: "Upload image", icon: UploadCloud },
              { id: "url" as const, label: "Image URL", icon: Link2 },
            ].map((mode) => {
              const ModeIcon = mode.icon
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setImageMode(mode.id)}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition",
                    imageMode === mode.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ModeIcon className="size-3.5" /> {mode.label}
                </button>
              )
            })}
          </div>

          {preview ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Profile preview"
                className="size-12 rounded-full border border-border object-cover"
                onError={() => {
                  if (imageMode === "url") setErrors({ ...errors, image: "That image could not be loaded" })
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">Photo ready</p>
                <p className="text-[11px] text-muted-foreground">
                  Looking good — you can change this later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadedImage("")
                  setImageUrl("")
                }}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Remove photo"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : imageMode === "upload" ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card/60 px-4 py-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
            >
              {uploading ? (
                <Spinner className="size-5 text-primary" />
              ) : (
                <ImagePlus className="size-5 text-primary" />
              )}
              <span className="text-xs font-medium">
                {uploading ? "Uploading photo…" : "Click to upload a profile photo"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                JPG, PNG, WEBP or GIF · up to 5 MB
              </span>
            </button>
          ) : (
            <>
              <Input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                aria-invalid={Boolean(errors.image)}
              />
              <FieldError>{errors.image}</FieldError>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || uploading || googleLoading}
          className="h-11 w-full gap-2 text-sm shadow-md shadow-primary/20"
        >
          {loading ? (
            <>
              <Spinner /> Creating account…
            </>
          ) : (
            <>
              Create Account <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          By creating an account you agree to our salon booking terms and privacy
          practices.
        </p>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={loading || uploading || googleLoading}
        className="h-11 w-full gap-2.5 text-sm"
      >
        {googleLoading ? <Spinner /> : <GoogleIcon className="size-4" />}
        Continue with Google
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
