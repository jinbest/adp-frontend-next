import { GetCurrentLocParams } from "../model/get-current-location"
import { useLocation } from "react-router-dom"
import { GetQuotesParams } from "../model/get-quote-params"
import { repairWidgetStore, storesDetails, repairWidData } from "../store"
import { repairWidgetAPI } from "./"
import { GetAddressFormat } from "../model/get-address-format"
import _ from "lodash"

interface LocationHour {
  close: string
  created_by: string
  created_date: string
  day: number
  deleted_by: string | null
  deleted_date: string | null
  id: number
  is_voided: boolean
  location_id: number
  modified_by: string | null
  modified_date: string | null
  open: string
  store_id: boolean
  type: "REGULAR" | "HOLIDAY"
  by_appointment_only: boolean
}

export function getRegularHours(hours: any[]) {
  return hours
    .map((v) => v as LocationHour)
    .filter((p) => {
      return p.type == "REGULAR"
    })
    .sort((d) => d.day)
}

// export function RevertTimeTZ(time: string, timezone: string | undefined) {
//   if (!time) return null
//   const tz = ConvertTZToNum(timezone),
//     cntTzOfset = -(new Date().getTimezoneOffset() / 60)
//   const stamp = (
//       Number(time.split(":")[0]) + (tz - cntTzOfset) > 0 ? 
//         Number(time.split(":")[0]) + (tz - cntTzOfset) : 
//         Number(time.split(":")[0]) + (tz - cntTzOfset + 24)
//     ) * 60 + Number(time.split(":")[1])
//   const hour = Math.floor(stamp/60), min = stamp % 60 > 9 ? (stamp % 60).toString() : "0" + stamp % 60
//   return hour + ":" + min
// }

// export function getHourType(hourStr: string, timezone: string) {
//   if (!hourStr) return "12:00 a.m"
//   const tz = ConvertTZToNum(timezone),
//     cntTzOfset = -(new Date().getTimezoneOffset() / 60)
//   const ptr = hourStr.split(":")
//   let hour = 12, minute = "00", stamp = 0
//   let AP = "a.m."
//   stamp = (Number(ptr[0]) + (cntTzOfset-tz)) * 60 + Number(ptr[1])
//   hour = Math.floor(stamp / 60)
//   if (hour >= 36) {
//     AP = "p.m."
//   } else if (hour >= 24) {
//     AP = "a.m."
//   } else if (hour >= 12) {
//     AP = "p.m."
//   } else {
//     AP = "a.m."
//   }
//   minute = stamp % 60 > 9 ? (stamp % 60).toString() : "0" + stamp % 60
//   return `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${AP}`
// }

export function getHourType(hourStr: string) {
  if (!hourStr) return "12:00 a.m"
  const ptr = hourStr.split(":")
  let hour = 12, minute = "00", AP = "a.m."
  if (ptr.length > 0) {
    hour = parseInt(ptr[0])
    if (hour >= 12) {
      AP = "p.m."
    } else {
      AP = "a.m."
    }
  }
  if (ptr.length > 1) {
    minute = ptr[1]
  }
  return `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${AP}`
}

export function getAddress(location: any) {
  if (!location) return ""
  return `${location.address_1}, ${location.address_2 ? location.address_2 + ", " : ""}${
    location.city ? location.city + ", " : ""
  } ${location.state ? location.state + " " : ""} ${
    location.postcode
      ? location.postcode.substring(0, 3) +
        " " +
        location.postcode.substring(3, location.postcode.length)
      : ""
  }`
}

// export function ConvertTZToNum(val: string | undefined) {
//   if (!val) return 0
//   const prev = val[0],
//     ptrs = val.substring(1).split(":")
//   let result = 0
//   if (prev === "-") {
//     result = -(Number(ptrs[0]) + Number(ptrs[1]) / 60)
//   } else {
//     result = -(Number(ptrs[0]) + Number(ptrs[1]) / 60)
//   }
//   return result
// }

