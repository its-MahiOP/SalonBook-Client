"use client"

import * as React from "react"
import { apiFetch, ApiError } from "@/lib/api"

type RequestState<T> = {
  key: string
  data: T | null
  error: string | null
}

export function useApiData<T>(path: string | null) {
  const [version, setVersion] = React.useState(0)
  const [state, setState] = React.useState<RequestState<T>>({
    key: "",
    data: null,
    error: null,
  })

  const requestKey = `${path ?? ""}|${version}`

  React.useEffect(() => {
    if (!path) return

    const controller = new AbortController()

    apiFetch<T>(path, { signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) {
          setState({ key: requestKey, data: response, error: null })
        }
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return
        setState({
          key: requestKey,
          data: null,
          error:
            fetchError instanceof ApiError
              ? fetchError.message
              : "Could not load this data. Please try again.",
        })
      })

    return () => controller.abort()
  }, [path, requestKey])

  const current = state.key === requestKey ? state : null

  const reload = React.useCallback(() => setVersion((value) => value + 1), [])

  return {
    data: current?.data ?? null,
    loading: Boolean(path) && !current,
    error: current?.error ?? null,
    reload,
  }
}
