type dayProps = {
  store_id: number
  wkDys: string[]
}

type hourProps = {
  store_id: number
  hrs: string[]
}

type locHourProps = {
  day: string
  open: string | null
  close: string | null
}

export interface GetCurrentLocParams {
  address_1?: string
  address_2?: string
  address_3?: string
  days?: dayProps[]
  distance?: string
  hours?: hourProps[]
  loc_hours?: locHourProps[]
  location_id: number
  location_name: string
  latitude?: number
  longitude?: number
  business_page_link?: string | null
  timezone: string
}
