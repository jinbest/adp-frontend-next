export interface GetBrandsParam {
  page?: number
  per_page?: number
  brand_id?: number
  name?: string
  other_name?: string
  slug?: string
  status?: string
  sku?: string
  min_created_date?: string
  max_created_date?: string
  is_enabled?:boolean
  include_voided?: boolean
  include_children?: boolean
  requires_shipping?: boolean
  created_date_sort_order?: string
  name_sort_order?: string
  category_id?: number
  product_ids?: number[]
  brand_name?: string
  category?: string
  display_sort_order?: string
  has_products?: boolean
  category_ids?: number[]
}
