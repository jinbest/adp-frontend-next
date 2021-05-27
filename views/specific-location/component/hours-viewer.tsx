import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { getRegularHours, getConvertHourType } from "../../../services/helper"
import { StoreLocation } from "../../../model/store-location"
import { observer } from "mobx-react"
import { repairWidgetStore } from "../../../store"

const DAYS_OF_THE_WEEK: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

type Props = {
  location: StoreLocation
}

const HoursViewer = ({ location }: Props) => {
  const classes = useStyles()
  const [t] = useTranslation()

  return (
    <>
      <Typography className={classes.cardTitle}>{t("Hours")}</Typography>
      {location.location_hours?.length ? (
        <>
          {getRegularHours(location.location_hours).map((it, index) => (
            <div key={index} className={classes.container}>
              <div className={classes.weekday}>
                <Typography className={classes.cardText}>{t(DAYS_OF_THE_WEEK[it.day])}</Typography>
              </div>
              <div className={classes.time}>
                <Typography className={classes.cardText}>
                  {!it.open || !it.close
                    ? it.by_appointment_only
                      ? t("Call to book appointment")
                      : t("Closed")
                    : getConvertHourType(it.open, location.timezone, repairWidgetStore.timezone) +
                      "-" +
                      getConvertHourType(it.close, location.timezone, repairWidgetStore.timezone)}
                </Typography>
              </div>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default observer(HoursViewer)

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      width: "100%",
      marginBottom: "5px",
    },
    weekday: {
      width: "40%",
      margin: 0,
      padding: 0,
    },
    time: {
      width: "60%",
      margin: 0,
      padding: 0,
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      ["@media (max-width:1400px)"]: {
        fontSize: "15px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "18px",
      },
      ["@media (max-width:700px)"]: {
        fontSize: "15px",
        marginBottom: "5px",
      },
      ["@media (max-width:400px)"]: {
        fontSize: "14px",
      },
    },
    cardText: {
      fontSize: "15px",
      marginBottom: "5px",
      color: "black",
      ["@media (max-width:1400px)"]: {
        fontSize: "13px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "15px",
      },
      ["@media (max-width:700px)"]: {
        fontSize: "13px",
        marginBottom: "3px",
      },
      ["@media (max-width:400px)"]: {
        fontSize: "12px",
        marginBottom: "2px",
      },
    },
  })
)
