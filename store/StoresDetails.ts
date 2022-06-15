import { action, autorun, configure, observable, makeAutoObservable } from "mobx"
import { GetCurrentLocParams } from "../model/get-current-location"
import { appointmentQuoteType } from "../const/_variables"
import mockData from "./mockConfig.json"

configure({ enforceActions: "always" })

export class StoresDetails {
  @observable storesDetails: any = {}
  @observable findAddLocation: any[] = []
  @observable cntUserLocation: GetCurrentLocParams[] = []
  @observable cntUserLocationSelected = false

  @observable store_id = -1
  @observable location_id = -1
  @observable is_voided = false
  @observable customer_id = -1
  @observable type = appointmentQuoteType.quote
  @observable allLocations: any[] = []
  @observable storeCnts: any = {}
  @observable commonCnts: any = {}
  @observable privacyTemplate = ""

  constructor() {
    this.load()
    autorun(this.save)
    makeAutoObservable(this)
  }

  private save = () => {
    if (
      typeof window !== "undefined" &&
      window.localStorage !== null &&
      typeof window.localStorage !== "undefined"
    ) {
      window.localStorage.setItem(
        StoresDetails.name,
        JSON.stringify({
          storesDetails: this.storesDetails,
          findAddLocation: this.findAddLocation,
          cntUserLocation: this.cntUserLocation,
          cntUserLocationSelected: this.cntUserLocationSelected,
          store_id: this.store_id,
          location_id: this.location_id,
          is_voided: this.is_voided,
          customer_id: this.customer_id,
          type: this.type,
          allLocations: this.allLocations,
          storeCnts: this.storeCnts,
          commonCnts: this.commonCnts,
          privacyTemplate: this.privacyTemplate,
        })
      )
    }
  }

  @action
  private load = () => {
    if (
      typeof window !== "undefined" &&
      window.localStorage !== null &&
      typeof window.localStorage !== "undefined"
    ) {
      Object.assign(this, JSON.parse(window.localStorage.getItem(StoresDetails.name) || "{}"))
    }
  }

  @action
  changestoresDetails = (storesDetails: any) => {
    this.storesDetails = storesDetails
    this.save()
  }

  @action
  changeStoreCnts = (storeCnts: any) => {
    this.storeCnts = {...storeCnts, ...mockData["storesCnts"]}
    this.save()
  }

  @action
  changeCommonCnts = (commonCnts: any) => {
    this.commonCnts = commonCnts
    this.save()
  }

  @action
  changeFindAddLocation = (findAddLocation: any[]) => {
    this.findAddLocation = this.sortDataByDistance(findAddLocation)
    this.save()
  }

  @action
  changeAddLocations = (allLocations: any[]) => {
    const data = []
    for (let i = 0; i < allLocations.length; i++) {
      if (allLocations[i].is_main) {
        data.push(allLocations[i])
      }
    }
    for (let i = 0; i < allLocations.length; i++) {
      if (!allLocations[i].is_main) {
        data.push(allLocations[i])
      }
    }
    this.allLocations = data
    this.save()
  }

  @action
  sortDataByDistance = (data: any[]) => {
    let temp: any = {}
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].distance > data[j].distance) {
          temp = data[i]
          data[i] = data[j]
          data[j] = temp
        }
      }
    }
    return data
  }

  @action
  changeCntUserLocation = (cntUserLocation: GetCurrentLocParams[]) => {
    this.cntUserLocation = cntUserLocation
    this.save()
  }

  @action
  changeCntUserLocationSelected = (cntUserLocationSelected: boolean) => {
    this.cntUserLocationSelected = cntUserLocationSelected
    this.save()
  }

  @action
  changeStoreID = (store_id: number) => {
    this.store_id = store_id
    this.save()
  }

  @action
  changeLocationID = (location_id: number) => {
    this.location_id = location_id
    this.save()
  }

  @action
  changeIsVoided = (is_voided: boolean) => {
    this.is_voided = is_voided
    this.save()
  }

  @action
  changeCustomerID = (customer_id: number) => {
    this.customer_id = customer_id
    this.save()
  }

  @action
  changeType = (type: string) => {
    this.type = type
    this.save()
  }

  @action
  changePrivacyPolicy = (privacyTemplate: string) => {
    this.privacyTemplate = privacyTemplate
    this.save()
  }
}

export default new StoresDetails()
