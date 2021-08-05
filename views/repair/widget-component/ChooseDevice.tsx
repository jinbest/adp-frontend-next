import React, { useState, useEffect } from "react"
import Card from "./Card"
import PlusSVG from "./PlusSVG"
import LazyImg from "./LazyImg"
import { Grid, Typography } from "@material-ui/core"
import Search from "../../../components/Search"
import Button from "../../../components/Button"
import RepairSummary from "./RepairSummary"
import { useTranslation } from "react-i18next"
import { repairWidData, repairWidgetStore, storesDetails } from "../../../store/"
import {
  getDeviceBrandsAPI,
  addMoreDeviceBrandsAPI,
  getBrandProductsAPI,
  addMoreBrandProductsAPI,
  getRepairsOfferedDeviceAPI,
  addMoreRepairsOfferedDeviceAPI,
} from "../RepairWidgetCallAPI"
import ContactModal from "../../business/ContactModal"
import { ConvertWarrantyUnit } from "../../../services/helper"
import CustomSelect from "../../../components/CustomSelect"
import { SelectParams, FilterParams } from "../../../model/select-dropdown-param"
import _, { capitalize, isEmpty } from "lodash"
import { GetProductsParam } from "../../../model/get-products-params"
import { GetBrandsParam } from "../../../model/get-brands-params"
import { repairWidgetStepName } from "../../../const/_variables"
import { repairWidgetAPI } from "../../../services"
import ReactTooltip from "react-tooltip"

