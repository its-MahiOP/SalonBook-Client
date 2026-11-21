"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ImagePlus, Link2, Save, UploadCloud } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import { uploadImage, validateImageFile } from "@/lib/upload"
import { CATEGORIES } from "@/lib/constants"
import type { ApiResponse, Service } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea, Select, FieldError } from "@/components/ui/form-controls"
import { Spinner } from "@/components/ui/loader"
import { LinkButton } from "@/components/ui/link-button"
import { cn } from "@/lib/utils"

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const editing = Boolean(service)

  const [serviceName, setServiceName] = React.useState(service?.serviceName ?? "")
  const [category, setCategory] = React.useState(service?.category ?? CATEGORIES[0])
  const [description, setDescription] = React.useState(service?.description ?? "")
  const [price, setPrice] = React.useState(service ? String(service.price) : "")
  const [duration, setDuration] = React.useState(service ? String(service.duration) : "")
  const [status, setStatus] = React.useState<"active" | "inactive">(
    service?.status ?? "active"
  )
  const [image, setImage] = React.useState(service?.image ?? "")
  const [imageMode, setImageMode] = React.useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = React.useState(service?.image ?? "")
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

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
      const url = await uploadImage(file, "service")
      setImage(url)
      setImageMode("upload")
      toast.success("Image uploaded")
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (serviceName.trim().length < 3) nextErrors.serviceName = "Use at least 3 characters"
    if (description.trim().length < 10) {
      nextErrors.description = "Describe the treatment in at least 10 characters"
    }
    const priceNumber = Number(price)
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      nextErrors.price = "Enter a price greater than zero"
    }
    const durationNumber = Number(duration)
    if (!Number.isInteger(durationNumber) || durationNumber <= 0 || durationNumber > 720) {
      nextErrors.duration = "Duration must be between 1 and 720 minutes"
    }
    const finalImage = imageMode === "url" ? imageUrl.trim() : image
    if (!finalImage) nextErrors.image = "Please upload an image or paste an image URL"
    else if (!/^https?:\/\/.+/i.test(finalImage)) nextErrors.image = "Enter a valid image URL"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const body = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: priceNumber,
        duration: durationNumber,
        image: finalImage,
        status,
      }
      if (editing && service) {
        await apiFetch<ApiResponse<Service>>(`/api/services/${service.id}`, {
          method: "PATCH",
          body,
        })
        toast.success("Service updated successfully")
      } else {
        await apiFetch<ApiResponse<Service>>("/api/services", { method: "POST", body })
        toast.success("Service added to the salon menu")
      }
      router.push("/dashboard/admin/services")
      router.refresh()
    } catch (saveError) {
      toast.error(
        saveError instanceof ApiError ? saveError.message : "Could not save the service"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="surface-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Service details</h2>
            <p className="text-xs text-muted-foreground">
              This information appears on the public salon menu.
            </p>
          </div>
          <LinkButton href="/dashboard/admin/services" variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-3.5" /> Back
          </LinkButton>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceName" required>
              Service name
            </Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(event) => setServiceName(event.target.value)}
              placeholder="e.g. Signature Cut & Blow Dry"
              aria-invalid={Boolean(errors.serviceName)}
            />
            <FieldError>{errors.serviceName}</FieldError>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category" required>
                Category
              </Label>
              <Select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="status" required>
                Availability
              </Label>
              <Select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value as "active" | "inactive")}
              >
                <option value="active">Active — bookable</option>
                <option value="inactive">Inactive — hidden</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" required>
              Description
            </Label>
            <Textarea
              id="description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the treatment, what is included and how the guest will feel…"
              aria-invalid={Boolean(errors.description)}
            />
            <FieldError>{errors.description}</FieldError>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price" required>
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="85.00"
                aria-invalid={Boolean(errors.price)}
              />
              <FieldError>{errors.price}</FieldError>
            </div>
            <div>
              <Label htmlFor="duration" required>
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="720"
                step="5"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                placeholder="60"
                aria-invalid={Boolean(errors.duration)}
              />
              <FieldError>{errors.duration}</FieldError>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card h-fit p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Service image</h2>
        <p className="text-xs text-muted-foreground">
          A beautiful photo helps guests choose this treatment.
        </p>

        <div className="mt-4 flex gap-1 rounded-lg bg-muted p-1">
          {[
            { id: "upload" as const, label: "Upload", icon: UploadCloud },
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

        <div className="mt-3">
          {preview ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
              <Image src={preview} alt="Service preview" fill sizes="400px" className="object-cover" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card/60 text-center">
              <ImagePlus className="size-6 text-primary" />
              <p className="text-xs font-medium">No image selected yet</p>
            </div>
          )}
        </div>

        <div className="mt-3">
          {imageMode === "upload" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full gap-2"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? <Spinner /> : <ImagePlus className="size-4" />}
                {uploading ? "Uploading…" : preview ? "Replace image" : "Upload image"}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFile}
                className="hidden"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                JPG, PNG, WEBP or GIF up to 5 MB.
              </p>
            </>
          ) : (
            <>
              <Input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/service.jpg"
                aria-invalid={Boolean(errors.image)}
              />
              <FieldError>{errors.image}</FieldError>
            </>
          )}
        </div>

        <Button
          type="submit"
          disabled={saving || uploading}
          className="mt-5 h-11 w-full gap-2 shadow-md shadow-primary/20"
        >
          {saving ? <Spinner /> : <Save className="size-4" />}
          {editing ? "Save changes" : "Add service"}
        </Button>
      </div>
    </form>
  )
}
