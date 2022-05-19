import React, { useState, useEffect, useCallback } from "react"
import { Grid, Typography } from "@material-ui/core"
import Card from "./Card"
import Button from "../../../components/Button"
import CustomCalendar from "../../../components/CustomCalendar"
import CustomSelect from "../../../components/CustomSelect"
import CustomBookTime from "./CustomBookTime"
import RepairSummary from "./RepairSummary"
import { useTranslation } from "react-i18next"
import { repairWidgetStore, storesDetails } from "../../../store"
import { makeLocations, makeAddressValue, getConvertHourType } from "../../../services/helper"
import { observer } from "mobx-react"
import { findIndex, isEmpty } from "lodash"
import { DAYS_OF_THE_WEEK, MONTHS, deliveryMethodCode } from "../../../const/_variables"

const moment = require("moment-timezone")

type Props = {
  data: any
  step: number
  handleStep: (step: number) => void
  code: string
  handleChangeChooseData: (step: number, chooseData: any) => void
}

type FindLocProps = {
  code: number
  name: string
}

type SelectHoursProps = {
  day: string
  hour: string
}

const BookTime = ({ data, step, code, handleStep, handleChangeChooseData }: Props) => {
  const mainData = storesDetails.storeCnts
  const themeType = mainData.general.themeType
  const themeCol = mainData.general.colorPalle.themeColor
  const repairBooktimeCol = mainData.general.colorPalle.repairBooktimeCol
  const brandThemeCol = mainData.homepage.header.brandData.brandThemeCol

  const [timezone, setTimeZone] = useState(
    !isEmpty(storesDetails.allLocations)
      ? storesDetails.allLocations[0].timezone
      : "America/Winnipeg"
  )
  const [offset, setOffset] = useState(0)
  const [today, setToday] = useState(changeTimezone(new Date(), timezone))
  const [date, setDate] = useState(today)
  const [day, setDay] = useState(date.getDate())
  const [month, setMonth] = useState(date.getMonth())
  const [year, setYear] = useState(date.getFullYear())
  const [week, setWeek] = useState(date.getDay())
  const [time, setTime] = useState("")
  const [selectVal, setSelectVal] = useState({
    code: storesDetails.cntUserLocation.length ? storesDetails.cntUserLocation[0].location_id : -1,
    name: storesDetails.cntUserLocation.length
      ? makeAddressValue(storesDetails.cntUserLocation[0])
      : "",
  })
  const [sendToAddress, setSendToAddress] = useState<FindLocProps>({} as FindLocProps)
  const [mailInChecked, setMailinChecked] = useState(0)
  const [disableStatus, setDisableStatus] = useState(true)

  const [t] = useTranslation()

  const [findLocs, setFindLocs] = useState<FindLocProps[]>([])
  const [selHours, setSelHours] = useState<SelectHoursProps[]>([])

  useEffect(() => {
    const locIndex = findIndex(storesDetails.allLocations, { id: selectVal.code })
    if (locIndex > -1) {
      const cntTimeZone = storesDetails.allLocations[locIndex].timezone
      setTimeZone(cntTimeZone)
      setOffset(moment().tz(cntTimeZone).utcOffset() / 60)
    }
  }, [selectVal])

  useEffect(() => {
    const cntFindLoc: FindLocProps[] = []
    const storeLocs: any[] = storesDetails.findAddLocation
    for (let i = 0; i < storeLocs.length; i++) {
      cntFindLoc.push({
        code: storeLocs[i].id,
        name: makeAddressValue(storeLocs[i]),
      })
    }
    setFindLocs(cntFindLoc)
  }, [storesDetails])

  useEffect(() => {
    const cntSelHours: SelectHoursProps[] = []
    const storeLocs: any[] = storesDetails.findAddLocation
    const i: number = mailInChecked
    if (storeLocs.length > i && storeLocs[i].location_hours.length) {
      storeLocs[i].location_hours.forEach((item: any) => {
        if (item.type === "REGULAR") {
          let hour = ""
          if (!item.open || !item.close) {
            hour = t("Closed")
          } else {
            const open = getConvertHourType(
              item.open,
              storeLocs[i].timezone,
              repairWidgetStore.timezone
            )
            const close = getConvertHourType(
              item.close,
              storeLocs[i].timezone,
              repairWidgetStore.timezone
            )
            hour = open + " - " + close
          }
          cntSelHours.push({
            day: DAYS_OF_THE_WEEK[item.day],
            hour: hour,
          })
        }
      })
    }
    setSelHours(cntSelHours)
  }, [mailInChecked, storesDetails])

  useEffect(() => {
    setDay(date.getDate())
    setMonth(date.getMonth())
    setYear(date.getFullYear())
    setWeek(date.getDay())
    setTime("")
  }, [date])

  useEffect(() => {
    setToday(changeTimezone(new Date(), timezone))
  }, [timezone])

  useEffect(() => {
    if (code === deliveryMethodCode.mailin && storesDetails.cntUserLocation.length) {
      setSendToAddress({
        name: makeAddressValue(storesDetails.cntUserLocation[0]),
        code: storesDetails.cntUserLocation[0].id,
      })
      for (let i = 0; i < findLocs.length; i++) {
        if (findLocs[i].code === storesDetails.cntUserLocation[0].id) {
          setMailinChecked(i)
        }
      }
    }
  }, [findLocs])

  const handleChangeMailinAddress = (val: FindLocProps, i: number) => {
    setMailinChecked(i)
    setSendToAddress(val)
    handleUpdateStore(val)
  }

  function changeTimezone(date: Date, ianatz: string) {
    const invdate = new Date(
      date.toLocaleString("en-US", {
        timeZone: ianatz,
      })
    )
    const diff = date.getTime() - invdate.getTime()
    return new Date(date.getTime() - diff)
  }

  const ChooseNextStep = () => {
    if (code === deliveryMethodCode.mailin) {
      handleChangeChooseData(7, { code: code, data: { sendTo: sendToAddress.name } })
    } else {
      handleChangeChooseData(7, {
        code: code,
        data: {
          address: { name: selectVal.name, code: selectVal.code },
          time: time,
          day: day,
          month: t(MONTHS[month]),
          year: year,
          week: t(DAYS_OF_THE_WEEK[week]),
          timezone: offset,
        },
      })
      handleChangeSelectTime(time)
    }
    handleStep(step + 1)
  }

  const handleChangeSelectTime = (val: string) => {
    if (!val) return
    const ptrVal: any[] = val.split(" ")
    let hr = 9,
      min = ""
    if (ptrVal[1] === "AM" || (ptrVal[1] === "PM" && ptrVal[0].split(":")[0] === "12")) {
      hr = ptrVal[0].split(":")[0]
    } else {
      hr = parseInt(ptrVal[0].split(":")[0]) + 12
    }
    min = ptrVal[0].split(":")[1]
    const repairSelectedTime: any = {
      selectDate: year + "-" + (month + 1) + "-" + day,
      selected_start_time: hr + ":" + min,
      selected_end_time: null,
    }
    repairWidgetStore.changeRepairWidgetInitialValue(repairSelectedTime)
    // repairWidgetStore.changeTimezone(storesDetails.cntUserLocation[0].timezone)
  }

  const onKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !disableStatus && step === 7) {
        ChooseNextStep()
      }
    },
    [step, code, sendToAddress, time, day, month, year, week, disableStatus]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step, code, sendToAddress, time, day, month, year, week, disableStatus, selectVal])

  useEffect(() => {
    setDisableStatus(true)
    if (code === deliveryMethodCode.mailin && !isEmpty(sendToAddress)) {
      setDisableStatus(false)
    }
    if (
      code !== deliveryMethodCode.mailin &&
      selectVal.name &&
      time &&
      day &&
      MONTHS[month] &&
      year &&
      DAYS_OF_THE_WEEK[week]
    ) {
      setDisableStatus(false)
    }
  }, [code, sendToAddress, time, day, month, year, week, selectVal])

  useEffect(() => {
    const val: FindLocProps = {
      name: makeAddressValue(storesDetails.cntUserLocation[0]),
      code: storesDetails.cntUserLocation[0].id,
    }
    if (code !== deliveryMethodCode.mailin) {
      setSelectVal(val)
    } else {
      setSendToAddress(val)
    }
    updateTimezoneFromSelVal(val)
  }, [storesDetails.cntUserLocation])

  const handleUpdateStore = (selVal: FindLocProps) => {
    const locIndex = findIndex(storesDetails.findAddLocation, (o) => o.id === selVal.code)
    if (locIndex > -1) {
      const cntLoc: any = makeLocations([storesDetails.findAddLocation[locIndex]])
      storesDetails.changeCntUserLocation(cntLoc)
      storesDetails.changeLocationID(storesDetails.findAddLocation[locIndex].id)
      updateTimezoneFromSelVal(selVal)
    }
  }

  const updateTimezoneFromSelVal = (selVal: FindLocProps) => {
    const locIndex = findIndex(storesDetails.findAddLocation, (o) => o.id === selVal.code)
    if (locIndex > -1) {
      const cntTimeZone = storesDetails.findAddLocation[locIndex].timezone
      setTimeZone(cntTimeZone)
      setOffset(moment().tz(cntTimeZone).utcOffset() / 60)
    }
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography className="service-widget-title">{t(data.title[code])}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card className="booking-card">
            <div className="service-choose-device-container">
              {
                <Typography className="service-summary-title">
                  {t(data.select.location.title[code])}
                </Typography>
              }
              <div style={{ marginBottom: "20px" }}>
                {code !== deliveryMethodCode.mailin && !isEmpty(selectVal) && !isEmpty(findLocs) && (
                  <CustomSelect
                    value={selectVal}
                    handleSetValue={(val) => {
                      handleUpdateStore(val)
                      setSelectVal(val)
                    }}
                    options={findLocs}
                  />
                )}
                {code === deliveryMethodCode.mailin && (
                  <div>
                    {findLocs.map((item: FindLocProps, index: number) => {
                      return (
                        <div key={index} className="select-mail-in-radio">
                          <input
                            type="radio"
                            id={`radio ${index}`}
                            name="region"
                            value={item.name}
                            onChange={() => {
                              handleChangeMailinAddress(item, index)
                            }}
                            checked={index === mailInChecked}
                          />
                          <label htmlFor={`radio ${index}`}>{item.name}</label>
                        </div>
                      )
                    })}
                    <div className="select-mail-in-container">
                      <div>
                        <u>
                          <p className="select-mail-in-text">{t("Hours")}</p>
                        </u>
                      </div>
                    </div>
                    {selHours.map((item: any, index: number) => {
                      return (
                        <div key={index} className="select-mail-in-container">
                          <div style={{ width: "50%" }}>
                            <p className="select-mail-in-text">{t(item.day)}</p>
                          </div>
                          <div style={{ width: "50%" }}>
                            <p className="select-mail-in-text">{item.hour}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              {code !== deliveryMethodCode.mailin && (
                <Typography className="service-summary-title">
                  {t(data.select.time.title[code])}
                </Typography>
              )}
              {code !== deliveryMethodCode.mailin && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomCalendar handleParentDate={setDate} timezone={timezone} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomBookTime
                      themeCol={themeCol}
                      brandThemeCol={brandThemeCol}
                      repairBooktimeCol={repairBooktimeCol}
                      title={t(DAYS_OF_THE_WEEK[week]) + ", " + t(MONTHS[month]) + " " + day}
                      changeBooktime={setTime}
                      selectYear={year}
                      selectMonth={month}
                      selectDay={day}
                      offset={offset}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      className="selected-time-text"
                    >
                      {time ? (
                        <p style={{ textAlign: "center", margin: "0 10px" }}>
                          {t("You've selected")} {time} {t("on")} {t(DAYS_OF_THE_WEEK[week])},{" "}
                          {t(MONTHS[month])} {day}, {year}
                        </p>
                      ) : (
                        <p style={{ textAlign: "center", margin: "0 10px" }}>
                          {t("You did not select time yet.")}
                        </p>
                      )}
                    </div>
                  </Grid>
                </Grid>
              )}
            </div>
            <div className="service-card-button">
              <Button
                title={t("Next")}
                bgcolor={mainData.general.colorPalle.nextButtonCol}
                borderR={themeType === "marnics" ? "0" : "20px"}
                width="120px"
                height="30px"
                fontSize="17px"
                onClick={ChooseNextStep}
                disable={disableStatus}
              />
              <p>{t("or press ENTER")}</p>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="service-summary-card">
            <RepairSummary themeCol={themeCol} />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default observer(BookTime)