type Props = {
  data: any
  stepName: string
  step: number
  handleStep: (step: number) => void
  handleChangeChooseData: (step: number, chooseData: any) => void
  repairWidgetData: any
  features: any[]
  categoryName: string | null
  categoryID: number
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
  categoryName,
  categoryID,
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
  const [filter, setFilter] = useState<SelectParams>({ name: "All", code: "0" } as SelectParams)
  const [category_id, setCategoryID] = useState(categoryID)
  const [filterList, setFileterList] = useState<SelectParams[]>([
    { name: "All", code: "0" },
  ] as SelectParams[])

  const getFilterList = async (cateName?: string) => {
    const result = {
      category_id: category_id,
      filter: { code: "0", name: "All" } as SelectParams,
    }
    const params: FilterParams = {
      page: 1,
      per_page: 100,
      include_voided: false,
      display_sort_order: "asc",
    }
    if (cateName) {
      params.name = cateName
    }
    const filterData: any = await repairWidgetAPI.filterCategories(
      storesDetails.storesDetails.settings.store_id,
      params
    )
    const tmpFilterList: SelectParams[] = [] as SelectParams[]
    tmpFilterList.push({ name: "All", code: "0" })
    filterData.data.forEach((item: any) => {
      tmpFilterList.push({
        name: item.name,
        code: item.id.toString(),
      })
    })
    setFileterList(tmpFilterList)
    if (categoryName) {
      const cateIndex = _.findIndex(tmpFilterList, (o) => o.name === categoryName)
      if (cateIndex > -1) {
        setFilter(tmpFilterList[cateIndex])
        setCategoryID(Number(tmpFilterList[cateIndex].code))
        result.filter = tmpFilterList[cateIndex]
      }
    }
    if (cateName && filterData.data.length) {
      result.category_id = filterData.data[0].id
    }
    return result
  }

  const [t] = useTranslation()

  const handlePlus = async () => {
    const cntImgData: any[] = [],
      cntTypes: any[] = []
    let cntOfferedRepairs: any[] = []
    switch (stepName) {
      case repairWidgetStepName.deviceBrand:
        const paramsBrand: GetBrandsParam = {
          name: searchText,
          page: page + 1,
          per_page: perPage,
        }
        if (category_id > 0) {
          paramsBrand.category_id = category_id
        }
        await addMoreDeviceBrandsAPI(paramsBrand)
        if (repairWidData.repairDeviceBrands.data && repairWidData.repairDeviceBrands.data.length) {
          setSliceNum(repairWidData.repairDeviceBrands.data.length)
          if (repairWidData.repairDeviceBrands.metadata.total <= (page + 1) * perPage) {
            setPlusVisible(false)
          } else {
            setPlusVisible(true)
          }
          repairWidData.repairDeviceBrands.data.forEach((item: any) => {
            cntImgData.push({
              name: item.name,
              img: item.img_src,
              id: item.id,
              alt: item.img_alt,
            })
          })
        }
        break
      case repairWidgetStepName.deviceModel:
        const paramsModel: GetProductsParam = {
          brand_id: repairWidData.cntBrandID,
          name: searchText,
          page: page + 1,
          per_page: perPage,
        }
        if (category_id > 0) {
          paramsModel.category_id = category_id
        }
        await addMoreBrandProductsAPI(paramsModel)
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
          repairWidData.repairBrandProducts.data.forEach((item: any) => {
            cntImgData.push({
              name: item.name,
              img: item.img_src,
              id: item.id,
              alt: item.img_alt,
            })
          })
        }
        break
      case repairWidgetStepName.deviceRepairs:
        await addMoreRepairsOfferedDeviceAPI(
          repairWidData.cntProductID,
          searchText,
          page + 1,
          perPage
        )
        cntOfferedRepairs = _.cloneDeep(repairWidData.repairsOfferedDevices.data)
        setSliceNum(repairWidData.repairsOfferedDevices.data.length)
        if (repairWidData.repairsOfferedDevices.metadata.total <= (page + 1) * perPage) {
          setPlusVisible(false)
        } else {
          setPlusVisible(true)
        }
        cntOfferedRepairs.forEach((item: any) => {
          cntTypes.push({
            name: item.title,
            bg: "white",
            col: "black",
            estimate: item.duration,
            selected: false,
            cost: item.cost,
            warranty: item.warranty,
            warranty_unit: item.warranty_unit,
            id: item.id,
            img_src: item.img_src,
          })
        })
        cntTypes.forEach((itType: any) => {
          repairWidgetData.chooseRepair.forEach((item: any) => {
            if (itType.name === item.name) {
              itType.bg = repairChooseItemCol
              itType.col = "white"
              itType.selected = true
            }
          })
        })
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
    setSearchText("")
    handleChangeChooseData(step, imageData[i])
    switch (stepName) {
      case repairWidgetStepName.deviceBrand:
        repairWidData.changeCntBrandID(imageData[i].id)
        handleStep(step + 1)
        break
      case repairWidgetStepName.deviceModel:
        repairWidData.changeCntProductID(imageData[i].id)
        handleStep(step + 1)
        break
      default:
        break
    }
  }

  const onKeyPress = async (event: any) => {
    if (event.key === "Enter" && (step === 0 || step === 1 || step === 2)) {
      await loadFilterData(event.target.value, 1, page * perPage, category_id)
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
    await loadFilterData(searchText, 1, page * perPage, category_id)
  }

  const loadFilterData = async (text: string, pg: number, perpg: number, code: number) => {
    setLoading(true)
    const cntImgData: any[] = []
    const paramModel: GetProductsParam = {
      brand_id: repairWidData.cntBrandID,
      name: text,
      page: pg,
      per_page: perpg,
    }
    if (Number(code) > 0) {
      paramModel.category_id = code
    }
    await getBrandProductsAPI(paramModel)
    if (repairWidData.repairBrandProducts.data && repairWidData.repairBrandProducts.data.length) {
      setSliceNum(repairWidData.repairBrandProducts.data.length)
      repairWidData.repairBrandProducts.data.forEach((item: any) => {
        cntImgData.push({
          name: item.name,
          img: item.img_src,
          id: item.id,
          alt: item.img_alt,
        })
      })
    }
    if (repairWidData.repairBrandProducts.metadata.total <= pg * perpg) {
      setPlusVisible(false)
    } else {
      setPlusVisible(true)
    }
    setImageData(cntImgData)
    setLoading(false)
  }

  const loadStepData = async (name: string, text: string, pg: number, perpg: number) => {
    setLoading(true)
    let catID = category_id,
      result = {} as any
    if (name === repairWidgetStepName.deviceBrand && categoryName) {
      result = await getFilterList(categoryName)
      catID = result.category_id
    } else if (name === repairWidgetStepName.deviceModel) {
      result = await getFilterList()
    }
    const cntImgData: any[] = [],
      cntTypes: any[] = []
    let cntOfferedRepairs: any[] = []
    switch (name) {
      case repairWidgetStepName.deviceBrand:
        const paramBrand: GetBrandsParam = {
          name: text,
          page: pg,
          per_page: perpg,
          category_id: catID,
        }
        await getDeviceBrandsAPI(paramBrand)
        if (repairWidData.repairDeviceBrands.data && repairWidData.repairDeviceBrands.data.length) {
          setSliceNum(repairWidData.repairDeviceBrands.data.length)
          repairWidData.repairDeviceBrands.data.forEach((item: any) => {
            cntImgData.push({
              name: item.name,
              img: item.img_src,
              id: item.id,
              alt: item.img_alt,
            })
          })
        }
        if (repairWidData.repairDeviceBrands.metadata.total <= pg * perpg) {
          setPlusVisible(false)
        } else {
          setPlusVisible(true)
        }
        break
      case repairWidgetStepName.deviceModel:
        if (categoryName) {
          loadFilterData(text, pg, perpg, result.filter.code)
          break
        }
        const paramModel: GetProductsParam = {
          brand_id: repairWidData.cntBrandID,
          name: text,
          page: pg,
          per_page: perpg,
        }
        if (category_id > 0) {
          paramModel.category_id = category_id
          await getBrandProductsAPI(paramModel)
        } else {
          paramModel.category_id = catID
          await getBrandProductsAPI(paramModel)
        }
        if (
          repairWidData.repairBrandProducts.data &&
          repairWidData.repairBrandProducts.data.length
        ) {
          setSliceNum(repairWidData.repairBrandProducts.data.length)
          repairWidData.repairBrandProducts.data.forEach((item: any) => {
            cntImgData.push({
              name: item.name,
              img: item.img_src,
              id: item.id,
              alt: item.img_alt,
            })
          })
        }
        if (repairWidData.repairBrandProducts.metadata.total <= pg * perpg) {
          setPlusVisible(false)
        } else {
          setPlusVisible(true)
        }
        break
      case repairWidgetStepName.deviceRepairs:
        await getRepairsOfferedDeviceAPI(repairWidData.cntProductID, text, pg, perpg)
        cntOfferedRepairs = _.cloneDeep(repairWidData.repairsOfferedDevices.data)

        if (cntOfferedRepairs != null && cntOfferedRepairs.length) {
          setSliceNum(repairWidData.repairsOfferedDevices.data.length)
          cntOfferedRepairs.forEach((item: any) => {
            cntTypes.push({
              name: item.title,
              bg: "white",
              col: "black",
              estimate: item.duration,
              selected: false,
              cost: item.cost,
              warranty: item.warranty,
              warranty_unit: item.warranty_unit,
              id: item.id,
              img_src: item.img_src,
            })
          })
          if (!isEmpty(repairWidgetStore.repairBySearch)) {
            const chooseIndex = _.findIndex(cntTypes, { id: repairWidgetStore.repairBySearch.id })
            if (chooseIndex > -1) {
              cntTypes[chooseIndex].bg = repairChooseItemCol
              cntTypes[chooseIndex].col = "white"
              cntTypes[chooseIndex].selected = true
              const cntChooseRepair = _.cloneDeep(repairWidgetStore.chooseRepair)
              cntChooseRepair.push([repairWidgetStore.repairBySearch])
              repairWidgetStore.changeChooseRepair(cntChooseRepair)
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
    loadStepData(stepName, searchText, initPage, initPerPage)
  }, [data, stepName, repairWidData])

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step, disableStatus, page, perPage, filter])

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
        ? _.cloneDeep(repairWidData.apiDropOffDevices.types)
        : []
      const cntAvailableDeliveryMethod: any[] = _.cloneDeep(repairWidData.repairDeliveryMethod)

      cntDeliverySets.forEach((itDeliverySet: any) => {
        cntAvailableDeliveryMethod.forEach((itAvailMethod: any) => {
          if (itDeliverySet.code === itAvailMethod.code && itAvailMethod.is_enabled) {
            cntTypes.push(itDeliverySet)
            return
          }
        })
      })
      cntTypes.forEach((item: any) => {
        item.bg = "white"
        item.col = "black"
        item.selected = false
        if (item.name === repairWidgetData.deliveryMethod.method) {
          item.bg = repairChooseItemCol
          item.col = "white"
          item.selected = true
        }
      })
      setItemTypes([...cntTypes])
    } else if (step === 5) {
      const cntQuote: any[] = [],
        cntTypes: any[] = repairWidData.receiveQuote.types.length
          ? _.cloneDeep(repairWidData.receiveQuote.types)
          : []
      if (cntTypes.length) {
        cntTypes.forEach((itType: any) => {
          itType.bg = "white"
          itType.col = "black"
          itType.selected = false
          if (itType.name === repairWidgetData.receiveQuote.method) {
            itType.bg = repairChooseItemCol
            itType.col = "white"
            itType.selected = true
          }
          if (repairWidData.contactMethod !== null && repairWidData.contactMethod.length) {
            repairWidData.contactMethod.forEach((itMethod: any) => {
              if (itType.code === itMethod.code && itMethod.is_enabled && itType.code !== "TEXT") {
                cntQuote.push(itType)
              }
            })
          }
        })
      }
      setItemTypes([...cntQuote])
    }
  }, [step, repairWidgetData, repairWidData])

  const toggleItemTypes = (i: number, stepN: string) => {
    if (stepN === repairWidgetStepName.deviceRepairs) {
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
      if (cntTypes.length) {
        cntTypes.forEach((item: any) => {
          if (item.selected) {
            preChooseRepairs.push({
              name: item.name,
              cost: item.cost,
              estimate: item.estimate,
              warranty: item.warranty,
              warranty_unit: item.warranty_unit,
              id: item.id,
              img_src: item.img_src,
            })
          }
        })
      }
      handleChangeChooseData(step, {
        data: preChooseRepairs,
        counter: repairWidgetData.deviceCounter,
      })
    } else {
      const cntItemTypes: any[] = itemTypes
      if (cntItemTypes.length) {
        cntItemTypes.forEach((item: any, idx: number) => {
          if (idx === i) {
            item.bg = repairChooseItemCol
            item.col = "white"
            item.selected = true
            handleChangeChooseData(step, {
              method: item.name,
              code: item.code,
            })
          } else {
            item.bg = "white"
            item.col = "black"
            item.selected = false
          }
        })
      }
      setItemTypes([...cntItemTypes])
      ChooseNextStep(999)
    }
  }

  useEffect(() => {
    const cntArray: any[] = [],
      cntTypes: any[] = itemTypes
    if (cntTypes.length && stepName === repairWidgetStepName.deviceRepairs) {
      cntTypes.forEach((item: any) => {
        if (item.bg === repairChooseItemCol) {
          cntArray.push({
            name: item.name,
            estimate: item.estimate,
            cost: item.cost,
            warranty: item.warranty,
            warranty_unit: item.warranty_unit,
            id: item.id,
            img_src: item.img_src,
          })
        }
      })
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
      if (cntTypes.length) {
        cntTypes.forEach((item: any) => {
          if (item.selected) {
            setDisableStatus(false)
            return
          }
        })
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
              {stepName === repairWidgetStepName.deviceRepairs && (
                <p className="info-text-for-services">{t("You can select multiple services")}</p>
              )}
              {stepName !== repairWidgetStepName.deviceBrand && step < 3 && (
                <div className="search-bar-container">
                  {stepName === repairWidgetStepName.deviceModel && filterList.length ? (
                    <div style={{ marginRight: "5px", minWidth: "120px" }}>
                      <CustomSelect
                        value={filter}
                        handleSetValue={(value: SelectParams) => {
                          setFilter({ name: value.name, code: value.code })
                          setCategoryID(Number(value.code))
                          loadFilterData(searchText, 1, 10, Number(value.code))
                        }}
                        options={filterList}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
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
                {stepName === repairWidgetStepName.deviceBrand && (
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
                            {/* <LazyImg src={item.img} style={{ width: "80%" }} alt={item.alt} /> */}
                            <p className="repair-widget-brand-name">{capitalize(item.name)}</p>
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

                {stepName === repairWidgetStepName.deviceModel && (
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

                {stepName === repairWidgetStepName.repairAnotherDevice && (
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

                {stepName === repairWidgetStepName.deviceRepairs && (
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
                            <div
                              className="device-service-item"
                              data-tip
                              data-for={`repair-${item.id}`}
                            >
                              {item.img_src ? (
                                <img
                                  src={item.img_src}
                                  alt={item.name}
                                  style={{ maxWidth: "100%" }}
                                />
                              ) : (
                                <p style={{ color: item.col }}>{t(item.name)}</p>
                              )}
                            </div>
                            {item.img_src && (
                              <ReactTooltip id={`repair-${item.id}`} place="top" effect="solid">
                                {item.name}
                              </ReactTooltip>
                            )}
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

                {(stepName === repairWidgetStepName.dropOffDevicce ||
                  stepName === repairWidgetStepName.receiveQuote) && (
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

            {stepName === repairWidgetStepName.deviceRepairs && (
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

            {(stepName === repairWidgetStepName.dropOffDevicce ||
              stepName === repairWidgetStepName.receiveQuote) && (
              <RepairSummary themeCol={themeCol} />
            )}
          </Card>
        </Grid>
      </Grid>
      <ContactModal openModal={openContactModal} handleModal={setOpenContactModal} />
    </div>
  )
}

export default ChooseDevice
