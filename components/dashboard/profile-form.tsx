"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Camera, ImagePlus, KeyRound, Link2, Save, ShieldCheck, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { apiFetch, ApiError } from "@/lib/api"
import { uploadImage, validateImageFile } from "@/lib/upload"
import { getInitials } from "@/lib/format"
import type { Role } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input, Label, FieldError } from "@/components/ui/form-controls"
import { PasswordInput } from "@/components/auth/password-input"
import { Spinner } from "@/components/ui/loader"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ProfileUser = {
  name: string
  email: string
  phone?: string | null
  image?: string | null
  role: Role
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()
  const fileRef = React.useRef<HTMLInputElement>(null)

  const [name, setName] = React.useState(user.name || "")
  const [phone, setPhone] = React.useState(user.phone || "")
  const [image, setImage] = React.useState(user.image || "")
  const [imageMode, setImageMode] = React.useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = React.useState(user.image || "")
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({})
  const [changingPassword, setChangingPassword] = React.useState(false)

  const preview = image || (imageMode === "url" ? imageUrl : "")

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const fileError = validateImageFile(file)
    if (fileError) {
      toast.error(fileError)
      event.target.value = ""
      return
    }
    setUploading(true)
    try {
      const url = await uploadImage(file, "avatar")
      setImage(url)
      setImageMode("upload")
      toast.success("Photo uploaded — remember to save your profile")
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2) nextErrors.name = "Please enter your full name"
    if (phone && !/^[+\d][\d\s()-]{5,23}$/.test(phone.trim())) {
      nextErrors.phone = "Enter a valid phone number"
    }
    if (imageMode === "url" && imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
      nextErrors.image = "Image URL must start with http:// or https://"
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const payload: Record<string, string> = { name: name.trim() }
      if (phone.trim()) payload.phone = phone.trim()
      const finalImage = imageMode === "url" ? imageUrl.trim() : image
      payload.image = finalImage

      await apiFetch("/api/profile", { method: "PATCH", body: payload })
      setImage(finalImage)
      router.refresh()
      toast.success("Profile updated successfully")
    } catch (saveError) {
      toast.error(
        saveError instanceof ApiError ? saveError.message : "Could not save your profile"
      )
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!currentPassword) nextErrors.currentPassword = "Enter your current password"
    if (newPassword.length < 6) {
      nextErrors.newPassword = "New password must be at least 6 characters"
    } else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      nextErrors.newPassword = "Use at least one uppercase and one lowercase letter"
    }
    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match"
    }
    setPasswordErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setChangingPassword(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      })
      if (error) {
        toast.error(error.message || "Could not change your password")
        return
      }
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password changed successfully")
    } catch {
      toast.error("Could not change your password. Please try again.")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <form onSubmit={handleSave} noValidate className="surface-card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Personal details</h2>
          <p className="text-xs text-muted-foreground">
            Keep your contact details up to date so we can reach you about appointments.
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={name ? `${name}'s profile photo` : "Profile photo"}
                className="size-20 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#7d4a55] text-xl font-semibold text-primary-foreground">
                {getInitials(name)}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Upload a new profile photo"
              className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm transition hover:bg-muted"
            >
              {uploading ? <Spinner className="size-3.5" /> : <Camera className="size-3.5" />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <div className="mb-2 flex gap-1 rounded-lg bg-muted p-1">
              {[
                { id: "upload" as const, label: "Upload", icon: ImagePlus },
                { id: "url" as const, label: "Image URL", icon: Link2 },
              ].map((mode) => {
                const Icon = mode.icon
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
                    <Icon className="size-3.5" /> {mode.label}
                  </button>
                )
              })}
            </div>
            {imageMode === "url" ? (
              <>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  aria-invalid={Boolean(errors.image)}
                />
                <FieldError>{errors.image}</FieldError>
              </>
            ) : (
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                JPG, PNG, WEBP or GIF up to 5 MB. Square photos work best.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profileName" required>
              Full name
            </Label>
            <Input
              id="profileName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            <FieldError>{errors.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="profilePhone">Phone number</Label>
            <Input
              id="profilePhone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 (555) 000-0000"
              aria-invalid={Boolean(errors.phone)}
            />
            <FieldError>{errors.phone}</FieldError>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="profileEmail">Email address</Label>
            <Input id="profileEmail" value={user.email} disabled />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Your sign-in email cannot be changed here. Contact the salon if you need to
              update it.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={saving || uploading} className="h-10 gap-2">
            {saving ? <Spinner /> : <Save className="size-4" />}
            Save changes
          </Button>
          {preview ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-1.5 text-muted-foreground"
              onClick={() => {
                setImage("")
                setImageUrl("")
              }}
            >
              <Trash2 className="size-3.5" /> Remove photo
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-5">
        <div className="surface-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Account status</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your SalonBook membership and access level.
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Role</dt>
              <dd>
                <Badge variant={user.role === "admin" ? "brand" : "success"} dot>
                  {user.role}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Account</dt>
              <dd className="font-medium text-emerald-600 dark:text-emerald-400">Active</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handlePasswordChange} noValidate className="surface-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <KeyRound className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Change password</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use at least 6 characters with upper and lowercase letters.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="currentPassword">Current password</Label>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                aria-invalid={Boolean(passwordErrors.currentPassword)}
              />
              <FieldError>{passwordErrors.currentPassword}</FieldError>
            </div>
            <div>
              <Label htmlFor="newPassword">New password</Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                aria-invalid={Boolean(passwordErrors.newPassword)}
              />
              <FieldError>{passwordErrors.newPassword}</FieldError>
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <PasswordInput
                id="confirmNewPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={Boolean(passwordErrors.confirmPassword)}
              />
              <FieldError>{passwordErrors.confirmPassword}</FieldError>
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={changingPassword}
              className="h-10 w-full gap-2"
            >
              {changingPassword ? <Spinner /> : <KeyRound className="size-4" />}
              Update password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
