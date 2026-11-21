"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Scissors,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignOutButton } from "@/components/dashboard/sign-out-button"
import type { Role } from "@/lib/types"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

const customerNav: NavItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarDays },
  { href: "/dashboard/customer/transactions", label: "Payments", icon: ReceiptText },
  { href: "/dashboard/customer/profile", label: "My Profile", icon: UserRound },
]

const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/services", label: "Services", icon: Scissors },
  { href: "/dashboard/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/dashboard/admin/users", label: "Customers", icon: Users },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/dashboard/admin/profile", label: "My Profile", icon: UserRound },
]

export function DashboardShell({
  user,
  children,
}: {
  user: { name: string; email: string; image?: string | null; role: Role }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileNav, setMobileNav] = React.useState<{ open: boolean; path: string }>({
    open: false,
    path: pathname,
  })
  const mobileOpen = mobileNav.open && mobileNav.path === pathname
  const setMobileOpen = (open: boolean) => setMobileNav({ open, path: pathname })
  const nav = user.role === "admin" ? adminNav : customerNav

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-18 shrink-0 items-center justify-between px-5">
        <Logo light />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileOpen(false)}
          className="rounded-full text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close navigation"
        >
          <X />
        </Button>
      </div>

      <div className="mx-4 mb-5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar src={user.image} name={user.name} size={38} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-white/50">{user.email}</p>
          </div>
        </div>
        <span className="mt-2.5 inline-flex rounded-full bg-[#d99aa4]/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#f0c9ce] uppercase">
          {user.role === "admin" ? "Administrator" : "Customer"}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Dashboard navigation">
        <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.18em] text-white/35 uppercase">
          {user.role === "admin" ? "Salon management" : "My account"}
        </p>
        {nav.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-white/12 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "size-4.5 shrink-0",
                  active ? "text-[#f0c9ce]" : "text-white/45 group-hover:text-white/80"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active ? <ChevronRight className="size-3.5 text-[#f0c9ce]" /> : null}
            </Link>
          )
        })}

        <div className="mt-5 border-t border-white/10 pt-4">
          <Link
            href="/services"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/8 hover:text-white"
          >
            <Sparkles className="size-4.5 shrink-0 text-white/45 group-hover:text-white/80" />
            Browse services
          </Link>
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/8 hover:text-white"
          >
            <LayoutDashboard className="size-4.5 shrink-0 text-white/45 group-hover:text-white/80" />
            Back to website
          </Link>
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <SignOutButton
          variant="ghost"
          className="w-full justify-start text-white/60 hover:bg-white/8 hover:text-white"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[#2b1f22] lg:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#221a1c]/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative h-full w-72 max-w-[85vw] bg-[#2b1f22] shadow-2xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </Button>

          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-foreground">
              {nav.find((item) => isActive(item))?.label ?? "Overview"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge variant={user.role === "admin" ? "brand" : "success"} className="hidden sm:inline-flex">
              {user.role}
            </Badge>
            <ThemeToggle />
            <Link
              href={
                user.role === "admin"
                  ? "/dashboard/admin/profile"
                  : "/dashboard/customer/profile"
              }
              aria-label="Open my profile"
              className="ml-1 rounded-full ring-2 ring-transparent transition hover:ring-primary/40"
            >
              <Avatar src={user.image} name={user.name} size={32} />
            </Link>
          </div>
        </header>

        <main className="container-page py-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
