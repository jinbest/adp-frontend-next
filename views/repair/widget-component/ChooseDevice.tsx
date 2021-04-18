import React, { useState, useEffect } from "react"
import { Card, PlusSVG, LazyImg } from "./"
import { Grid, Typography } from "@material-ui/core"
import { Search, Button } from "../../../components"
import RepairSummary from "./RepairSummary"
import { useTranslation } from "react-i18next"
import { repairWidData, storesDetails, repairWidgetStore } from "../../../store/"
import {
  getDeviceBrandsAPI,
  addMoreDeviceBrandsAPI,
  getBrandProductsAPI,
  addMoreBrandProductsAPI,
  getRepairsOfferedDeviceAPI,
  addMoreRepairsOfferedDeviceAPI,
} from "../RepairWidgetCallAPI"
import { ContactModal } from "../../business"
import { ConvertWarrantyUnit } from "../../../services/helper"

type Props = {
  data: any
  stepName: string
  step: number
  handleStep: (step: number) => void
  handleChangeChooseData: (step: number, chooseData: any) => void
  repairWidgetData: any
  features: any[]
}

type ArrayProps = {
  array: any[]
}

const ChooseDevice = ({
  data,
  stepName,
  step,
  handleStep,
  handleChangeChooseData,
  repairWidgetData,
  features,
}: Props) => {
  const mainData = storesDetails.storeCnts
  const themeCol = mainData.general.colorPalle.themeColor
  const repairChooseItemCol = mainData.general.colorPalle.repairChooseItemCol

  const [sliceNum, setSliceNum] = useState(10)
  const [plusVisible, setPlusVisible] = useState(false)
  const [itemTypes, setItemTypes] = useState<ArrayProps[]>([])
  const [estimatedTimes, setEstimatedTimes] = useState<ArrayProps[]>([])
  const [selected, setSelected] = useState(999)
  const [disableStatus, setDisableStatus] = useState(true)
  const [imageData, setImageData] = useState<any[]>([])
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [openContactModal, setOpenContactModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [t] = useTranslation()

  const handlePlus = async () => {
    const cntImgData: any[] = [],
      cntTypes: any[] = []
    let cntOfferedRepairs: any[] = []
    switch (stepName) {
      case "deviceBrand":
        await addMoreDeviceBrandsAPI(searchText, page + 1, perPage)
        if (repairWidData.repairDeviceBrands.data && repairWidData.repairDeviceBrands.data.length) {
          setSliceNum(repairWidData.repairDeviceBrands.data.length)
          if (repairWidData.repairDeviceBrands.metadata.total <= (page + 1) * perPage) {
            setPlusVisible(false)
          } else {
            setPlusVisible(true)
          }
          for (let i = 0; i < repairWidData.repairDeviceBrands.data.length; i++) {
            cntImgData.push({
              name: repairWidData.repairDeviceBrands.data[i].name,
              img: repairWidData.repairDeviceBrands.data[i].img_src,
              id: repairWidData.repairDeviceBrands.data[i].id,
              alt: repairWidData.repairDeviceBrands.data[i].img_alt,
            })
          }
        }
        break
      case "deviceModel":
        await addMoreBrandProductsAPI(repairWidData.cntBrandID, searchText, page + 1, perPage)
        if (
          repairWidData.repairBrandProducts.data &&
          repairWidData.repairBrandProducts.data.length
        ) {
          setSliceNum(repairWidData.repairBrandProducts.data.length)
          if (repairWidData.repairBrandProducts.metadata.total <= (page + 1) * perPage) {
            setPlusVisible(false)
          } else {
            setPlusVisible(true)
          }
          for (let i = 0; i < repairWidData.repairBrandProducts.data.length; i++) {
            cntImgData.push({
              name: repairWidData.repairBrandProducts.data[i].name,
              img: repairWidData.repairBrandProducts.data[i].img_src,
              id: repairWidData.repairBrandProducts.data[i].id,
              alt: repairWidData.repairBrandProducts.data[i].img_alt,
            })
          }
        }
        break
      case "deviceRepairs":
        await addMoreRepairsOfferedDeviceAPI(
          repairWidData.cntProductID,
          searchText,
          page + 1,
          perPage
        )
        cntOfferedRepairs = repairWidData.repairsOfferedDevices.data
        setSliceNum(repairWidData.repairsOfferedDevices.data.length)
        if (repairWidData.repairsOfferedDevices.metadata.total <= (page + 1) * perPage) {
          setPlusVisible(false)
        } else {
          setPlusVisible(true)
        }
        for (let i = 0; i < cntOfferedRepairs.length; i++) {
          cntTypes.push({
            name: cntOfferedRepairs[i].title,
            bg: "white",
            col: "black",
            estimate: cntOfferedRepairs[i].duration,
            selected: false,
            cost: cntOfferedRepairs[i].cost,
            warranty: cntOfferedRepairs[i].warranty,
            warranty_unit: cntOfferedRepairs[i].warranty_unit,
            id: cntOfferedRepairs[i].id,
          })
        }
        for (let i = 0; i < cntTypes.length; i++) {
          for (let j = 0; j < repairWidgetData.chooseRepair.length; j++) {
            if (cntTypes[i].name === repairWidgetData.chooseRepair[j].name) {
              cntTypes[i].bg = repairChooseItemCol
              cntTypes[i].col = "white"
              cntTypes[i].selected = true
            }
          }
        }
        setItemTypes([...cntTypes])
        break
      default:
        break
    }
    setImageData(cntImgData)
    setPage(page + 1)
  }

  const ChooseNextStep = async (i: number) => {
    if (i === 999) {
      const timer = setTimeout(() => {
        handleStep(step + 1)
      }, 500)
      return () => clearTimeout(timer)
    }
    setSelected(i)
    handleChangeChooseData(step, imageData[i])
    switch (stepName) {
      case "deviceBrand":
        repairWidData.changeCntBrandID(imageData[i].id)
        handleStep(step + 1)
        break
      case "deviceModel":
        repairWidData.changeCntProductID(imageData[i].id)
        handleStep(step + 1)
        break
      default:
        break
    }
  }

  const onKeyPress = async (event: any) => {
    if (event.key === "Enter" && (step === 0 || step === 1 || step === 2)) {
      await loadStepData(stepName, event.target.value, 1, page * perPage)
    }
    if (event.key === "Enter" && !disableStatus && (step === 2 || step === 4 || step === 5)) {
      handleStep(step + 1)
    }
  }

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchText(e.target.value)
  }

  const handleClickSearchIcon = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (step >= 3) return
    e.preventDefault()
    await loadStepData(stepName, searchText, 1, page * perPage)
  }

  const loadStepData = async (name: string, text: string, pg: number, perpg: number) => {
    setLoading(true)
    const cntImgData: any[] = [],
      cntTypes: any[] = []
    let cntOfferedRepairs: any[] = []
    switch (name) {
      case "deviceBrand":
        await getDeviceBrandsAPI(text, pg, perpg)
        if (repairWidData.repairDeviceBrands.data && repairWidData.repairDeviceBrands.data.length) {
          setSliceNum(repairWidData.repairDeviceBrands.data.length)
          for (let i = 0; i < repairWidData.repairDeviceBrands.data.length; i++) {
            cntImgData.push({
              name: repairWidData.repairDeviceBrands.data[i].name,
              img: repairWidData.repairDeviceBrands.data[i].img_src,
              id: repairWidData.repairDeviceBrands.data[i].id,
              alt: repairWidData.repairDeviceBrands.data[i].img_alt,
            })
          }
        }
        if (repairWidData.repairDeviceBrands.metadata.total <= pg * perpg) {
          setPlusVisible(false)
        } else {
          setPlusVisible(true)
        }
        break
      case "deviceModel":
        await getBrandProductsAPI(repairWidData.cntBrandID, text, pg, perpg)
        if (
          repairWidData.repairBrandProducts.data &&
          repairWidData.repairBrandProducts.data.length
        ) {
          setSliceNum(repairWidData.repairBrandProducts.data.length)
          for (let i = 0; i < repairWidData.repairBrandProducts.data.length; i++) {
            cntImgData.push({
              name: repairWidData.repairBrandProducts.data[i].name,
              img: repairWidData.repairBrandProducts.data[i].img_src,
              id: repairWidData.repairBrandProducts.data[i].id,
              alt: repairWidData.repairBrandProducts.data[i].img_alt,
            })
          }
        }
        if (repairWidData.repairBrandProducts.metadata.total <= pg * perpg) {
          setPlusVisible(false)
        } else {
          setPlusVisible(true)
        }
        break
      case "deviceRepairs":
        await getRepairsOfferedDeviceAPI(repairWidData.cntProductID, text, pg, perpg)
        cntOfferedRepairs = repairWidData.repairsOfferedDevices.data

        if (cntOfferedRepairs != null) {
          setSliceNum(repairWidData.repairsOfferedDevices.data.length)
          for (let i = 0; i < cntOfferedRepairs.length; i++) {
            cntTypes.push({
              name: cntOfferedRepairs[i].title,
              bg: "white",
              col: "black",
              estimate: cntOfferedRepairs[i].duration,
              selected: false,
              cost: cntOfferedRepairs[i].cost,
              warranty: cntOfferedRepairs[i].warranty,
              warranty_unit: cntOfferedRepairs[i].warranty_unit,
              id: cntOfferedRepairs[i].id,
            })
          }
          for (let i = 0; i < cntTypes.length; i++) {
            for (let j = 0; j < repairWidgetData.chooseRepair.length; j++) {
              if (cntTypes[i].name === repairWidgetData.chooseRepair[j].name) {
                cntTypes[i].bg = repairChooseItemCol
                cntTypes[i].col = "white"
                cntTypes[i].selected = true
              }
            }
          }
          setItemTypes([...cntTypes])
        }
        if (
          repairWidData.repairsOfferedDevices != null &&
          repairWidData.repairsOfferedDevices.metadata != null &&
          repairWidData.repairsOfferedDevices.metadata.total <= pg * perpg
        ) {
          setPlusVisible(false)
        } else if (
          repairWidData.repairsOfferedDevices != null &&
          repairWidData.repairsOfferedDevices.metadata != null
        ) {
          setPlusVisible(true)
        }
        break
      default:
        break
    }
    setImageData(cntImgData)
    setLoading(false)
  }

  useEffect(() => {
    const initPage = 1,
      initPerPage = 10
    setPage(initPage)
    setPerPage(initPerPage)
    loadStepData(stepName, "", initPage, initPerPage)
  }, [data, stepName, repairWidData])

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step, disableStatus, page, perPage])

  const GotoNextStep = async () => {
    await ChooseNextStep(999)
  }

  const GobackFirst = () => {
    setSelected(999)
    handleStep(0)
  }

  useEffect(() => {
    if (step === 4) {
      const cntTypes: any[] = []
      const cntDeliverySets: any[] = repairWidData.apiDropOffDevices.types.length
        ? repairWidData.apiDropOffDevices.types
        : []
      const cntAvailableDeliveryMethod: any[] = repairWidData.repairDeliveryMethod
      for (let i = 0; i < cntDeliverySets.length; i++) {
        for (let j = 0; j < cntAvailableDeliveryMethod.length; j++) {
          if (
            cntDeliverySets[i].code === cntAvailableDeliveryMethod[j].code &&
            cntAvailableDeliveryMethod[j].is_enabled
          ) {
            cntTypes.push(cntDeliverySets[i])
            break
          }
        }
      }
      for (let i = 0; i < cntTypes.length; i++) {
        cntTypes[i].bg = "white"
        cntTypes[i].col = "black"
        cntTypes[i].selected = false
        if (cntTypes[i].name === repairWidgetData.deliveryMethod.method) {
          cntTypes[i].bg = repairChooseItemCol
          cntTypes[i].col = "white"
          cntTypes[i].selected = true
        }
      }
      setItemTypes([...cntTypes])
    } else if (step === 5) {
      const cntQuote: any[] = [],
        cntTypes: any[] = repairWidData.receiveQuote.types.length
          ? repairWidData.receiveQuote.types
          : []
      for (let i = 0; i < cntTypes.length; i++) {
        cntTypes[i].bg = "white"
        cntTypes[i].col = "black"
        cntTypes[i].selected = false
        if (cntTypes[i].name === repairWidgetData.receiveQuote.method) {
          cntTypes[i].bg = repairChooseItemCol
          cntTypes[i].col = "white"
          cntTypes[i].selected = true
        }
        for (let j = 0; j < repairWidData.contactMethod.length; j++) {
          if (
            cntTypes[i].code === repairWidData.contactMethod[j].code &&
            repairWidData.contactMethod[j].is_enabled &&
            cntTypes[i].code !== "TEXT"
          ) {
            cntQuote.push(cntTypes[i])
            break
          }
        }
      }
      setItemTypes([...cntQuote])
    }
  }, [step, repairWidgetData, repairWidData])

  const toggleItemTypes = (i: number, stepN: string) => {
    if (stepN === "deviceRepairs") {
      const cntTypes: any[] = itemTypes
      if (cntTypes[i].bg === "white") {
        cntTypes[i].bg = repairChooseItemCol
        cntTypes[i].col = "white"
        cntTypes[i].selected = true
      } else {
        cntTypes[i].bg = "white"
        cntTypes[i].col = "black"
        cntTypes[i].selected = false
      }
      setItemTypes([...cntTypes])
      const preChooseRepairs: any[] = []
      for (let i = 0; i < cntTypes.length; i++) {
        if (cntTypes[i].selected) {
          preChooseRepairs.push({
            name: cntTypes[i].name,
            cost: cntTypes[i].cost,
            estimate: cntTypes[i].estimate,
            warranty: cntTypes[i].warranty,
            warranty_unit: cntTypes[i].warranty_unit,
            id: cntTypes[i].id,
          })
        }
      }
      handleChangeChooseData(step, {
        data: preChooseRepairs,
        counter: repairWidgetData.deviceCounter,
      })
    } else {
      const cntItemTypes: any[] = itemTypes
      for (let u = 0; u < cntItemTypes.length; u++) {
        if (u === i) {
          cntItemTypes[u].bg = repairChooseItemCol
          cntItemTypes[u].col = "white"
          cntItemTypes[u].selected = true
          handleChangeChooseData(step, {
            method: cntItemTypes[u].name,
            code: cntItemTypes[u].code,
          })
        } else {
          cntItemTypes[u].bg = "white"
          cntItemTypes[u].col = "black"
          cntItemTypes[u].selected = false
        }
      }
      setItemTypes([...cntItemTypes])
      ChooseNextStep(999)
    }
  }

  useEffect(() => {
    const cntArray: any[] = [],
      cntTypes: any[] = itemTypes
    if (cntTypes && stepName === "deviceRepairs") {
      for (let i = 0; i < cntTypes.length; i++) {
        if (cntTypes[i].bg === repairChooseItemCol) {
          cntArray.push({
            name: cntTypes[i].name,
            estimate: cntTypes[i].estimate,
            cost: cntTypes[i].cost,
            warranty: cntTypes[i].warranty,
            warranty_unit: cntTypes[i].warranty_unit,
            id: cntTypes[i].id,
          })
        }
      }
      setEstimatedTimes([...cntArray])
    }
  }, [itemTypes])

  useEffect(() => {
    setDisableStatus(true)
    if (step === 2 && estimatedTimes.length > 0) {
      setDisableStatus(false)
    }
    if (step === 4 || step === 5) {
      const cntTypes: any[] = itemTypes
      for (let i = 0; i < cntTypes.length; i++) {
        if (cntTypes[i].selected) {
          setDisableStatus(false)
          break
        }
      }
    }
  }, [step, estimatedTimes, itemTypes])

  const NoDataComponent = () => {
    return (
      <p className="non-products-text">
        {t("Didn't find what you are looking for? ")}
        <span
          style={{
            color: mainData.general.colorPalle.textThemeCol,
          }}
          onClick={() => setOpenContactModal(true)}
        >
          {t("Contact us ")}
        </span>
        {t("with the details of the issue(s) affecting your device.")}
      </p>
    )
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography className="service-widget-title">{t(data.title)}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <div className="service-choose-device-container">
              {step < 3 && (
                <div style={{ width: "95%" }}>
                  {features.includes("SEARCH") && (
                    <Search
                      color="rgba(0,0,0,0.8)"
                      bgcolor="white"
                      border="rgba(0,0,0,0.2)"
                      placeholder={t(data.placeholder)}
                      value={searchText}
                      handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChangeSearch(e)
                      }}
                      handleIconClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        await handleClickSearchIcon(e)
                      }}
                    />
                  )}
                </div>
              )}
              <div className="widget-main-container">
                {stepName === "deviceBrand" && (
                  <>
                    {imageData &&
                      imageData.slice(0, sliceNum).map((item: any, index: number) => {
                        return (
                          <div
                            className="device-item-container"
                            style={{
                              background: selected === index ? "rgba(0,0,0,0.1)" : "white",
                            }}
                            key={index}
                            onClick={() => ChooseNextStep(index)}
                          >
                            <LazyImg src={item.img} style={{ width: "80%" }} alt={item.alt} />
                          </div>
                        )
                      })}
                    {plusVisible && (
                      <div className="device-item-container" onClick={handlePlus}>
                        <PlusSVG color="#BDBFC3" />
                      </div>
                    )}
                    {!imageData.length && !loading && <NoDataComponent />}
                  </>
                )}

                {stepName === "deviceModel" && (
                  <>
                    {imageData &&
                      imageData.slice(0, sliceNum).map((item: any, index: number) => {
                        return (
                          <div
                            className="device-item-container"
                            key={index}
                            onClick={() => ChooseNextStep(index)}
                            style={{
                              background: selected === index ? "rgba(0,0,0,0.1)" : "white",
                            }}
                          >
                            <div className="device-model-item">
                              <p className="device-brand-subtitle">{item.name}</p>
                              <LazyImg src={item.img} alt={item.alt} />
                            </div>
                          </div>
                        )
                      })}
                    {plusVisible && (
                      <div className="device-item-container" onClick={handlePlus}>
                        <PlusSVG color="#BDBFC3" />
                      </div>
                    )}
                    {!imageData.length && !loading && <NoDataComponent />}
                  </>
                )}

                {stepName === "repairAnotherDevice" && (
                  <div className="repair-another-device">
                    <Button
                      title={t("Yes")}
                      bgcolor="white"
                      borderR="20px"
                      width="120px"
                      height="30px"
                      fontSize="17px"
                      txcolor="black"
                      onClick={GobackFirst}
                    />
                    <Button
                      title={t("No")}
                      bgcolor="white"
                      borderR="20px"
                      width="120px"
                      height="30px"
                      fontSize="17px"
                      txcolor="black"
                      onClick={GotoNextStep}
                    />
                  </div>
                )}

                {stepName === "deviceRepairs" && (
                  <>
                    {itemTypes &&
                      itemTypes.slice(0, sliceNum).map((item: any, index: number) => {
                        return (
                          <div
                            className="device-item-container"
                            key={index}
                            style={{ backgroundColor: item.bg }}
                            onClick={() => toggleItemTypes(index, stepName)}
                          >
                            <div className="device-service-item">
                              <p style={{ color: item.col }}>{t(item.name)}</p>
                            </div>
                          </div>
                        )
                      })}
                    {plusVisible && (
                      <div className="device-item-container" onClick={handlePlus}>
                        <PlusSVG color="#BDBFC3" />
                      </div>
                    )}
                    {!itemTypes.length && !loading && <NoDataComponent />}
                  </>
                )}

                {(stepName === "dropOffDevicce" || stepName === "receiveQuote") && (
                  <>
                    {itemTypes &&
                      itemTypes.slice(0, sliceNum).map((item: any, index: number) => {
                        return (
                          <div
                            className="device-item-container"
                            key={index}
                            style={{ backgroundColor: item.bg }}
                            onClick={() => toggleItemTypes(index, stepName)}
                          >
                            <div className="device-service-item">
                              <p style={{ color: item.col }}>{t(item.name)}</p>
                            </div>
                          </div>
                        )
                      })}
                  </>
                )}
              </div>
            </div>

            {stepName === "deviceRepairs" && (
              <div className="service-card-button">
                <Button
                  title={t("Next")}
                  bgcolor={mainData.general.colorPalle.nextButtonCol}
                  borderR="20px"
                  width="120px"
                  height="30px"
                  fontSize="17px"
                  onClick={() => ChooseNextStep(999)}
                  disable={disableStatus}
                />
                <p>{t("or press ENTER")}</p>
              </div>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="customized-card-height">
            {step < 2 && (
              <div className="service-choose-device-container">
                <Typography className="topic-title">{t(data.mainTopic.title)}</Typography>
                {data.mainTopic.content &&
                  data.mainTopic.content.map((item: string, index: number) => {
                    return (
                      <Typography className="topic-content" key={index}>
                        {t(item)}
                      </Typography>
                    )
                  })}
                {data.disableTopic.title && (
                  <Typography className="topic-title" style={{ color: "rgba(0,0,0,0.3)" }}>
                    {t(data.disableTopic.title)}
                  </Typography>
                )}
                {data.disableTopic.content && (
                  <Typography className="topic-content" style={{ color: "rgba(0,0,0,0.3)" }}>
                    {t(data.disableTopic.content)}
                  </Typography>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="service-choose-device-container">
                <Typography className="topic-title">{t(data.mainTopic.title)}</Typography>
                <div className="service-summary-content-div" style={{ display: "block" }}>
                  {estimatedTimes &&
                    estimatedTimes.map((item: any, index: number) => {
                      return (
                        <div key={index} className="estimate-times-div">
                          <p className="estimate-title">{t(item.name)}</p>
                          <p className="estimate-content">{item.estimate}</p>
                          {storesDetails.storesDetails.settings.display_repair_cost && (
                            <p className="estimate-content">
                              {`${t(item.cost)} (${t("Prices are plus tax where applicable.")})`}
                            </p>
                          )}
                          {item.warranty && item.warranty > 0 ? (
                            <p className="estimate-content">
                              {t("Warranty") +
                                ": " +
                                item.warranty +
                                " " +
                                t(ConvertWarrantyUnit(item.warranty_unit, item.warranty))}
                            </p>
                          ) : item.warranty && item.warranty === -1 ? (
                            <p className="estimate-content">
                              {t("Warranty") + ": " + t("Lifetime")}
                            </p>
                          ) : (
                            <p className="estimate-content" style={{ color: "grey" }}>
                              <i>{t("No") + " " + t("Warranty")}</i>
                            </p>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="service-choose-device-container">
                <Typography className="topic-title">{t(data.mainTopic.title)}</Typography>
                <Typography className="topic-content">{t(data.mainTopic.content)}</Typography>
              </div>
            )}

            {(stepName === "dropOffDevicce" || stepName === "receiveQuote") && (
              <RepairSummary
                step={step}
                themeCol={themeCol}
                repairWidgetStore={repairWidgetStore}
              />
            )}
          </Card>
        </Grid>
      </Grid>
      <ContactModal
        openModal={openContactModal}
        handleModal={setOpenContactModal}
        storesDetailsStore={storesDetails}
      />
    </div>
  )
}

export default ChooseDevice