export function makeLocations(data: any[]) {
  const locations: GetCurrentLocParams[] = []
  const days: any[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  for (let i = 0; i < data.length; i++) {
    const hours: any[] = [],
      weekDays: any[] = [],
      storeGroup: any[] = []
    const cntLocationHours = _.sortBy(data[i].location_hours, o => o.day)
    for (let j = 0; j < cntLocationHours.length; j++) {
      if (cntLocationHours[j].type === "REGULAR") {
        const cntStoreID = cntLocationHours[j].store_id
        if (!storeGroup.includes(cntStoreID)) {
          storeGroup.push(cntStoreID)
          hours.push({ store_id: cntStoreID, hrs: [] })
          weekDays.push({ store_id: cntStoreID, wkDys: [] })
        }
        let hour = ""
        if (!cntLocationHours[j].open || !cntLocationHours[j].close) {
          hour = "Closed"
        } else {
          const open = getHourType(cntLocationHours[j].open), 
            close = getHourType(cntLocationHours[j].close)
          hour = open + " - " + close
        }
        for (let k = 0; k < hours.length; k++) {
          if (cntStoreID === hours[k].store_id) {
            hours[k].hrs.push(hour)
            weekDays[k].wkDys.push(days[cntLocationHours[j].day])
            break
          }
        }
      }
    }
    const cntItem: GetCurrentLocParams = {
      location_name: data[i].location_name,
      address_1: data[i].address_1,
      address_2: data[i].address_2,
      address_3: data[i].address_3,
      distance: data[i].distance ? (data[i].distance / 1000).toFixed(1) + "km" : "",
      location_id: data[i].id,
      hours: hours,
      days: weekDays,
      latitude: data[i].latitude,
      longitude: data[i].longitude,
      business_page_link: data[i].business_page_link,
      timezone: data[i].timezone
    }
    locations.push(cntItem)
  }
  return locations
}

export function availableTimeRange(min: number, max: number, intv: number, mut: number) {
  if (min === max) return ["Closed"]
  const timeRange: any[] = []
  let cntMin = min
  while (1) {
    timeRange.push(cntMin * mut)
    cntMin = cntMin + intv
    if (cntMin > max) {
      break
    }
  }
  return timeRange
}

export function isWeek(selyear: number, selmonth: number, selday: number) {
  return new Date(selyear, selmonth, selday).getDay()
}

export function RevertDateTime(date:string, time: string | null, timezone: string | undefined) {
  if (timezone && date && time) {
    const moment = require("moment-timezone")

    const year = Number(date.split("-")[0]), 
      month = Number(date.split("-")[1]) - 1, 
      day = Number(date.split("-")[2]),
      hr = Number(time.split(":")[0]),
      min = Number(time.split(":")[1])

    const cntTimeStamp = new Date(year, month, day, hr, min).getTime()
    const revertDate = moment.tz(cntTimeStamp, timezone).format("YYYY-MM-DD"),
      revertTime = moment.tz(cntTimeStamp, timezone).format("HH:mm")
      
    return {
      date: revertDate,
      time: revertTime
    }
  }
  return {
    date: date,
    time: time
  }
}

export function Customer_timezone() {
  const moment = require("moment-timezone")
  const tzName = moment.tz.guess(moment())
  return tzName

  /*
  const timezoneOffset = new Date().getTimezoneOffset(),
    offsetHr = Math.floor(Math.abs(timezoneOffset) / 60), 
    offsetMin = Math.abs(timezoneOffset) % 60
  let customer_timezone = ""
  if (timezoneOffset > 0) {
    customer_timezone += "-"
  }
  if (offsetHr < 10) {
    customer_timezone += `0${offsetHr}:`
  } else {
    customer_timezone += `${offsetHr}:`
  }
  if (offsetMin < 10) {
    customer_timezone += `0${offsetMin}`
  } else {
    customer_timezone += offsetMin
  }
  return customer_timezone
  */
}

export function isPast(
  selyear: number,
  selmonth: number,
  selday: number,
  // seloff: number,
  hrs: number,
  mins: number
) {
  // const timeoffset = -new Date().getTimezoneOffset() / 60
  const selectedTiemStamp = new Date(
    selyear,
    selmonth,
    selday,
    // hrs + (timeoffset - seloff),
    hrs,
    mins
  ).getTime()
  const standTimeStamp = new Date().getTime()
  return selectedTiemStamp < standTimeStamp
}

export function convertStrToStamp(val: string, open: boolean) {
  if (!val) return 0
  const AP = val.split(" ")[1],
    hr = Number(val.split(" ")[0].split(":")[0]),
    min = Number(val.split(" ")[0].split(":")[1])
  if (AP === "a.m.") {
    if (!open) {
      if (hr !== 12) return (hr + 24) * 60 + min
      return (hr + 12) * 60 + min
    }
    return hr * 60 + min
  } else {
    if (hr === 12) return hr * 60 + min
    return (hr + 12) * 60 + min
  }
}

export function convertTimeRange(hoursRange: any[]) {
  const timesRange = []
  for (let i = 0; i < hoursRange.length; i++) {
    if (parseInt(hoursRange[i].split("-")[0])) {
      const startTime = convertStrToStamp(hoursRange[i].split(" - ")[0], true)
      let endTime = 0
      if (hoursRange[i].split(" - ")[0].split(" ")[1] === "a.m.") {
        endTime = convertStrToStamp(hoursRange[i].split(" - ")[1], true)
      } else {
        endTime = convertStrToStamp(hoursRange[i].split(" - ")[1], false)
      }
      timesRange.push([startTime, endTime])
    } else {
      timesRange.push([0, 0])
    }
  }
  return timesRange
}

export function phoneFormatString(phnumber: string) {
  let formatPhnumber: string = phnumber,
    countrycode = "",
    Areacode = "",
    number = ""
  if (phnumber.length <= 10 && phnumber.length > 6) {
    countrycode = phnumber.substring(0, 3)
    Areacode = phnumber.substring(3, 6)
    number = phnumber.substring(6, phnumber.length)
    formatPhnumber = "(" + countrycode + ") " + Areacode + "-" + number
  } else if (phnumber.length > 10) {
    countrycode = phnumber.substring(phnumber.length - 10, phnumber.length - 7)
    Areacode = phnumber.substring(phnumber.length - 7, phnumber.length - 4)
    number = phnumber.substring(phnumber.length - 4, phnumber.length)
    formatPhnumber =
      phnumber.substring(0, phnumber.length - 10) +
      " (" +
      countrycode +
      ") " +
      Areacode +
      "-" +
      number
  }
  return formatPhnumber
}

export function checkDomain(url: string) {
  if (url.indexOf("//") === 0) {
    url = location.protocol + url
  }
  return url
    .toLowerCase()
    .replace(/([a-z])?:\/\//, "$1")
    .split("/")[0]
}

export function isExternal(url: string) {
  return (
    (url.indexOf(":") > -1 || url.indexOf("//") > -1) &&
    checkDomain(location.href) !== checkDomain(url)
  )
}

export function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export async function setQuotesStore(data: GetQuotesParams) {
  const prodsID: number[] = []
  for (let i = 0; i < data.repairs.length; i++) {
    prodsID.push(data.repairs[i].product_id)
  }
  const uniqueProdsID = prodsID.filter((c, index) => {
    return prodsID.indexOf(c) === index;
  });
  await repairWidgetAPI
    .getBrandsProducts(data.store_id, uniqueProdsID)
    .then(async (res: any) => {
      setRepairWidgetStore(res.data, data)
    })
    .catch((error) => {
      console.log("Error in get Brands and Products", error)
    })
}

function setRepairWidgetStore(res: any[], data: GetQuotesParams) {
  // console.log("Brands & Products\n", res, data)
  const deviceBrand = [], deviceModel = [], chooseRepair = []
  for (let i = 0; i < res.length; i++) {
    deviceBrand.push({
      alt: res[i].brand.img_alt,
      id: res[i].brand.id,
      img: res[i].brand.img_src,
      name: res[i].brand.name
    })
    deviceModel.push({
      alt: res[i].img_alt,
      id: res[i].id,
      img: res[i].img_src,
      name: res[i].name
    })
    const chooseRepairItem = []
    for (let j = 0; j < data.repairs.length; j++) {
      if (data.repairs[j].product_id === res[i].id) {
        chooseRepairItem.push({
          estimate: data.repairs[j].duration,
          id: data.repairs[j].repair_id,
          name: data.repairs[j].repair_name,
          warranty: data.repairs[j].warranty,
          warranty_unit: data.repairs[j].warranty_unit,
        })
      }
    }
    chooseRepair.push(chooseRepairItem)
  }
  repairWidgetStore.changeDeviceBrand(deviceBrand)
  repairWidgetStore.changeDeviceModel(deviceModel)
  repairWidgetStore.changeChooseRepair(chooseRepair)
  repairWidgetStore.changeDeviceCounter(res.length)
  repairWidgetStore.changeCntStep(7)
  for (let i = 0; i < repairWidData.repairWidgetLookup.repair_delivery_method.length; i++) {
    if (data.delivery_method === repairWidData.repairWidgetLookup.repair_delivery_method[i].code) {
      repairWidgetStore.changeDeliveryMethod({
        method: repairWidData.repairWidgetLookup.repair_delivery_method[i].code_text, 
        code: data.delivery_method
      })
      break
    }
  }
  for (let i = 0; i < repairWidData.repairWidgetLookup.repair_contact_method.length; i++) {
    if (data.customer_contact_method === repairWidData.repairWidgetLookup.repair_contact_method[i].code) {
      repairWidgetStore.changeReceiveQuote({
        method: repairWidData.repairWidgetLookup.repair_contact_method[i].code_text, 
        code: data.customer_contact_method
      })
      break
    }
  }
  repairWidgetStore.changeContactDetails({
    firstName: data.customer_first_name, 
    lastName: data.customer_last_name, 
    email: data.customer_email, 
    phone: data.customer_phone,
    address1: { code: '', name: data.customer_address_1 },
    address2: { code: '', name: data.customer_address_2 },
    country: { code: '', name: data.customer_country },
    city: data.customer_city,
    postalCode: data.customer_postcode
  })
  storesDetails.changeFindAddLocation(storesDetails.allLocations)
  for (let i = 0; i < storesDetails.allLocations.length; i++) {
    if (Number(storesDetails.allLocations[i].id) === Number(data.location_id)) {
      storesDetails.changeCntUserLocation(makeLocations([storesDetails.allLocations[i]]))
      storesDetails.changeLocationID(data.location_id)
      storesDetails.changeCustomerID(data.customer_id)
      storesDetails.changeCntUserLocationSelected(true)
      break;
    }
  }
}

export function ConvertWarrantyUnit(val: string, warnt: number) {
  if (val === "DD" || val === "DAY") {
    return warnt > 1 ? "Days" : "Day"
  } else if (val === "YY" || val === "YEAR") {
    return warnt > 1 ? "Years" : "Year"
  } else if (val === "MM" || val === "MONTH") {
    return warnt > 1 ? "Months" : "Month"
  } else {
    return "Lifetime"
  }
}

export function ValidateEmail(e: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(e)
}

export function ValidatePhoneNumber(p: string) {
  const found = p.search(
    /^(\+{1}\d{2,3}\s?[(]{1}\d{1,3}[)]{1}\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}$/
  )
  if (found > -1 && p.length >= 10) {
    return true
  } else {
    return false
  }
}

export function AddressFormatViewer(address: GetAddressFormat) {
  return (
    `${address.address_1 ? address.address_1 : ""} ` + 
    `${address.address_2 ? address.address_2 : ""} ` + 
    `${address.city ? address.city + "," : ""} ${address.state ? address.state : ""} ${
      address.postcode ? address.postcode : ""
    }`
  )
}

export function AddFormat12(address: GetCurrentLocParams) {
  return (
    `${address.address_1 ? address.address_1 : ""}` + 
    `${address.address_2 ? " " + address.address_2 : ""} `
  )
}

export function DuplicatedNavItem(navItems: any[], brandItem:any) {
  let ans = false
  for (let i = 0; i < navItems.length; i++) {
    if (navItems[i].text === brandItem.text) {
      ans = true
      break
    }
  }
  return ans
}

export function getBusinessLink(locs: any[]) {
  let businessLink = null
  for (let i = 0; i < locs.length; i++) {
    if (locs[i].is_main) {
      businessLink = locs[i].business_page_link
      break
    }
  }
  return businessLink
}

export function getWidth() {
  if (typeof window !== "undefined") {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  }
  return 0  
}

export const currencyFormater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function groupLocations (data: any[]) {
  const groupByData = _.groupBy(data, (o) => (o.state && o.city))
  return groupByData
}