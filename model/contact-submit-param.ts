export interface ContactSubmitParams {
  store_id: number
  location_id: number
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone?: string
  customer_note: string
  is_read: boolean
  company_name?: string | null
}
