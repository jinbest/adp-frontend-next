export interface SelectParams {
  name: string
  code: string
}

export interface FilterParams {
  page?: number
  per_page?: number
  include_voided?: boolean
  display_sort_order?: string
}