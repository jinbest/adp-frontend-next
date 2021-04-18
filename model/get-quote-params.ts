type repairsProps = {
  appointment_id: number
  cost: number
  duration: string
  product_id: number
  product_name: string
  repair_id: number
  repair_name: string
  warranty: number | string | null
  warranty_unit: string | null
}

export interface GetQuotesParams {
  booking_date: string | null
  created_by: string
  created_date: string | null
  customer_address_1: string | null
  customer_address_2: string | null
  customer_city: string | null
  customer_contact_method: string
  customer_country: string | null
  customer_email: string
  customer_first_name: string
  customer_id: number
  customer_last_name: string
  customer_note: string | null
  customer_phone: string | null
  customer_postcode: string | number | null
  customer_state: string | null
  deleted_by: string | null
  deleted_date: string | null
  delivery_cost: number
  delivery_method: string
  end_date: string | null
  id: number
  is_voided: boolean
  location_id: number
  modified_by: string
  modified_date: string | null
  repairs: repairsProps[]
  selected_date: string | null
  selected_end_time: string | null
  selected_start_time: string | null
  start_date: string | null
  status: string
  store_id: number
  type: string
}
