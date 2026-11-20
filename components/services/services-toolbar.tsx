"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants"
import { Input, Select } from "@/components/ui/form-controls"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/loader"

export function ServicesToolbar({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") || ""
  const currentCategory = searchParams.get("category") || "all"
  const currentSort = searchParams.get("sort") || "newest"

  const [search, setSearch] = React.useState(currentSearch)
  const [navigating, startTransition] = React.useTransition()

  React.useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") params.delete(key)
      else params.set(key, value)
    })
    const query = params.toString()
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  React.useEffect(() => {
    if (search === currentSearch) return
    const timeout = setTimeout(() => {
      updateParams({ search: search.trim() || null })
    }, 350)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const hasFilters =
    Boolean(currentSearch) || currentCategory !== "all" || currentSort !== "newest"

  return (
    <div className="surface-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search treatments, e.g. balayage, facial, massage…"
            aria-label="Search services"
            className="h-11 pl-10"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <Select
            aria-label="Filter by category"
            value={currentCategory}
            onChange={(event) => updateParams({ category: event.target.value })}
            className="sm:w-48"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Sort services"
            value={currentSort}
            onChange={(event) => updateParams({ sort: event.target.value })}
            className="sm:w-44"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          {navigating ? (
            <span className="inline-flex items-center gap-1.5">
              <Spinner className="size-3" /> Updating results…
            </span>
          ) : (
            <span>
              <strong className="font-semibold text-foreground">{total}</strong>{" "}
              {total === 1 ? "service" : "services"} available
            </span>
          )}
        </p>

        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => {
              setSearch("")
              startTransition(() => router.push(pathname, { scroll: false }))
            }}
            className="h-7 gap-1 text-xs text-muted-foreground"
          >
            <X className="size-3.5" /> Reset filters
          </Button>
        ) : null}
      </div>
    </div>
  )
}
