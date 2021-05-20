import { Store } from "./store"
import { StoreLocation } from "./store-location"
import { StoreToggle } from "./store-toggle"

export interface GeneralData {
  storeConfig: Record<string, any>
  commonConfig: Record<string, any>
  storeDetails: Store
  locations: StoreLocation[]
  featureToggles: StoreToggle[]
}

export interface GeneralDataParams {
  toggleType?: string
}
