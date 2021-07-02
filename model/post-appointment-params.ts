// export interface AppointmentParams {
//   store_id: number
//   location_id: number
//   customer_id: number
//   type: string
//   is_voided: boolean
//   delivery_method: string
//   customer_email: string
//   customer_first_name: string
//   customer_last_name: string
//   customer_phone: string
//   customer_address_1: string
//   customer_address_2: string
//   customer_city: string
//   customer_state: string
//   customer_postcode: string
//   customer_country: string
//   customer_note: string | null
//   customer_contact_method: string
//   customer_timezone: string | null
//   repairs: AppointmentRepair[]
//   booking_date: string
//   selected_date: string
//   selected_start_time: string | null
//   selected_end_time: string | null
//   converted?: boolean
//   id?: number
// }

export interface AppointmentParams {
  id?: number
  customer_id?: number
  store_id: number
  location_id: number
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone?: string
  customer_address_1?: string
  customer_address_2?: string
  customer_city?: string
  customer_state?: string
  customer_postcode?: string
  customer_country?: string
  customer_note?: string | null
  customer_contact_method: string
  booking_date?: string
  start_date?: string
  end_date?: string
  selected_date?: string
  selected_start_time?: string
  selected_end_time?: string
  type: string
  status: string
  delivery_method: string
  delivery_cost?: number
  is_voided: boolean
  created_by: string
  created_date: string
  modified_by: string | null
  modified_date: string | null
  deleted_by: string | null
  deleted_date: string | null
  repairs?: AppointmentRepair[]
  customer_timezone?: string | null
  converted?: boolean
  quote_status: string
}

export interface AppointmentRepair {
  product_name: string
  repair_name: string
  appointment_id?: number
  repair_id: number
  product_id: number
  cost?: number
  duration: string
  warranty?: number
  warranty_unit?: string
}
