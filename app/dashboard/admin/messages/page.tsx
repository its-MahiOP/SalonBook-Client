"use client"

import * as React from "react"
import { CheckCheck, Mail, MailOpen, MessageSquareText } from "lucide-react"
import { toast } from "sonner"

import { apiFetch, ApiError } from "@/lib/api"
import { useApiData } from "@/lib/hooks/use-api-data"
import type { ApiResponse } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { PageHeader, EmptyState } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/loader"

type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminMessagesPage() {
  const { data, loading, error, reload } = useApiData<ApiResponse<ContactMessage[]>>(
    "/api/contact"
  )
  const messages = data?.data ?? []
  const unread = messages.filter((message) => !message.read).length
  const [markingId, setMarkingId] = React.useState<string | null>(null)

  async function markRead(message: ContactMessage) {
    setMarkingId(message.id)
    try {
      await apiFetch(`/api/contact/${message.id}/read`, { method: "PATCH" })
      reload()
    } catch (markError) {
      toast.error(
        markError instanceof ApiError ? markError.message : "Could not update the message"
      )
    } finally {
      setMarkingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Enquiries sent through the public contact form."
        action={
          messages.length > 0 ? (
            <Badge variant={unread > 0 ? "brand" : "neutral"} dot>
              {unread > 0 ? `${unread} new` : "All reviewed"}
            </Badge>
          ) : null
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="surface-card space-y-3 p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="surface-card border-destructive/30 p-5 text-sm text-destructive">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No messages yet"
          description="When a guest uses the contact form, their enquiry will appear here."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {message.read ? (
                      <MailOpen className="size-4" />
                    ) : (
                      <Mail className="size-4" />
                    )}
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold">{message.subject}</h2>
                    <p className="text-xs text-muted-foreground">
                      {message.name} ·{" "}
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(
                          `Re: ${message.subject}`
                        )}`}
                        className="text-primary hover:underline"
                      >
                        {message.email}
                      </a>
                      {message.phone ? ` · ${message.phone}` : ""}
                    </p>
                  </div>
                </div>
                <time className="text-[11px] text-muted-foreground">
                  {formatDate(message.createdAt)}
                </time>
              </div>
              <p className="mt-3 border-t border-border/60 pt-3 text-sm leading-relaxed text-muted-foreground">
                {message.message}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    `Re: ${message.subject}`
                  )}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Reply by email
                </a>
                {message.read ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CheckCheck className="size-3.5" /> Reviewed
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-[11px]"
                    disabled={markingId === message.id}
                    onClick={() => markRead(message)}
                  >
                    <CheckCheck className="size-3.5" /> Mark as read
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
