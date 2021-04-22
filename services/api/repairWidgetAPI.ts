import Config from "../../config/config"
import { PostAppointParams } from "../../model/post-appointment-params"
import ApiClient from "../api-client"
import { GetManyResponse } from "../../model/get-many-response"

const apiClient = ApiClient.getInstance()
class RepairWidgetAPI {

  getDeviceBrands = async (
    store_id: number,
    per_page: number,
    page: number,
    is_enabled: boolean,
    searchText: string
  ) => {
    let apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/brands?per_page=${per_page}&page=${page}&is_enabled=${is_enabled}&has_products=true&include_voided=false&display_sort_order=asc`
    if (searchText) {
      apiURL += `&name=${searchText}`
    }    
    return await apiClient.get<GetManyResponse>(apiURL)
  }

  getBrandProducts = async (
    store_id: number,
    per_page: number,
    page: number,
    included_voided: boolean,
    brand_id: number,
    searchText: string
  ) => {
    let apiURL = `${Config.PRODUCT_SERVICE_API_URL}dc/store/${store_id}/products?per_page=${per_page}&page=${page}&include_voided=${included_voided}&brand_id=${brand_id}&status=PUBLISHED&display_sort_order=asc`
    if (searchText) {
      apiURL += `&name=${searchText}`
    }
    return await apiClient.get<GetManyResponse>(apiURL)
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

  postAppointmentQuote = async (data: PostAppointParams) => {
    const apiURL = `${Config.REPAIR_SERVICE_API_URL}dc/store/${data.store_id}/repair/location/${data.location_id}/appointment`
    return await apiClient.post(apiURL, data)
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
}

const instance = new RepairWidgetAPI()

export default instance
