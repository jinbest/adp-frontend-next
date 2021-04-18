type dayProps = {
  store_id: number
  wkDys: string[]
}

type hourProps = {
  store_id: number
  hrs: string[]
}

export interface GetCurrentLocParams {
  address_1?: string
  address_2?: string
  address_3?: string
  days?: dayProps[]
  distance?: string
  hours?: hourProps[]
  location_id: number
  location_name: string
  latitude?: number
  longitude?: number
  business_page_link?: string | null
  timezone?: string
}
