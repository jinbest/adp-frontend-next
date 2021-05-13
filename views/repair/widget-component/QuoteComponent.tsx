import React from "react"
import { Typography, Grid } from "@material-ui/core"
import Card from "./Card"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../../store"
import { observer } from "mobx-react"
import { currencyFormater, phoneFormatString } from "../../../services/helper"

type Props = {
  data: any
  quoteKey: number
  repairWidgetData: any
  code: string
}

const QuoteComponent = ({ data, quoteKey, repairWidgetData, code }: Props) => {
  const storeName = storesDetails.storesDetails.name
  const mainData = storesDetails.storeCnts
  const textThemeCol = mainData.general.colorPalle.textThemeCol

  const [t] = useTranslation()

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card className="repair-service-summary-card">
        <div className="quote-container">
          <Typography className="repair-service-summary-title">
            {`${t(data[quoteKey].title)} ${storeName} ${t("for your repairs!")}`}
          </Typography>
          <Typography className="quote-component-content" id="service-widget-success-page">
            {t("You will receive an")} <b>{t("Email").toLocaleLowerCase()}</b> {t("at")}{" "}
            <b>{repairWidgetData.contactDetails.email}</b> {t("shortly")}, {t(data[quoteKey].text)}
          </Typography>
        </div>
        <div className="service-choose-device-container">
          <div className="repair-service-summary-flex-container bordered">
            <Typography className="summary-topic">{t("Device")}</Typography>
            <Typography className="summary-topic">{t("Repair Service")}</Typography>
            <Typography className="summary-topic quote-cost">{t("Quoted Cost")}</Typography>
          </div>
          {repairWidgetData.deviceBrand &&
            repairWidgetData.deviceBrand.map((item: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  {repairWidgetData.chooseRepair[index].map(
                    (chooseItem: any, chooseIndex: number) => {
                      return (
                        <div className="repair-service-summary-flex-container" key={chooseIndex}>
                          <Typography className="summary-details">
                            {repairWidgetData.deviceModel[index].name
                              .toString()
                              .includes(item.name.toString())
                              ? repairWidgetData.deviceModel[index].name
                              : item.name + " " + repairWidgetData.deviceModel[index].name}
                          </Typography>
                          <Typography className="summary-details">{t(chooseItem.name)}</Typography>
                          <Typography className="summary-details quote-cost">
                            {chooseItem.cost
                              ? currencyFormater.format(chooseItem.cost)
                              : t("Call For Quote")}
                          </Typography>
                        </div>
                      )
                    }
                  )}
                </React.Fragment>
              )
            })}
          <Grid container className="repair-service-summary-detail-container" spacing={3}>
            <Grid item xs={12} sm={6} className="every-container">
              <Typography className="topic">{t("Your Information")}</Typography>
              <Typography className="details">
                {repairWidgetData.contactDetails.firstName +
                  " " +
                  repairWidgetData.contactDetails.lastName}
              </Typography>
              <a
                className="details"
                href={`mailto:${repairWidgetData.contactDetails.email}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Typography className="details">{repairWidgetData.contactDetails.email}</Typography>
              </a>
              <a
                className="details"
                href={`tel:${repairWidgetData.contactDetails.phone}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Typography className="details">
                  {phoneFormatString(repairWidgetData.contactDetails.phone)}
                </Typography>
              </a>
            </Grid>
            <Grid item xs={12} sm={6} className="every-container">
              <Typography className="topic">{t("Preferred Contact Method")}</Typography>
              <Typography className="details">{t(repairWidgetData.receiveQuote.method)}</Typography>
            </Grid>
          </Grid>
          <Grid container className="repair-service-summary-detail-container" spacing={3}>
            <Grid item xs={12} sm={6} className="every-container">
              <Typography className="topic">{t("Delivery Method")}</Typography>
              <Typography className="details" style={{ color: textThemeCol }}>
                {t(repairWidgetData.deliveryMethod.method)}
              </Typography>
              {code === "PICK_UP" && (
                <Typography className="details bolder">{t("Pick Up From")}</Typography>
              )}
              {code === "MAIL_IN" && (
                <Typography className="details bolder">{t("Send To")}</Typography>
              )}
              {code !== "MAIL_IN" && (
                <Typography className="details">
                  {repairWidgetData.bookData[code].address.name}
                </Typography>
              )}
              {code === "MAIL_IN" && (
                <Typography className="details">
                  {repairWidgetData.bookData[code].sendTo}
                </Typography>
              )}
              {code === "MAIL_IN" && (
                <Typography className="details bolder">{t("Return To")}</Typography>
              )}
              {code === "MAIL_IN" && (
                <Typography className="details">
                  {repairWidgetData.contactDetails.address1.name}
                </Typography>
              )}
              {code !== "MAIL_IN" && quoteKey === 1 && (
                <Typography className="details">
                  {repairWidgetData.bookData[code].week +
                    ", " +
                    repairWidgetData.bookData[code].month +
                    " " +
                    repairWidgetData.bookData[code].day +
                    ", " +
                    repairWidgetData.bookData[code].year +
                    " at " +
                    repairWidgetData.bookData[code].time}
                </Typography>
              )}
            </Grid>
            {repairWidgetData.message && (
              <Grid item xs={12} sm={6} className="every-container">
                <Typography className="topic">{t("Message")}</Typography>
                <Typography className="details">{repairWidgetData.message}</Typography>
              </Grid>
            )}
          </Grid>
        </div>
      </Card>
    </div>
  )
}

export default observer(QuoteComponent)
