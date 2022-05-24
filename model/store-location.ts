import { Base } from "./base"

export interface StoreLocation extends Base {
  id?: number
  store_id: number
  location_name: string
  description?: string
  email: string
  phone: string
  address_1: string
  address_2?: string
  address_3?: string
  city: string
  state: string
  postcode: string
  country: string
  longitude: number
  latitude: number
  is_voided: boolean
  is_main: boolean
  distance?: number
  timezone?: string
  business_page_link?: string | null
  location_hours?: LocationHour[]
  phoneFormat?: number
}

export interface LocationHour extends Base {
  id?: number
  store_id?: number
  location_id?: number
  day: number
  open?: string | null
  close?: string | null
  type: string
  by_appointment_only: boolean
  is_voided: boolean
}
