import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 15
const attempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "Image hosting is not configured." },
      { status: 500 }
    )
  }

  const headerList = await headers()
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many uploads. Please wait a minute and try again." },
      { status: 429 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid upload request." },
      { status: 400 }
    )
  }

  const file = formData.get("image")
  const kind = String(formData.get("kind") || "avatar")

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "Please choose an image to upload." },
      { status: 400 }
    )
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { success: false, message: "Only JPG, PNG, WEBP or GIF images are allowed." },
      { status: 400 }
    )
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, message: "Image must be smaller than 5 MB." },
      { status: 400 }
    )
  }

  if (kind === "service") {
    const session = await auth.api.getSession({ headers: headerList })
    const role = (session?.user as { role?: string } | undefined)?.role
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only administrators can upload service images." },
        { status: 403 }
      )
    }
  }

  try {
    const uploadBody = new FormData()
    uploadBody.append("image", file, file.name || "salonbook-image")

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadBody }
    )
    const result = await response.json()

    if (!response.ok || !result?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result?.error?.message || "The image could not be uploaded. Please try again.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.data.display_url || result.data.url,
        thumb: result.data.thumb?.url || result.data.display_url,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "The image service is unavailable right now." },
      { status: 502 }
    )
  }
}
