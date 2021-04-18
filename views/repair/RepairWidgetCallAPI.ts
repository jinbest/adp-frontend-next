import { repairWidgetAPI } from "../../services/"
import { repairWidData, storesDetails } from "../../store/"
import { setQuotesStore } from "../../services/helper"

function getRepairLookupAPI() {
  const lookupTypes: any[] = ["repair_delivery_method", "repair_contact_method", "warranty_unit"]
  // const locale: string = window.localStorage.getItem("cntLang") || "en"
  const locale = "en"

  repairWidgetAPI
    .getRepairLookup(locale, lookupTypes)
    .then((res: any) => {
      repairWidData.changeRepairWidgetLookup(res.data)

      /* repair_delivery_method */
      const repair_types: any[] = []
      for (let i = 0; i < res.data.repair_delivery_method.length; i++) {
        repair_types.push({
          name: res.data.repair_delivery_method[i].code_text,
          code: res.data.repair_delivery_method[i].code,
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
      for (let i = 0; i < res.data.repair_contact_method.length; i++) {
        repair_contact_types.push({
          name: res.data.repair_contact_method[i].code_text,
          code: res.data.repair_contact_method[i].code,
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
      repairWidData.changeRepairWidDeliveryMethod(res.data)
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
      repairWidData.changeRepairContactMethod(res.data)
    })
    .catch((error) => {
      console.log("Error in get Repair Contact Method", error)
    })
}

async function getDeviceBrandsAPI(searchText: string, page: number, per_page: number) {
  const store_id: number = storesDetails.store_id
  const is_enabled = true

  await repairWidgetAPI
    .getDeviceBrands(store_id, per_page, page, is_enabled, searchText)
    .then(async (res: any) => {
      repairWidData.changeRepairDeviceBrands(res.data)
    })
    .catch((error) => {
      console.log("Error in get Repair Device Brands", error)
    })
}

async function addMoreDeviceBrandsAPI(searchText: string, page: number, per_page: number) {
  const store_id: number = storesDetails.store_id
  const is_enabled = true

  await repairWidgetAPI
    .getDeviceBrands(store_id, per_page, page, is_enabled, searchText)
    .then(async (res: any) => {
      const cntDeviceBrands = repairWidData.repairDeviceBrands
      for (let i = 0; i < res.data.data.length; i++) {
        cntDeviceBrands.data.push(res.data.data[i])
      }
      repairWidData.changeRepairDeviceBrands(cntDeviceBrands)
    })
    .catch((error) => {
      console.log("Error in add more Repair Device Brands", error)
    })
}

async function getBrandProductsAPI(
  brand_id: number,
  searchText: string,
  page: number,
  per_page: number
) {
  const store_id: number = storesDetails.store_id
  const included_voided = false

  await repairWidgetAPI
    .getBrandProducts(store_id, per_page, page, included_voided, brand_id, searchText)
    .then(async (res: any) => {
      repairWidData.changeRepairBrandProducts(res.data)
    })
    .catch((error) => {
      console.log("Error in get Repair Brand Products", error)
    })
}

async function addMoreBrandProductsAPI(
  brand_id: number,
  searchText: string,
  page: number,
  per_page: number
) {
  const store_id: number = storesDetails.store_id
  const included_voided = false

  await repairWidgetAPI
    .getBrandProducts(store_id, per_page, page, included_voided, brand_id, searchText)
    .then(async (res: any) => {
      const cntDeviceProducts = repairWidData.repairBrandProducts
      for (let i = 0; i < res.data.data.length; i++) {
        cntDeviceProducts.data.push(res.data.data[i])
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
  // const locale: string = window.localStorage.getItem("cntLang") || "en"
  const locale = "en"
  const store_id: number = storesDetails.store_id
  const included_voided = false
  const is_active = true
  const include_cost = storesDetails.storesDetails.settings.display_repair_cost

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
      repairWidData.changeRepairsOfferedDevice(res.data)
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
  // const locale: string = window.localStorage.getItem("cntLang") || "en"
  const locale = "en"
  const store_id: number = storesDetails.store_id
  const included_voided = false
  const is_active = true
  const include_cost = storesDetails.storesDetails.settings.display_repair_cost

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
      const cntOfferedRepairs = repairWidData.repairsOfferedDevices
      for (let i = 0; i < res.data.data.length; i++) {
        cntOfferedRepairs.data.push(res.data.data[i])
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
      await setQuotesStore(res.data)
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
}
