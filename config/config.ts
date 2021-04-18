// export default class Config {
//     private static envSettings = window as Record<string, any>
//     static STORE_SERVICE_API_URL = Config.envSettings.REACT_APP_STORE_SERVICE_API_URL
//     static ADMIN_SERVICE_API_URL = Config.envSettings.REACT_APP_ADMIN_SERVICE_API_URL
//     static PRODUCT_SERVICE_API_URL = Config.envSettings.REACT_APP_PRODUCT_SERVICE_API_URL
//     static REPAIR_SERVICE_API_URL = Config.envSettings.REACT_APP_REPAIR_SERVICE_API_URL
//     static ENVIRONMENT = Config.envSettings.REACT_APP_ENVIRONMENT
//     static TRANSLATION_SERVICE_API_URL = Config.envSettings.REACT_APP_TRANSLATION_SERVICE_API_URL
// }

export default class Config {
    static STORE_SERVICE_API_URL = "https://dev.dccmtx.com/api/store-service/"
    static ADMIN_SERVICE_API_URL = "https://dev.dccmtx.com/api/administration-service/"
    static PRODUCT_SERVICE_API_URL = "https://dev.dccmtx.com/api/product-service/"
    static REPAIR_SERVICE_API_URL = "https://dev.dccmtx.com/api/repair-service/"
    static ENVIRONMENT = "local"
    static TRANSLATION_SERVICE_API_URL = "https://dev.dccmtx.com/api/translation-service/"
}
