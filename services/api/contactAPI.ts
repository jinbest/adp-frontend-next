import axios from "axios"
import Config from "../../config/config"
import { ContactSubmitParams } from "../../model/contact-submit-param"

class ContactUsAPI {

  postContactForm = (data: ContactSubmitParams) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${data.store_id}/contact-us`

    return new Promise((resolve, reject) => {
      axios
        .post(`${apiURL}`, data)
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
}
}

const instance = new ContactUsAPI()

export default instance