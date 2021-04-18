import { AppointmentRepair } from "./appointment-repair"
import { Customer } from "./customer"
import { DeliveryMethod } from "./delivery-method"

export interface NewAppointments {
  id: number
  store_id: number
  location_id: number
  customer: Customer
  booking_date: string
  start_date: string
  end_date: string
  title: string
  status: string
  is_voided: boolean
  customer_note: string
  contact_method: string
  delivery_method: DeliveryMethod
  appointment_repairs: AppointmentRepair[]
  created_by: string
  created_date: string
  modified_by: string
  modified_date: string
  deleted_by: string
  deleted_date: string
  date: string
  selected_date?: string
  selected_start_time?: string
  selected_end_time?: string
}
