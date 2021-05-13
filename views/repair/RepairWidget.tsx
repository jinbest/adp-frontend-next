import React, { useState, useEffect } from "react"
import ChooseDevice from "./widget-component/ChooseDevice"
import BackSVG from "./widget-component/BackSVG"
import ContactDetails from "./widget-component/ContactDetails"
import BookTime from "./widget-component/BookTime"
import UsefulInfo from "./widget-component/UsefulInfo"
import RepairServiceSummary from "./widget-component/RepairServiceSummary"
import QuoteComponent from "./widget-component/QuoteComponent"
import { observer } from "mobx-react"
import Error from "../error/Error"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import {
  getRepairLookupAPI,
  getDeliveryMethodsAPI,
  getContactMethodsAPI,
  getQuotesByLocAppointmentID,
} from "./RepairWidgetCallAPI"
import { storesDetails, repairWidgetStore } from "../../store"
import Head from "next/head"
import { useQuery } from "../../services/helper"

const stepList: string[] = [
  "deviceBrand",
  "deviceModel",
  "deviceRepairs",
  "repairAnotherDevice",
  "dropOffDevicce",
  "receiveQuote",
  "contactDetails",
  "bookTime",
  "usefulInfo",
  "repairServiceSummary",
  "quoteData",
]

interface Props {
  handleStatus: (status: boolean) => void
  features: any[]
}

