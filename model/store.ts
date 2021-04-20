import { Base } from "./base"
import { StoreLocation } from "./store-location"

export interface Store extends Base {
  id: number
  name: string
  business_name: string
  email: string
  phone: string
  domain: string
  tenant_id: string
  locations?: StoreLocation[]
  settings: StoreSetting
  is_voided: boolean
  slogan: string | null
}

export interface StoreSetting {
  store_id: number
  display_repair_cost: boolean
  send_quote_email: boolean
  send_appointment_email: boolean
}
