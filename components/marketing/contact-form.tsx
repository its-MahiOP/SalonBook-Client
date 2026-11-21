"use client"

import * as React from "react"
import { Mail, Send } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea, FieldError } from "@/components/ui/form-controls"
import { Spinner } from "@/components/ui/loader"

const subjects = [
  "General enquiry",
  "Booking help",
  "Service question",
  "Feedback",
  "Something else",
]

export function ContactForm() {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (values.name.trim().length < 2) nextErrors.name = "Please tell us your name"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address"
    }
    if (values.message.trim().length < 10) {
      nextErrors.message = "Please add a little more detail (at least 10 characters)"
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    try {
      await apiFetch("/api/contact", {
        method: "POST",
        auth: false,
        body: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          subject: values.subject,
          message: values.message.trim(),
        },
      })
      setSent(true)
      setValues({ name: "", email: "", phone: "", subject: subjects[0], message: "" })
      toast.success("Message sent — we will reply within one business day")
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not send your message. Please try again."
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Send us a message</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Questions about a service or an existing booking? We usually reply the same day.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contactName" required>
            Your name
          </Label>
          <Input
            id="contactName"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="contactEmail" required>
            Email address
          </Label>
          <Input
            id="contactEmail"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="contactPhone">Phone (optional)</Label>
          <Input
            id="contactPhone"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contactSubject">Subject</Label>
          <select
            id="contactSubject"
            value={values.subject}
            onChange={(event) => update("subject", event.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm shadow-xs outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="contactMessage" required>
            Message
          </Label>
          <Textarea
            id="contactMessage"
            rows={5}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder="Tell us what you need help with..."
            aria-invalid={Boolean(errors.message)}
          />
          <FieldError>{errors.message}</FieldError>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={sending} className="h-10 gap-2 px-4">
          {sending ? <Spinner /> : <Send className="size-4" />}
          {sending ? "Sending..." : "Send message"}
        </Button>
        {sent ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Mail className="size-3.5" /> Thanks — your message is with us.
          </span>
        ) : null}
      </div>
    </form>
  )
}