const RepairWidget = ({ handleStatus, features }: Props) => {
  const mainData = storesDetails.storeCnts
  const mockData = storesDetails.commonCnts
  const themeCol = mainData.general.colorPalle.themeColor

  const [step, setStep] = useState(0)
  const [feats, setFeats] = useState<any[]>([])
  const [pageTitle, setPageTitle] = useState("Quotes | ")
  const [loading, setLoading] = useState(false)

  const query = useQuery()

  useEffect(() => {
    handleStatus(false)
    setStep(repairWidgetStore.cntStep)
    setPageTitle("Quotes | " + storesDetails.storesDetails.name)

    const cntFeatures: any[] = []
    for (let i = 0; i < features.length; i++) {
      if (features[i].isActive) {
        cntFeatures.push(features[i].flag)
      }
    }
    setFeats([...cntFeatures])

    getRepairLookupAPI()
    getDeliveryMethodsAPI()
    getContactMethodsAPI()
  }, [])

  useEffect(() => {
    if (Number(query.get("lid")) && Number(query.get("id"))) {
      handleGetQuote(Number(query.get("lid")), Number(query.get("id")))
    } else {
      setLoading(true)
    }
  }, [])

  const handleGetQuote = async (loc_id: number, id: number) => {
    repairWidgetStore.init()
    await getQuotesByLocAppointmentID(loc_id, id)
    setStep(repairWidgetStore.cntStep)
    setLoading(true)
  }

  const handleBackStep = () => {
    const cntStep: number = step,
      cntDeviceBrand = repairWidgetStore.deviceBrand,
      cntDeviceModel = repairWidgetStore.deviceModel,
      cntChooseRepair = repairWidgetStore.chooseRepair,
      cntDeviceCounter = repairWidgetStore.deviceCounter

    switch (cntStep) {
      case 1:
        if (cntDeviceBrand.length === cntDeviceCounter && cntDeviceCounter > 0) cntDeviceBrand.pop()
        if (cntDeviceModel.length === cntDeviceCounter && cntDeviceCounter > 0) cntDeviceModel.pop()
        repairWidgetStore.changeDeviceBrand(cntDeviceBrand)
        repairWidgetStore.changeDeviceModel(cntDeviceModel)
        repairWidgetStore.changeDeviceCounter(cntDeviceCounter - 1)
        break
      case 2:
        if (cntDeviceModel.length === cntDeviceCounter && cntDeviceCounter > 0) cntDeviceModel.pop()
        if (cntChooseRepair.length === cntDeviceCounter && cntDeviceCounter > 0)
          cntChooseRepair.pop()
        repairWidgetStore.changeDeviceModel(cntDeviceModel)
        repairWidgetStore.changeChooseRepair(cntChooseRepair)
        break
      case 3:
        if (cntChooseRepair.length === cntDeviceCounter && cntDeviceCounter > 0)
          cntChooseRepair.pop()
        repairWidgetStore.changeChooseRepair(cntChooseRepair)
        break
      case 4:
        repairWidgetStore.changeDeliveryMethod({ method: "", code: "" })
        break
      case 5:
        repairWidgetStore.changeDeliveryMethod({ method: "", code: "" })
        repairWidgetStore.changeReceiveQuote({ method: "", code: "" })
        break
      case 6:
        repairWidgetStore.changeReceiveQuote({ method: "", code: "" })
        repairWidgetStore.initContactDetails()
        break
      case 7:
        repairWidgetStore.initContactDetails()
        repairWidgetStore.initBookData()
        break
      case 8:
        repairWidgetStore.initBookData()
        repairWidgetStore.changeMessage("")
        break
      case 9:
        repairWidgetStore.changeMessage("")
        break
      default:
        break
    }
    if (cntStep === 11) {
      if (repairWidgetStore.deliveryMethod.code === "MAIL_IN") {
        repairWidgetStore.changeCntStep(9)
        setStep(9)
      } else {
        repairWidgetStore.initContactDetails()
        repairWidgetStore.changeCntStep(6)
        setStep(6)
      }
    } else {
      repairWidgetStore.changeCntStep(cntStep - 1)
      setStep(cntStep - 1)
    }
  }

  const handleStep = (i: number) => {
    setStep(i)
    repairWidgetStore.changeCntStep(i)
  }

  const handleChangeChooseData = (i: number, chooseData: any) => {
    if (i === 0) {
      const cntDeviceBrand = repairWidgetStore.deviceBrand,
        cntDeviceCounter = repairWidgetStore.deviceCounter
      cntDeviceBrand.push(chooseData)
      repairWidgetStore.changeDeviceBrand(cntDeviceBrand)
      repairWidgetStore.changeDeviceCounter(cntDeviceCounter + 1)
    } else if (i === 1) {
      const cntDeviceModel = repairWidgetStore.deviceModel
      cntDeviceModel.push(chooseData)
      repairWidgetStore.changeDeviceModel(cntDeviceModel)
    } else if (i === 2) {
      const cntChooseRepair = repairWidgetStore.chooseRepair
      const counter = chooseData.counter
      if (cntChooseRepair.length >= counter) {
        cntChooseRepair[counter - 1] = chooseData.data
      } else {
        cntChooseRepair.push(chooseData.data)
      }
      repairWidgetStore.changeChooseRepair(cntChooseRepair)
    } else if (i === 4) {
      repairWidgetStore.changeDeliveryMethod(chooseData)
    } else if (i === 5) {
      repairWidgetStore.changeReceiveQuote(chooseData)
    } else if (i === 6) {
      repairWidgetStore.changeContactDetails(chooseData)
    } else if (i === 7) {
      repairWidgetStore.changeBookData(chooseData)
    } else if (i === 8) {
      repairWidgetStore.changeMessage(chooseData)
    }
  }

  const handleDeviceCounterBack = () => {
    setStep(3)
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {loading && (
        <FeatureToggles features={feats}>
          <Feature
            name="FRONTEND_REPAIR"
            inactiveComponent={() => <Error />}
            activeComponent={() => (
              <div className="service-widget Container">
                {repairWidgetStore.deviceCounter > 0 && step < 10 && (
                  <div className="back-to-top" onClick={handleDeviceCounterBack}>
                    <BackSVG color="#BDBFC3" />
                  </div>
                )}
                {step > 0 && step < 10 && (
                  <div className="back-to-top" onClick={handleBackStep}>
                    <BackSVG color="#BDBFC3" />
                  </div>
                )}
                {step <= 5 && (
                  <ChooseDevice
                    data={mockData.repairWidget[stepList[step]]}
                    handleStep={handleStep}
                    handleChangeChooseData={handleChangeChooseData}
                    stepName={stepList[step]}
                    step={step}
                    repairWidgetData={repairWidgetStore}
                    features={feats}
                  />
                )}
                {step === 6 && (
                  <ContactDetails
                    data={mockData.repairWidget[stepList[step]]}
                    step={step}
                    handleStep={handleStep}
                    handleChangeChooseData={handleChangeChooseData}
                    repairWidgetData={repairWidgetStore}
                    code={repairWidgetStore.deliveryMethod.code}
                    features={feats}
                  />
                )}
                {step === 7 && (
                  <BookTime
                    data={mockData.repairWidget[stepList[step]]}
                    step={step}
                    code={repairWidgetStore.deliveryMethod.code}
                    handleStep={handleStep}
                    handleChangeChooseData={handleChangeChooseData}
                  />
                )}
                {step === 8 && (
                  <UsefulInfo
                    data={mockData.repairWidget[stepList[step]]}
                    step={step}
                    handleStep={handleStep}
                    handleChangeChooseData={handleChangeChooseData}
                    repairWidgetData={repairWidgetStore}
                  />
                )}
                {step === 9 && (
                  <RepairServiceSummary
                    themeCol={themeCol}
                    repairWidgetData={repairWidgetStore}
                    code={repairWidgetStore.deliveryMethod.code}
                    step={step}
                    handleStep={handleStep}
                    features={feats}
                  />
                )}
                {step === 10 && (
                  <QuoteComponent
                    data={mockData.repairWidget[stepList[step]]}
                    repairWidgetData={repairWidgetStore}
                    quoteKey={1}
                    code={repairWidgetStore.deliveryMethod.code}
                  />
                )}
                {step === 11 && (
                  <QuoteComponent
                    data={mockData.repairWidget[stepList[10]]}
                    repairWidgetData={repairWidgetStore}
                    quoteKey={0}
                    code={repairWidgetStore.deliveryMethod.code}
                  />
                )}
              </div>
            )}
          />
        </FeatureToggles>
      )}
    </>
  )
}

export default observer(RepairWidget)
