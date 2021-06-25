const repairWidgetStepName = {
  deviceBrand: "deviceBrand",
  deviceModel: "deviceModel",
  deviceRepairs: "deviceRepairs",
  repairAnotherDevice: "repairAnotherDevice",
  dropOffDevicce: "dropOffDevicce",
  receiveQuote: "receiveQuote",
  contactDetails: "contactDetails",
  bookTime: "bookTime",
  usefulInfo: "usefulInfo",
  repairServiceSummary: "repairServiceSummary",
  quoteData: "quoteData",
}

const stepList: string[] = [
  repairWidgetStepName.deviceBrand,
  repairWidgetStepName.deviceModel,
  repairWidgetStepName.deviceRepairs,
  repairWidgetStepName.repairAnotherDevice,
  repairWidgetStepName.dropOffDevicce,
  repairWidgetStepName.receiveQuote,
  repairWidgetStepName.contactDetails,
  repairWidgetStepName.bookTime,
  repairWidgetStepName.usefulInfo,
  repairWidgetStepName.repairServiceSummary,
  repairWidgetStepName.quoteData,
]

const DAYS_OF_THE_WEEK: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const MONTHS: string[] = [
  "January",
  "Febrary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octorber",
  "November",
  "December",
]

const deliveryMethodCode = {
  mailin: "MAIL_IN",
  onsite: "ONSITE",
  pickup: "PICK_UP",
  walkin: "WALK_IN",
  curbside: "CURBSIDE",
}

const contactMethodCode = {
  email: "EMAIL",
  text: "TEXT",
  phone: "PHONE",
}

const appointmentQuoteType = {
  quote: "QUOTE",
  appointment: "APPOINTMENT",
}

const featureToggleKeys = {
  FRONTEND_REPAIR_APPOINTMENT: "FRONTEND_REPAIR_APPOINTMENT",
  FRONTEND_USER_ACCOUNT: "FRONTEND_USER_ACCOUNT",
  FRONTEND_USER_LOGIN: "FRONTEND_USER_LOGIN",
  FRONTEND_FIND_A_STORE: "FRONTEND_FIND_A_STORE",
  FRONTEND_GLOBAL_SEARCH: "FRONTEND_GLOBAL_SEARCH",
  FRONTEND_REPAIR: "FRONTEND_REPAIR",
  FRONTEND_ONLINE_PURCHASE: "FRONTEND_ONLINE_PURCHASE",
  FRONTEND_REPAIR_QUOTE: "FRONTEND_REPAIR_QUOTE",
}

export {
  repairWidgetStepName,
  stepList,
  DAYS_OF_THE_WEEK,
  MONTHS,
  deliveryMethodCode,
  contactMethodCode,
  appointmentQuoteType,
  featureToggleKeys,
}
