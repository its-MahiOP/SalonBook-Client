import Link from "next/link"
import {
  Camera,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { SALON_INFO } from "@/lib/constants"

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

const quickLinks = [
  { href: "/dashboard", label: "My Dashboard" },
  { href: "/services?category=Haircut%20%26%20Styling", label: "Haircut & Styling" },
  { href: "/services?category=Facial%20%26%20Skincare", label: "Facial & Skincare" },
  { href: "/services?category=Spa%20%26%20Massage", label: "Spa & Massage" },
]

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#2f2125] text-white/75">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A calm, welcoming salon where expert stylists and thoughtful care help
              you look and feel your absolute best.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={SALON_INFO.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="SalonBook on Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-primary hover:bg-primary/20 hover:text-white"
              >
                <Camera className="size-4" />
              </a>
              <a
                href={SALON_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="SalonBook on Facebook"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-primary hover:bg-primary/20 hover:text-white"
              >
                <Globe className="size-4" />
              </a>
              <a
                href={SALON_INFO.socials.pinterest}
                target="_blank"
                rel="noreferrer"
                aria-label="SalonBook on Pinterest"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-primary hover:bg-primary/20 hover:text-white"
              >
                <Send className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold text-white">
              Popular Treatments
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold text-white">Visit Us</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="leading-relaxed text-white/60">{SALON_INFO.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`tel:${SALON_INFO.phone}`} className="hover:text-white">
                  {SALON_INFO.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`mailto:${SALON_INFO.email}`} className="hover:text-white">
                  {SALON_INFO.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3.5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white">
                <Clock className="size-3.5 text-primary" /> Opening Hours
              </p>
              {SALON_INFO.hours.map((item) => (
                <div
                  key={item.day}
                  className="flex justify-between gap-3 text-[11px] leading-5 text-white/55"
                >
                  <span>{item.day}</span>
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SALON_INFO.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
