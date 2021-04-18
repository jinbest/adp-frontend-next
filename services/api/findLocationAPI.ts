import axios from 'axios';
import Config from '../../config/config';

class FindLocationAPI {

  findGeoLocation = (store_id:number, data:any) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/locations/co_ordinates`;
    return new Promise((resolve, reject) => {
      axios
        .post(`${apiURL}`, data)
        .then(response => {
          if(response) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          if (error) {
            reject(error);
          }
        });
    });
  };

  findAddLocation = (store_id:number, data:any) => {
    const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/locations/address`;
    return new Promise((resolve, reject) => {
      axios
        .post(`${apiURL}`, data)
        .then(response => {
          if(response) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          if (error) {
            reject(error)
          }
        });
    });
  };
  
  findAllLocation = (store_id:number) => {
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

    return new Promise((resolve, reject) => {
      axios
        .get<any>(`${apiURL}`)
        .then(response => {
          if(response) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          if (error) {
            reject(error)
          }
        });
    });
  };

}

const instance = new FindLocationAPI();

export default instance;
