import type { Metadata } from "next"

import { PublicShell } from "@/components/layout/public-shell"
import { PageHeader } from "@/components/ui/section"
import { SALON_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SalonBook collects, uses and protects your personal information when you book salon services.",
}

const sections = [
  {
    title: "Information we collect",
    body: [
      "When you create an account we collect your name, email address and, if you provide them, a profile photo and phone number. When you book an appointment we store the service, date, time and any notes you add.",
      "Payment card details are entered directly with Stripe. SalonBook never receives or stores your full card number.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "We use your details to create and manage your account, confirm and deliver appointments, send booking updates, and keep a record of payments for your receipts.",
      "With your consent we may send occasional offers. You can opt out at any time by replying to any message or contacting us.",
    ],
  },
  {
    title: "Who can see your information",
    body: [
      "Salon staff can see the details needed to deliver your appointment, such as your name, contact number and booking history. Administrators can view and manage accounts, including blocking accounts that breach these terms.",
      "We share payment information with Stripe as our payment processor. We do not sell your personal information to anyone.",
    ],
  },
  {
    title: "Keeping your data safe",
    body: [
      "Passwords are hashed and never stored in plain text. Access to the salon dashboard requires an authenticated session, and every protected API request is verified on the server before data is returned.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can update your name, phone number and photo from your profile at any time. To close your account or request a copy of your data, contact us using the details below and we will respond within 30 days.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <PublicShell>
      <div className="container-page max-w-3xl py-10 sm:py-14">
        <PageHeader
          title="Privacy Policy"
          description="Last updated: January 2026. This policy explains what SalonBook collects and why."
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
            <h2 className="text-lg font-semibold">Contact us</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Questions about this policy? Email{" "}
              <a href={`mailto:${SALON_INFO.email}`} className="font-medium text-primary">
                {SALON_INFO.email}
              </a>{" "}
              or write to {SALON_INFO.address}.
            </p>
          </section>
        </div>
      </div>
    </PublicShell>
  )
}
