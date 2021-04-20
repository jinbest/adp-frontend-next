import axios from 'axios'
import Config from '../../config/config'
class AppLoadAPI {

  getStoreConfig = (store_id: number, subDomainID: number) => {

    const prodLink = 'https://prod.pcmtx.com/api/store-service/'
    let apiStoreURL = "", apiCommonURL = ""

    if (subDomainID > 0) {
      apiStoreURL = `${prodLink}dc/store/${subDomainID}/config`
      apiCommonURL = `${prodLink}dc/store/config/common`
    } else {
      apiStoreURL = `${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/config`
      apiCommonURL = `${Config.STORE_SERVICE_API_URL}dc/store/config/common`
    }

    const storeData = new Promise((resolve, reject) => {
      axios
        .get(`${apiStoreURL}`)
        .then((response) => {
          if (response) {
            resolve(response)
          } else {
            reject(response)
          }
        })
        .catch((error) => {
          if (error) {
            reject(error)
          }
        })
    })
    const commonData = new Promise((resolve, reject) => {
      axios
        .get(`${apiCommonURL}`)
        .then((response) => {
          if (response) {
            resolve(response)
          } else {
            reject(response)
          }
        })
        .catch((error) => {
          if (error) {
            reject(error)
          }
        })
    })
    
    return Promise.all([storeData, commonData])
  }

}

const instance = new AppLoadAPI()

export default instance
