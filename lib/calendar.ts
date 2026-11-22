import { SALON_INFO } from "@/lib/constants"
import type { Appointment } from "@/lib/types"

const TIME_PATTERN = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i

function parseAppointmentStart(appointment: Appointment): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(appointment.appointmentDate)
  const timeMatch = TIME_PATTERN.exec(appointment.timeSlot.trim())
  if (!dateMatch || !timeMatch) return null

  const [, year, month, day] = dateMatch.map(Number)
  let hours = Number(timeMatch[1]) % 12
  const minutes = Number(timeMatch[2])
  if (timeMatch[3].toUpperCase() === "PM") hours += 12

  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

function toUtcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}

/** Build a single-event iCalendar file for a confirmed appointment. */
export function buildAppointmentIcs(appointment: Appointment) {
  const start = parseAppointmentStart(appointment)
  if (!start) return null

  const durationMinutes = appointment.service?.duration || 60
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const serviceName = appointment.service?.serviceName ?? "Salon appointment"

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SalonBook//Appointments//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:salonbook-${appointment.id}@salonbook.app`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeText(`${serviceName} at ${SALON_INFO.name}`)}`,
    `LOCATION:${escapeText(SALON_INFO.address)}`,
    `DESCRIPTION:${escapeText(
      [
        `Appointment: ${serviceName}`,
        `Reference: ${appointment.id}`,
        `Status: ${appointment.status}`,
        appointment.message ? `Notes: ${appointment.message}` : "",
        `Questions? Call ${SALON_INFO.phone}.`,
      ]
        .filter(Boolean)
        .join("\n")
    )}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`${serviceName} in 2 hours`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return lines.join("\r\n")
}

export function downloadAppointmentIcs(appointment: Appointment) {
  const ics = buildAppointmentIcs(appointment)
  if (!ics) return false

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `salonbook-${appointment.appointmentDate}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return true
}
