import { Base } from "./base"

export interface StoreToggle extends Base {
  feature_id: string
  store_id: number
  is_enabled: boolean
}
