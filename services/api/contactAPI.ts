import Config from "../../config/config"
import { ContactSubmitParams } from "../../model/contact-submit-param"
import ApiClient from "../api-client"

const apiClient = ApiClient.getInstance()

class ContactUsAPI {

  postContactForm = async (data: ContactSubmitParams) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${data.store_id}/contact-us`
    return await apiClient.post(apiURL, data)
  }
}

const instance = new ContactUsAPI()

export default instance