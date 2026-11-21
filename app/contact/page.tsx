import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { PublicShell } from "@/components/layout/public-shell"
import { PageHeader } from "@/components/ui/section"
import { ContactForm } from "@/components/marketing/contact-form"
import { SALON_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find SalonBook opening hours, address and contact details, or send us a message about a booking.",
}

export default function ContactPage() {
  return (
    <PublicShell>
      <div className="container-page py-10 sm:py-14">
        <PageHeader
          title="Visit or get in touch"
          description="We are a short walk from the Rosewood Avenue tram stop, with step-free access at the main entrance."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <div className="surface-card p-5">
              <h2 className="text-base font-semibold">Salon details</h2>
              <ul className="mt-4 space-y-3.5 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{SALON_INFO.address}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a
                      href={`tel:${SALON_INFO.phone}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {SALON_INFO.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${SALON_INFO.email}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {SALON_INFO.email}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="surface-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Clock className="size-4 text-primary" /> Opening hours
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                {SALON_INFO.hours.map((item) => (
                  <div key={item.day} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{item.day}</dt>
                    <dd className="font-medium">{item.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-lg bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
                Last appointment starts one hour before closing. Online booking is available 24/7
                and every request is confirmed by our team.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </PublicShell>
  )
}
