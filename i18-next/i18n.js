import i18n from "i18next"
import detector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import Config from "../config/config"
import HttpBackend from "i18next-http-backend"

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(HttpBackend)
  .init({
    lng: "en",

    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    nsSeparator: false,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    preload: ["en", "fr"],

    ns: ["translation"],

    defaultNS: "translation",

    backend: {
      loadPath: `${Config.TRANSLATION_SERVICE_API_URL}dc/translation/frontend/{{lng}}`,
    },

    react: { wait: true, useSuspense: false },
  })

export default i18n
