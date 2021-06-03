import Config from "../../config/config"
import ApiClient from "../api-client"

const apiClient = ApiClient.getInstance()

class GeneralSearchAPI {
  elasticSearch = async (text: string) => {
    const apiURL = `${Config.SEARCH_SERVICE_API_URL}combined-search/_search?q=${text}`
    return await apiClient.get<any>(apiURL)
  }
}

const instance = new GeneralSearchAPI()

export default instance
