import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { availableTimeRange, isWeek, isPast, convertTimeRange } from "../../../services/helper"
import moment from "moment-timezone"
import { observer } from "mobx-react"
import { storesDetails } from "../../../store"

type Props = {
  themeCol?: string
  brandThemeCol?: string
  repairBooktimeCol?: string
  title: string
  changeBooktime: (mark: string) => void
  selectYear: number
  selectMonth: number
  selectDay: number
  hoursRange: any[]
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
  hoursRange,
  offset,
}: Props) => {
  const interval = 30,
    multi = 60 * 1000
  const [bookArray, setBookArray] = useState<ArrayProps[]>([])
  const [t] = useTranslation()

  const [timezoneIDs, setTimezoneIDs] = useState<any[]>([])
  const [valTimezone, setValTimezone] = useState<any>({
    value: storesDetails.cntUserLocation[0].timezone,
    label: storesDetails.cntUserLocation[0].timezone,
  })

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
    console.log("valTimezone", valTimezone, storesDetails.cntUserLocation[0].timezone)
  }, [storesDetails.cntUserLocation, valTimezone])

  useEffect(() => {
    const timesRng = convertTimeRange(hoursRange)
    const cntTimeStamp = new Date(selectYear, selectMonth, selectDay).getTime(),
      booklist: any[] = [],
      week = isWeek(selectYear, selectMonth, selectDay),
      availRange: any[] = availableTimeRange(timesRng[week][0], timesRng[week][1], interval, multi)
    const timeoffset = -new Date().getTimezoneOffset() / 60

    if (!availRange.includes("Closed")) {
      for (let i = 0; i < availRange.length - 1; i++) {
        const cntbookStamp = cntTimeStamp + availRange[i] + (timeoffset - offset) * 3600 * 1000
        const cntbook = new Date(cntbookStamp)
        const mark = cntbook.getHours() >= 12 ? "PM" : "AM",
          markMin = cntbook.getMinutes() === 0 ? "00" : cntbook.getMinutes(),
          markHour = cntbook.getHours() % 12 === 0 ? 12 : cntbook.getHours() % 12
        let past = false
        if (i > 0 && cntbook.getHours() === 0 && booklist[0].book !== "12:00 AM") {
          past = isPast(
            selectYear,
            selectMonth,
            selectDay + 1,
            // offset,
            cntbook.getHours(),
            cntbook.getMinutes()
          )
        } else {
          past = isPast(
            selectYear,
            selectMonth,
            selectDay,
            // offset,
            cntbook.getHours(),
            cntbook.getMinutes()
          )
        }
        booklist.push({
          book: markHour + ":" + markMin + " " + mark,
          isPast: past ? true : false,
          color: past ? "rgba(0,0,0,0.2)" : repairBooktimeCol,
          bgColor: "white",
          borderCol: past ? "rgba(0,0,0,0.2)" : repairBooktimeCol,
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
  }, [selectYear, selectMonth, selectDay, hoursRange])

  const handleBook = (n: number) => {
    const cntBookArray: any[] = bookArray
    if (cntBookArray[n].isPast) return
    for (let i = 0; i < cntBookArray.length; i++) {
      if (i === n) {
        cntBookArray[i].color = "white"
        cntBookArray[i].bgColor = repairBooktimeCol
        cntBookArray[i].borderCol = repairBooktimeCol
      } else {
        cntBookArray[i].color = cntBookArray[i].isPast ? "rgba(0,0,0,0.2)" : repairBooktimeCol
        cntBookArray[i].borderCol = cntBookArray[i].isPast ? "rgba(0,0,0,0.2)" : repairBooktimeCol
        cntBookArray[i].bgColor = "white"
      }
    }
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
