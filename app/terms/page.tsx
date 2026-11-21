import type { Metadata } from "next"

import { PublicShell } from "@/components/layout/public-shell"
import { PageHeader } from "@/components/ui/section"
import { SALON_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you create a SalonBook account, book an appointment and pay for salon services.",
}

const sections = [
  {
    title: "Your account",
    body: [
      "You must provide accurate details when creating an account and keep your password private. You are responsible for activity that happens under your account.",
      "One account per person. Accounts may be blocked if they are used to make repeated fake bookings, abuse staff or interfere with the service.",
    ],
  },
  {
    title: "Bookings",
    body: [
      "Appointment requests are reviewed by the salon and become confirmed once approved. The time slot is held for you while the request is pending.",
      "Please arrive five to ten minutes early. If you are more than 15 minutes late we may need to shorten or reschedule the service.",
    ],
  },
  {
    title: "Cancellations",
    body: [
      "You can cancel a pending or confirmed appointment from your dashboard. We ask for at least 24 hours notice so the slot can be offered to another guest.",
      "The salon may cancel or reschedule an appointment in exceptional circumstances. If that happens we will contact you using the details on your account.",
    ],
  },
  {
    title: "Payments",
    body: [
      "Prices are shown in US dollars and include the services listed at the time of booking. Payment is taken securely through Stripe Checkout.",
      "An appointment is only marked as paid after Stripe confirms the payment to our server. Refunds are handled by the salon in line with the service delivered.",
    ],
  },
  {
    title: "Service and conduct",
    body: [
      "We aim to deliver every service with professional care. If you are unhappy with a result, tell us within seven days and we will work with you to put it right.",
      "We may refuse service where a treatment is unsuitable, where a guest is abusive, or where health and safety would be put at risk.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms as the service evolves. Material changes will be highlighted on this page, and continued use of SalonBook means you accept the latest version.",
    ],
  },
]

export default function TermsPage() {
  return (
    <PublicShell>
      <div className="container-page max-w-3xl py-10 sm:py-14">
        <PageHeader
          title="Terms of Service"
          description="Last updated: January 2026. These terms apply to every SalonBook account and booking."
        />

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="surface-card p-5 sm:p-6">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <div className="mt-2 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Questions</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If anything here is unclear, contact us at{" "}
              <a href={`mailto:${SALON_INFO.email}`} className="font-medium text-primary">
                {SALON_INFO.email}
              </a>
              . We are happy to talk it through before you book.
            </p>
          </section>
        </div>
      </div>
    </PublicShell>
  )
}
