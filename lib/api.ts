const API_BASE_URL = (
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || "https://salon-book-server-flame.vercel.app"
).replace(/\/+$/, "")

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status = 500, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

let cachedToken: { token: string; expiresAt: number } | null = null

export function clearTokenCache() {
  cachedToken = null
}

async function getAuthToken(force = false): Promise<string | null> {
  if (
    !force &&
    cachedToken &&
    cachedToken.expiresAt > Date.now() + 30_000
  ) {
    return cachedToken.token
  }

  try {
    const response = await fetch("/api/auth/token", {
      credentials: "include",
      cache: "no-store",
    })
    if (!response.ok) return null
    const data = (await response.json()) as { token?: string }
    if (!data.token) return null
    cachedToken = {
      token: data.token,
      // The Better Auth JWT lives for one hour; refresh the cache before then.
      expiresAt: Date.now() + 15 * 60 * 1000,
    }
    return data.token
  } catch {
    return null
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

export async function apiFetch<T>(
  path: string,
  { method, body, auth = true, signal }: ApiFetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  if (auth) {
    const token = await getAuthToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: method ?? (body !== undefined ? "POST" : "GET"),
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal,
    })
  } catch {
    throw new ApiError(
      "Could not reach the SalonBook server. Please check your connection and try again."
    )
  }

  const data = await response.json().catch(() => ({
    message: "The server returned an unexpected response.",
  }))

  if (!response.ok) {
    if (response.status === 401) clearTokenCache()
    throw new ApiError(
      (data as { message?: string }).message || "Something went wrong.",
      response.status,
      (data as { details?: unknown }).details
    )
  }

  return data as T
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

/** Fetch helper for public data in server components. */
export async function publicApiFetch<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!response.ok) return null as T
    return (await response.json()) as T
  } catch {
    return null as T
  }
}
