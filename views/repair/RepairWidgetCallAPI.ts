import { repairWidgetAPI } from "../../services/"
import { repairWidData, repairWidgetStore, storesDetails } from "../../store/"
import { setQuotesStore } from "../../services/helper"
import _ from "lodash"
import { GetProductsParam } from "../../model/get-products-params"
import { GetBrandsParam } from "../../model/get-brands-params"

function getRepairLookupAPI() {
  const lookupTypes: any[] = ["repair_delivery_method", "repair_contact_method", "warranty_unit"]
  const locale: string =
    typeof window !== "undefined" &&
    window.localStorage !== null &&
    typeof window.localStorage !== "undefined"
      ? window.localStorage.getItem("cntLang") || "en"
      : "en"

  repairWidgetAPI
    .getRepairLookup(locale, lookupTypes)
    .then((res: any) => {
      repairWidData.changeRepairWidgetLookup(res)

      /* repair_delivery_method */
      const repair_types: any[] = []
      for (let i = 0; i < res.repair_delivery_method.length; i++) {
        repair_types.push({
          name: res.repair_delivery_method[i].code_text,
          code: res.repair_delivery_method[i].code,
          bg: "white",
          col: "black",
          selected: false,
        })
      }
      const apiDropOffDevices: any = {
        title: "HOW_WOULD_YOU_LIKE_TO_DROP_YOUR_DEVICE",
        types: repair_types,
      }
      repairWidData.changeApiDropOffDevices(apiDropOffDevices)

      /* repair_receive_quote_method */
      const repair_contact_types: any[] = []
      for (let i = 0; i < res.repair_contact_method.length; i++) {
        repair_contact_types.push({
          name: res.repair_contact_method[i].code_text,
          code: res.repair_contact_method[i].code,
          bg: "white",
          col: "black",
          selected: false,
        })
      }
      const receiveQuote: any = {
        title: "HOW_WOULD_YOU_LIKE_TO_RECEIVE_YOUR_QUOTE",
        types: repair_contact_types,
      }
      repairWidData.changeReceiveQuote(receiveQuote)
    })
    .catch((error) => {
      console.log("Error in get service-widget Lookup", error)
    })
}

function getDeliveryMethodsAPI() {
  const store_id: number = storesDetails.store_id
  const include_disabled = false

  repairWidgetAPI
    .getDeliveryMethods(store_id, include_disabled)
    .then((res: any) => {
      repairWidData.changeRepairWidDeliveryMethod(res)
    })
    .catch((error) => {
      console.log("Error in get Repair Delivery Method", error)
    })
}

function getContactMethodsAPI() {
  const store_id: number = storesDetails.store_id

  repairWidgetAPI
    .getContactMethods(store_id)
    .then((res: any) => {
      repairWidData.changeRepairContactMethod(res)
    })
    .catch((error) => {
      console.log("Error in get Repair Contact Method", error)
    })
}

function getCategoriesAPI() {
  const store_id: number = storesDetails.store_id

  repairWidgetAPI
    .getCategories(store_id)
    .then((res: any) => {
      repairWidData.changeCategories(res.data)
    })
    .catch((error) => {
      console.log("Error in get Categories", error)
    })
}

async function getDeviceBrandsAPI(val: GetBrandsParam) {
  const store_id: number = storesDetails.store_id

  const param: GetBrandsParam = {
    per_page: val.per_page,
    page: val.page,
    is_enabled: true,
    name: val.name,
    category_id: val.category_id,
  }

  await repairWidgetAPI
    .getDeviceBrands(store_id, param)
    .then(async (res: any) => {
      repairWidData.changeRepairDeviceBrands(res)
    })
    .catch((error) => {
      console.log("Error in get Repair Device Brands", error)
    })
}

async function addMoreDeviceBrandsAPI(val: GetBrandsParam) {
  const store_id: number = storesDetails.store_id

  const param: GetBrandsParam = {
    per_page: val.per_page,
    page: val.page,
    name: val.name,
    category_id: val.category_id,
    is_enabled: true,
  }

  await repairWidgetAPI
    .getDeviceBrands(store_id, param)
    .then(async (res: any) => {
      const cntDeviceBrands = _.cloneDeep(repairWidData.repairDeviceBrands)
      for (let i = 0; i < res.data.length; i++) {
        cntDeviceBrands.data.push(res.data[i])
      }
      repairWidData.changeRepairDeviceBrands(cntDeviceBrands)
    })
    .catch((error) => {
      console.log("Error in add more Repair Device Brands", error)
    })
}

