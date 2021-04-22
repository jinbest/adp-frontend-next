import Config from '../../config/config';
import ApiClient from "../api-client"

const apiClient = ApiClient.getInstance()
class FindLocationAPI {

  findGeoLocation = async (store_id:number, data:any) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/locations/co_ordinates`
    return await apiClient.post(apiURL, data)
  };

  findAddLocation = async (store_id:number, data:any) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/locations/address`
    return await apiClient.post(apiURL, data)
  };
  
  findAllLocation = async (store_id:number) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/locations?page=1&per_page=10000&include_voided=false`;

    // console.log(store_id)
    // const prodLink = 'https://prod.pcmtx.com/api/store-service/'
    // const storeIDs = {
    //   mobiletechlab: 4,
    //   northtechcellsolutions: 5,
    //   nanotechmobile: 2,
    //   pradowireless: 10,
    //   wirelessrevottawa: 8,
    //   geebodevicerepair: 3,
    //   phonephix: 9,
    //   bananaservice: 1
    // }
    // const apiURL = `${prodLink}dc/store/${storeIDs.pradowireless}/locations?page=1&per_page=10000&include_voided=false`;

    return await apiClient.get<any>(apiURL)
  };

}

const instance = new FindLocationAPI();

export default instance;
