import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { isWeek, isPast, availTimeRange } from "../../../services/helper"
import moment from "moment-timezone"
import { observer } from "mobx-react"
import { repairWidgetStore, storesDetails } from "../../../store"

type Props = {
  themeCol?: string
  brandThemeCol?: string
  repairBooktimeCol?: string
  title: string
  changeBooktime: (mark: string) => void
  selectYear: number
  selectMonth: number
  selectDay: number
  offset: number
}

type ArrayProps = {
  array: any[]
}

const CustomBookTime = ({
  title,
  selectYear,
  selectMonth,
  selectDay,
  repairBooktimeCol,
  changeBooktime,
  offset,
}: Props) => {
  const interval = 30,
    multi = 60 * 1000
  const [bookArray, setBookArray] = useState<ArrayProps[]>([])
  const [t] = useTranslation()

  const themeType = storesDetails.storeCnts.general.themeType

  const [timezoneIDs, setTimezoneIDs] = useState<any[]>([])
  const [valTimezone, setValTimezone] = useState<any>({
    value: repairWidgetStore.timezone,
    label: repairWidgetStore.timezone,
  })
  const [selOffset, setSelOffset] = useState(offset)

  useEffect(() => {
    setTimezoneIDs(
      moment.tz.names().map((val) => ({
        value: val,
        label: val,
      }))
    )
  }, [])

  const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValTimezone({
      value: e.target.value,
      label: e.target.value,
    })
  }

  useEffect(() => {
    setSelOffset(moment().tz(valTimezone.value).utcOffset() / 60)
    repairWidgetStore.changeTimezone(valTimezone.value)
  }, [valTimezone])

  useEffect(() => {
    const cntTimeStamp = new Date(selectYear, selectMonth, selectDay).getTime(),
      booklist: any[] = [],
      week = isWeek(selectYear, selectMonth, selectDay)

    const loc_hours = storesDetails.cntUserLocation.length
      ? storesDetails.cntUserLocation[0].loc_hours
      : []
    const availableRange: any[] =
      loc_hours && loc_hours.length
        ? availTimeRange(loc_hours[week].open, loc_hours[week].close, interval, multi)
        : []

    if (!availableRange.includes("Closed")) {
      for (let i = 0; i < availableRange.length - 1; i++) {
        const cntbookStamp = cntTimeStamp + availableRange[i] + (selOffset - offset) * 3600 * 1000
        const cntbook = new Date(cntbookStamp)
        const mark = cntbook.getHours() >= 12 ? "PM" : "AM",
          markMin = cntbook.getMinutes() === 0 ? "00" : cntbook.getMinutes(),
          markHour = cntbook.getHours() % 12 === 0 ? 12 : cntbook.getHours() % 12
        let past = false
        past = isPast(
          cntbook.getFullYear(),
          cntbook.getMonth(),
          cntbook.getDate(),
          selOffset,
          cntbook.getHours(),
          cntbook.getMinutes()
        )
        booklist.push({
          book: markHour + ":" + markMin + " " + mark,
          isPast: past ? true : false,
          color: past ? "rgba(0,0,0,0.2)" : (themeType === "marnics" ? "#333" : repairBooktimeCol),
          bgColor: "white",
          borderCol: past ? "rgba(0,0,0,0.2)" : (themeType === "marnics" ? "#333" : repairBooktimeCol),
        })
      }
    } else {
      booklist.push({
        book: "Closed",
        isPast: true,
        color: "rgba(0,0,0,0.2)",
        bgColor: "white",
        borderCol: "rgba(0,0,0,0.2)",
      })
    }
    setBookArray([...booklist])
  }, [selectYear, selectMonth, selectDay, selOffset, storesDetails.cntUserLocation, offset])

  const handleBook = (n: number) => {
    const cntBookArray: any[] = bookArray
    if (cntBookArray[n].isPast) return
    cntBookArray.forEach((item: any, idx: number) => {
      if (idx === n) {
        item.color = "white"
        item.bgColor = repairBooktimeCol
        item.borderCol = repairBooktimeCol
      } else {
        item.color = item.isPast ? "rgba(0,0,0,0.2)" : (themeType === "marnics" ? "#333" : repairBooktimeCol)
        item.borderCol = item.isPast ? "rgba(0,0,0,0.2)" : (themeType === "marnics" ? "#333" : repairBooktimeCol)
        item.bgColor = "white"
      }
    })
    changeBooktime(cntBookArray[n].book)
    setBookArray([...cntBookArray])
  }

  return (
    <div className="custom-book-time">
      <p>{title}</p>
      <div className="booking-list">
        {bookArray.map((item: any, index: number) => {
          return (
            <div
              key={index}
              style={{
                border: `1px solid ${item.borderCol}`,
                color: item.color,
                backgroundColor: item.bgColor,
              }}
              className="booking-item"
              onClick={() => {
                handleBook(index)
              }}
            >
              {item.book === "Closed" ? t(item.book) : item.book}
            </div>
          )
        })}
      </div>
      {timezoneIDs.length && (
        <div>
          <select
            className="booking-select-timezone"
            value={valTimezone.value}
            onChange={handleChangeOption}
          >
            {timezoneIDs.map((item: any, index: number) => {
              return (
                <option value={item.value} key={index}>
                  {item.label}
                </option>
              )
            })}
          </select>
        </div>
      )}
    </div>
  )
}

export default observer(CustomBookTime)
