
export default class Config {
  /* Local Dev Mode */
  static STORE_SERVICE_API_URL = "https://dev.dccmtx.com/api/store-service/"
  static ADMIN_SERVICE_API_URL = "https://dev.dccmtx.com/api/administration-service/"
  static PRODUCT_SERVICE_API_URL = "https://dev.dccmtx.com/api/product-service/"
  static REPAIR_SERVICE_API_URL = "https://dev.dccmtx.com/api/repair-service/"
  static ENVIRONMENT = "local"
  static TRANSLATION_SERVICE_API_URL = "https://dev.dccmtx.com/api/translation-service/"

  /* Local Prod Mode */
  // static STORE_SERVICE_API_URL = "https://prod.pcmtx.com/api/store-service/"
  // static ADMIN_SERVICE_API_URL = "https://prod.pcmtx.com/api/administration-service/"
  // static PRODUCT_SERVICE_API_URL = "https://prod.pcmtx.com/api/product-service/"
  // static REPAIR_SERVICE_API_URL = "https://prod.pcmtx.com/api/repair-service/"
  // static ENVIRONMENT = "production"
  // static TRANSLATION_SERVICE_API_URL = "https://prod.pcmtx.com/api/translation-service/"

  static DEVICE_ADP_LISTS = [
    {
      name: "bananaservices",
      domain: "bananaservices.ca",
      storeID: 1,
      locations: [],
    },
    {
      name: "geebodevicerepair",
      domain: "geebodevicerepair.ca",
      storeID: 3,
      locations: [
        {
          slug: "downtown",
          id: 3,
        },
        {
          slug: "spring-garden",
          id: 14,
        },
        {
          slug: "clayton-park",
          id: 13,
        },
        {
          slug: "sackville",
          id: 12,
        },
      ],
    },
    {
      name: "mobiletechlab",
      domain: "mobiletechlab.ca",
      storeID: 4,
      locations: [
        {
          slug: "corydon",
          id: 4,
        },
        {
          slug: "st-vital",
          id: 33,
        },
        {
          slug: "thompson",
          id: 34,
        },
      ],
    },
    {
      name: "nanotechmobile",
      domain: "nanotechmobile.ca",
      storeID: 2,
      locations: [
        {
          slug: "avonhurst-dr",
          id: 2,
        },
      ],
    },
    {
      name: "northtechcellsolutions",
      domain: "northtechcellsolutions.ca",
      storeID: 5,
      locations: [],
    },
    {
      name: "phonephix",
      domain: "phonephix.ca",
      storeID: 9,
      locations: [
        {
          slug: "village-lane",
          id: 9,
        },
      ],
    },
    {
      name: "pradowireless",
      domain: "pradowireless.com",
      storeID: 10,
      locations: [
        {
          slug: "douglas-st",
          id: 10,
        },
      ],
    },
    {
      name: "reparationcellulairebsl",
      domain: "reparationcellulairebsl.ca",
      storeID: 7,
      locations: [],
    },
    {
      name: "wirelessrevottawa",
      domain: "wirelessrevottawa.ca",
      storeID: 8,
      locations: [
        {
          slug: "bank-st",
          id: 8,
        },
      ],
    },
    {
      name: "dccmtx",
      domain: "https://dev.mtlcmtx.com/",
      storeID: 1,
      locations: [
        {
          slug: "corydon-ave",
          id: 1,
        },
      ],
    },
    {
      name: "mtlcmtx",
      domain: "https://dev.mtlcmtx.com/",
      storeID: 2,
      locations: [],
    },
  ]
}
