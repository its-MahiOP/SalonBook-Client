"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,


  UserRound,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Avatar } from "@/components/ui/avatar"
import { Logo } from "@/components/layout/logo"

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleSignOut() {
    await authClient.signOut()
    setMenuOpen(false)
    toast.success("You have been signed out")
    router.push("/")
    router.refresh()
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive("/dashboard")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:inline-flex" />

          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-border/80 bg-card py-1 pr-2.5 pl-1 text-left shadow-xs transition hover:border-primary/40"
              >
                <Avatar src={user.image} name={user.name} size={32} />
                <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                  {user.name}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform",
                    menuOpen && "rotate-180"
                  )}
                />
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl"
                >
                  <div className="border-b border-border/70 px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Link>
                    <Link
                      href={
                        user.role === "admin"
                          ? "/dashboard/admin/profile"
                          : "/dashboard/customer/profile"
                      }
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <UserRound className="size-4" /> My Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" /> Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <LinkButton href="/sign-in" variant="ghost" className="h-9 px-4">
                Sign In
              </LinkButton>
              <LinkButton href="/sign-up" className="h-9 px-5 shadow-sm shadow-primary/20">
                Sign Up
              </LinkButton>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border/70 bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <LinkButton href="/sign-in" variant="outline" className="h-10">
                  Sign In
                </LinkButton>
                <LinkButton href="/sign-up" className="h-10">
                  Sign Up
                </LinkButton>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
              <span className="text-xs text-muted-foreground">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
