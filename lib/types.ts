export type Role = "admin" | "customer"

export type SessionUser = {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
  isBlocked: boolean
  phone?: string | null
}

export type Service = {
  id: string
  serviceName: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: "active" | "inactive"
  /** Present when the API sorts by popularity. */
  bookings?: number
  createdAt: string
  updatedAt?: string
}

export type PopulatedCustomer = {
  id: string
  name: string
  email: string
  image?: string | null
  phone?: string | null
}

export type Appointment = {
  id: string
  serviceId: string
  customerId: string
  appointmentDate: string
  timeSlot: string
  message: string
  servicePrice: number
  paymentStatus: "unpaid" | "paid"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  service: Service
  customer: PopulatedCustomer
}

export type Transaction = {
  id: string
  appointmentId: string
  customerId: string
  amount: number
  currency: string
  stripeSessionId: string
  status: "paid" | "failed"
  createdAt: string
  customer: PopulatedCustomer
  appointment?: {
    id: string
    appointmentDate: string
    timeSlot: string
    status: string
  } | null
  service?: {
    id: string
    serviceName: string
    category: string
    price: number
  } | null
}

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
  total?: number
}

export type CustomerStats = {
  total: number
  pending: number
  confirmed: number
  cancelled: number
  paidAppointments: number
  totalSpent: number
  upcoming: Appointment[]
}

export type AdminStats = {
  totalCustomers: number
  activeServices: number
  totalAppointments: number
  pending: number
  confirmed: number
  cancelled: number
  totalSuccessfulPayments: number
  totalRevenue: number
  recentAppointments: Appointment[]
}

export type TimeSlot = {
  time: string
  available: boolean
}

export type ServiceCategory = {
  name: string
  count: number
}
