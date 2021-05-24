import { action, autorun, configure, observable, makeAutoObservable } from "mobx"

configure({ enforceActions: "always" })

export class RepairWidData {
  @observable repairDeviceBrands: any = {}
  @observable repairBrandProducts: any = {}
  @observable repairWidgetLookup: any = {}
  @observable repairDeliveryMethod: any[] = []
  @observable repairsOfferedDevices: any = {}
  @observable apiDropOffDevices: any = {}
  @observable receiveQuote: any = {}
  @observable cntBrandID = 0
  @observable cntProductID = 0
  @observable contactMethod: any[] = []

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
        RepairWidData.name,
        JSON.stringify({
          repairDeviceBrands: this.repairDeviceBrands,
          repairBrandProducts: this.repairBrandProducts,
          repairWidgetLookup: this.repairWidgetLookup,
          repairDeliveryMethod: this.repairDeliveryMethod,
          repairsOfferedDevices: this.repairsOfferedDevices,
          apiDropOffDevices: this.apiDropOffDevices,
          receiveQuote: this.receiveQuote,
          cntBrandID: this.cntBrandID,
          cntProductID: this.cntProductID,
          contactMethod: this.contactMethod,
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
      Object.assign(this, JSON.parse(window.localStorage.getItem(RepairWidData.name) || "{}"))
    } else {
      Object.assign(this, {})
    }
  }

  @action
  changeRepairDeviceBrands = (repairDeviceBrands: any) => {
    this.repairDeviceBrands = repairDeviceBrands
    this.save()
  }

  @action
  changeRepairBrandProducts = (repairBrandProducts: any) => {
    this.repairBrandProducts = repairBrandProducts
    this.save()
  }

  @action
  changeRepairWidgetLookup = (repairWidgetLookup: any) => {
    this.repairWidgetLookup = repairWidgetLookup
    this.save()
  }

  @action
  changeRepairWidDeliveryMethod = (repairDeliveryMethod: any[]) => {
    this.repairDeliveryMethod = repairDeliveryMethod
    this.save()
  }

  @action
  changeRepairsOfferedDevice = (repairsOfferedDevices: any) => {
    this.repairsOfferedDevices = repairsOfferedDevices
    this.save()
  }

  @action
  changeApiDropOffDevices = (apiDropOffDevices: any) => {
    this.apiDropOffDevices = apiDropOffDevices
    this.save()
  }

  @action
  changeReceiveQuote = (receiveQuote: any) => {
    this.receiveQuote = receiveQuote
    this.save()
  }

  @action
  changeCntBrandID = (cntBrandID: number) => {
    this.cntBrandID = cntBrandID
    this.save()
  }

  @action
  changeCntProductID = (cntProductID: number) => {
    this.cntProductID = cntProductID
    this.save()
  }

  @action
  changeRepairContactMethod = (contactMethod: any[]) => {
    this.contactMethod = contactMethod
    this.save()
  }
}

export default new RepairWidData()
