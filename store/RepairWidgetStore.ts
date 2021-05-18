import { action, autorun, configure, observable, makeAutoObservable } from 'mobx'

configure({ enforceActions: 'always' })

export class RepairWidgetStore {

  @observable deviceBrand: any[] = []
  @observable deviceModel: any[] = []
  @observable chooseRepair: any[] = []
  @observable deviceCounter = 0
  @observable deliveryMethod: any = { method: '', code: '' }
  @observable receiveQuote: any = { method: '', code: '' }
  @observable contactDetails: any = { 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    address1: { code: '', name: '' },
    address2: { code: '', name: '' },
    country: { code: '', name: '' },
    city: '',
    province: { code: '', name: '' },
    postalCode: ''
  }
  @observable bookData: any = {
    'MAIL_IN': { sendTo: '' },
    'WALK_IN': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
    'PICK_UP': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
    'CURBSIDE': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
    'ONSITE': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
  }
  @observable message = ''
  @observable cntStep = 0
  @observable repairWidgetInitialValue: any = {
    selectDate: null,
    selected_start_time: null,
    selected_end_time: null
  }
  @observable appointResponse: any = {}
  @observable timezone: string | undefined = "America/Winnipeg"

  constructor() {
    this.load();
    autorun(this.save);
    makeAutoObservable(this);
  }

  private save = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        RepairWidgetStore.name,
        JSON.stringify({
          deviceBrand: this.deviceBrand,
          deviceModel: this.deviceModel,
          chooseRepair: this.chooseRepair,
          deviceCounter: this.deviceCounter,
          deliveryMethod: this.deliveryMethod,
          receiveQuote: this.receiveQuote,
          contactDetails: this.contactDetails,
          bookData: this.bookData,
          message: this.message,
          cntStep: this.cntStep,
          repairWidgetInitialValue: this.repairWidgetInitialValue,
          appointResponse: this.appointResponse,
          timezone: this.timezone
        })
      )
    }
  }    

  @action
  private load = () => {
    if (typeof window !== "undefined") {
      Object.assign(this, JSON.parse(window.localStorage.getItem(RepairWidgetStore.name) || '{}'))
    }
  }    

  @action
  changeDeviceBrand = (deviceBrand: any[]) => {
    this.deviceBrand = deviceBrand
    this.save()
  }

  @action
  changeDeviceModel = (deviceModel: any[]) => {
    this.deviceModel = deviceModel
    this.save()
  }

  @action
  changeChooseRepair = (chooseRepair: any[]) => {
    this.chooseRepair = chooseRepair
    this.save()
  }

  @action
  changeDeviceCounter = (deviceCounter: number) => {
    this.deviceCounter = deviceCounter
    this.save()
  }

  @action
  changeDeliveryMethod = (deliveryMethod: any) => {
    this.deliveryMethod = deliveryMethod
    this.save()
  }

  @action
  changeReceiveQuote = (receiveQuote: any) => {
    this.receiveQuote = receiveQuote
    this.save()
  }

  @action
  changeContactDetails = (contactDetails: any) => {
    this.contactDetails = contactDetails
    this.save()
  }

  @action initContactDetails = () => {
    this.contactDetails = { 
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '',
      address1: { code: '', name: '' },
      address2: { code: '', name: '' },
      country: { code: '', name: '' },
      city: '',
      province: { code: '', name: '' },
      postalCode: ''
    }
    this.save()
  }

  @action
  changeBookData = (bookData: any) => {
    const code = bookData.code, cntBookData = this.bookData
    cntBookData[code] = bookData.data
    this.bookData = cntBookData
    this.save()
  }

  @action
  initBookData = () => {
    this.bookData = {
      'MAIL_IN': { sendTo: '' },
      'WALK_IN': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
      'PICK_UP': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
      'CURBSIDE': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
      'ONSITE': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
    }
    this.save()
  }

  @action
  changeMessage = (message: string) => {
    this.message = message
    this.save()
  }

  @action
  changeCntStep = (cntStep: number) => {
    this.cntStep = cntStep
    this.save()
  }

  @action
  changeRepairWidgetInitialValue = (repairWidgetInitialValue: any) => {
    this.repairWidgetInitialValue = repairWidgetInitialValue
    this.save()
  }

  @action
  changeAppointResponse = (appointResponse: any) => {
    this.appointResponse = appointResponse
    this.save()
  }

  @action
  changeTimezone = (timezone: string | undefined) => {
    this.timezone = timezone
    this.save()
  }

  @action
  init = () => {
    this.deviceBrand = [];
    this.deviceModel = [];
    this.chooseRepair = [];
    this.deviceCounter = 0;
    this.deliveryMethod = { method: '', code: '' };
    this.receiveQuote = { method: '', code: '' };
    this.contactDetails = {
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '',
      address1: { code: '', name: '' },
      address2: { code: '', name: '' },
      country: { code: '', name: '' },
      city: '',
      province: { code: '', name: '' },
      postalCode: ''
    };
    this.bookData = {
      'MAIL_IN': { sendTo: '' },
      'WALK_IN': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
      'PICK_UP': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
      'CURBSIDE': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
      'ONSITE': { address: { code: '', name: '' }, time: '', day: '', month: '', year: '', week: '', timezone: '' },
    };
    this.message = '';
    this.cntStep = 0;
    this.repairWidgetInitialValue = {
      selectDate: null,
      selected_start_time: null,
      selected_end_time: null
    }
    this.appointResponse = {}
    this.timezone = "America/Winnipeg"
    this.save();
  }

  @action
  reset = () => {
    this.init();
  }

}

export default new RepairWidgetStore();