async function getBrandProductsAPI(val: GetProductsParam) {
  const store_id = storesDetails.store_id

  const param: GetProductsParam = {
    per_page: val.per_page,
    page: val.page,
    include_voided: false,
    brand_id: val.brand_id,
    name: val.name,
    category_id: val.category_id,
  }

  await repairWidgetAPI
    .getBrandProducts(store_id, param)
    .then(async (res: any) => {
      repairWidData.changeRepairBrandProducts(res)
    })
    .catch((error) => {
      console.log("Error in get Repair Brand Products", error)
    })
}

async function addMoreBrandProductsAPI(val: GetProductsParam) {
  const store_id: number = storesDetails.store_id

  const param: GetProductsParam = {
    per_page: val.per_page,
    page: val.page,
    include_voided: false,
    brand_id: val.brand_id,
    name: val.name,
    category_id: val.category_id,
  }

  await repairWidgetAPI
    .getBrandProducts(store_id, param)
    .then(async (res: any) => {
      const cntDeviceProducts = _.cloneDeep(repairWidData.repairBrandProducts)
      for (let i = 0; i < res.data.length; i++) {
        cntDeviceProducts.data.push(res.data[i])
      }
      repairWidData.changeRepairBrandProducts(cntDeviceProducts)
    })
    .catch((error) => {
      console.log("Error in add more Repair Brand Products", error)
    })
}

async function getRepairsOfferedDeviceAPI(
  product_id: number,
  text: string,
  page: number,
  per_page: number
) {
  const locale: string =
    typeof window !== "undefined" &&
    window.localStorage !== null &&
    typeof window.localStorage !== "undefined"
      ? window.localStorage.getItem("cntLang") || "en"
      : "en"
  const store_id: number = storesDetails.store_id
  const included_voided = false
  const is_active = true
  // const include_cost = storesDetails.storesDetails.settings.display_repair_cost
  const include_cost = true

  await repairWidgetAPI
    .getRepairsOfferedDevice(
      locale,
      store_id,
      per_page,
      page,
      included_voided,
      product_id,
      is_active,
      include_cost,
      text
    )
    .then(async (res: any) => {
      repairWidData.changeRepairsOfferedDevice(res)
    })
    .catch((error) => {
      console.log("Error in get Repair Offered Device", error)
    })
}

async function addMoreRepairsOfferedDeviceAPI(
  product_id: number,
  text: string,
  page: number,
  per_page: number
) {
  const locale: string =
    typeof window !== "undefined" &&
    window.localStorage !== null &&
    typeof window.localStorage !== "undefined"
      ? window.localStorage.getItem("cntLang") || "en"
      : "en"
  const store_id: number = storesDetails.store_id
  const included_voided = false
  const is_active = true
  // const include_cost = storesDetails.storesDetails.settings.display_repair_cost
  const include_cost = true

  await repairWidgetAPI
    .getRepairsOfferedDevice(
      locale,
      store_id,
      per_page,
      page,
      included_voided,
      product_id,
      is_active,
      include_cost,
      text
    )
    .then(async (res: any) => {
      const cntOfferedRepairs = _.cloneDeep(repairWidData.repairsOfferedDevices)
      for (let i = 0; i < res.data.length; i++) {
        cntOfferedRepairs.data.push(res.data[i])
      }
      repairWidData.changeRepairsOfferedDevice(cntOfferedRepairs)
    })
    .catch((error) => {
      console.log("Error in add more Repair Offered Device", error)
    })
}

async function getQuotesByLocAppointmentID(location_id: number, appointment_id: number) {
  const store_id: number = storesDetails.store_id

  await repairWidgetAPI
    .getQuotesByID(store_id, location_id, appointment_id)
    .then(async (res: any) => {
      repairWidgetStore.changeQuote(res)
      await setQuotesStore(res)
    })
    .catch((error) => {
      console.log("Error in get Quotes", error)
    })
}

export {
  getRepairLookupAPI,
  getDeliveryMethodsAPI,
  getRepairsOfferedDeviceAPI,
  addMoreRepairsOfferedDeviceAPI,
  getDeviceBrandsAPI,
  addMoreDeviceBrandsAPI,
  getBrandProductsAPI,
  addMoreBrandProductsAPI,
  getContactMethodsAPI,
  getQuotesByLocAppointmentID,
  getCategoriesAPI,
}
