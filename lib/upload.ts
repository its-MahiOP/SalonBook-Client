type UploadKind = "avatar" | "service"

export async function uploadImage(file: File, kind: UploadKind): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)
  formData.append("kind", kind)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await response.json().catch(() => ({
    message: "Image upload failed. Please try again.",
  }))

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed. Please try again.")
  }

  return data.data.url as string
}

export function validateImageFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowed.includes(file.type)) {
    return "Please choose a JPG, PNG, WEBP or GIF image."
  }
  if (file.size > 5 * 1024 * 1024) {
    return "Image must be smaller than 5 MB."
  }
  return null
}
