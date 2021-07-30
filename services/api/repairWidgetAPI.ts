import Config from "../../config/config"
import { AppointmentParams } from "../../model/post-appointment-params"
import ApiClient from "../api-client"
import { GetManyResponse } from "../../model/get-many-response"
import { FilterParams } from "../../model/select-dropdown-param"
import { GetProductsParam } from "../../model/get-products-params"
import { GetBrandsParam } from "../../model/get-brands-params"

const apiClient = ApiClient.getInstance()
class RepairWidgetAPI {
  getDeviceBrands = async (store_id: number, val: GetBrandsParam) => {
    const apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/brands`
    const params: GetBrandsParam = {
      per_page: val.per_page,
      page: val.page,
      is_enabled: val.is_enabled,
      has_products: true,
      include_voided: false,
      display_sort_order: "asc",
    }
    if (val.category_id && val.category_id > 0) {
      params.category_ids = [val.category_id]
    }
    if (val.name) {
      params.name = val.name
    }
    return await apiClient.get<GetManyResponse>(apiURL, params)
  }

  getBrandProducts = async (store_id: number, val: GetProductsParam) => {
    const apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/products`
    const params: GetProductsParam = {
      per_page: val.per_page,
      page: val.page,
      include_voided: val.include_voided,
      brand_id: val.brand_id,
      status: "PUBLISHED",
      display_sort_order: "asc",
    }
    if (val.name) {
      params.name = val.name
    }
    if (val.category_id && val.category_id > 0) {
      params.category_id = val.category_id
    }
    return await apiClient.get<GetManyResponse>(apiURL, params)
  }

  getRepairLookup = async (locale: string, types: any[]) => {
    let type = ""
    for (let i = 0; i < types.length; i++) {
      i === 0 ? (type += `types=${types[i]}`) : (type += `&types=${types[i]}`)
    }
    const apiURL = `${Config.TRANSLATION_SERVICE_API_URL}dc/translation/${locale}/repair/lookups?${type}`
    return await apiClient.get<any>(apiURL)
  }

  getDeliveryMethods = async (store_id: number, include_disabled: boolean) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/store/${store_id}/delivery_methods?include_disabled=${include_disabled}`
    return await apiClient.get<any>(apiURL)
  }

  getRepairsOfferedDevice = async (
    locale: string,
    store_id: number,
    per_page: number,
    page: number,
    included_voided: boolean,
    product_id: number,
    is_active: boolean,
    include_cost: boolean,
    text: string
  ) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/${locale}/store/${store_id}/repair?per_page=${per_page}&page=${page}&include_voided=${included_voided}&product_id=${product_id}&is_active=${is_active}&include_cost=${include_cost}&title=${text}&display_sort_order=asc`
    return await apiClient.get<GetManyResponse>(apiURL)
  }

  postAppointmentQuote = async (data: AppointmentParams) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/store/${data.store_id}/repair/location/${data.location_id}/appointment`
    return await apiClient.post(apiURL, data)
  }

  putUpdateQuote = async (data: AppointmentParams) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/store/${data.store_id}/repair/location/${data.location_id}/appointment`
    return await apiClient.put(apiURL, data)
  }

  getContactMethods = async (store_id: number) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/store/${store_id}/contact_methods`
    return await apiClient.get<any>(apiURL)
  }

  getQuotesByID = async (store_id: number, loc_id: number, quote_id: number) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/store/${store_id}/repair/location/${loc_id}/appointment/${quote_id}`
    return await apiClient.get<any>(apiURL)
  }

  getBrandsProducts = async (store_id: number, prod_ids: number[]) => {
    let prodsID = ""
    for (let i = 0; i < prod_ids.length - 1; i++) {
      prodsID += prod_ids[i] + ","
    }
    prodsID += prod_ids[prod_ids.length - 1]
    const apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/products?product_ids=${prodsID}&include_voided=false&include_children=true&status=PUBLISHED&display_sort_order=asc`
    return await apiClient.get<any>(apiURL)
  }

  filterCategories = async (store_id: number, params: FilterParams) => {
    const apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/categories`
    return await apiClient.get<any>(apiURL, params)
  }

  getCategories = async (store_id: number) => {
    const apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/categories`
    return await apiClient.get<any>(apiURL)
  }
}

const instance = new RepairWidgetAPI()

export default instance
