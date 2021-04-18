export interface Discount {
  id: number
  repair_id: number
  discount: number
  discount_unit: string
  start_date: string
  end_date: string
  is_voided: boolean
  created_by: string
  created_date: string
  modified_by: string
  modified_date: string
  deleted_by: string
  deleted_date: string
}
