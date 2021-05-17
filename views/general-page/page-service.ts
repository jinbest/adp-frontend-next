import Config from "../../config/config"
import ApiClient from "../../services/api-client"

const apiClient = ApiClient.getInstance()

const loadPage = async (storeID: number, type: string, fileName: string) => {
  try {
    const url = `${Config.STORE_SERVICE_API_URL}dc/store/${storeID}/template/${type}/asset?file_name=${fileName}`
    const response = await apiClient.get<any>(url)

    return response
  } catch {
    //EMPTY
  }
}

export {
  loadPage
}