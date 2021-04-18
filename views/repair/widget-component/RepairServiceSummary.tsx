import React, { useEffect, useState, useCallback } from "react"
import { Typography, Grid } from "@material-ui/core"
import { Card } from "./"
import { Button } from "../../../components"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { repairWidgetStore, storesDetails } from "../../../store"
import { repairWidgetAPI } from "../../../services"
import { PostAppointParams } from "../../../model/post-appointment-params"
import { ToastMsgParams } from "../../../model/toast-msg-param"
import Toast from "../../../components/toast/toast"
import moment from "moment"
import Loading from "../../../components/Loading"
// import { RevertTimeTZ } from "../../../services/helper"

type Props = {
  repairWidgetData: any
  code: string
  themeCol: string
  step: number
  handleStep: (step: number) => void
  features: any[]
}

const RepairServiceSummary = ({ repairWidgetData, code, step, handleStep, features }: Props) => {
  const mainData = storesDetails.storeCnts
  const textThemeCol = mainData.general.colorPalle.textThemeCol
  const [disableStatus, setDisableStatus] = useState(false)
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [t] = useTranslation()

  const handleSubmit = () => {
    setDisableStatus(true)
    setIsSubmitting(true)
    // const tp: string = code === "MAIL_IN" ? "QUOTE" : "APPOINTMENT"
    const tp = "APPOINTMENT"
    const repairs: any[] = []
    for (let i = 0; i < repairWidgetStore.deviceCounter; i++) {
      for (let j = 0; j < repairWidgetStore.chooseRepair[i].length; j++) {
        repairs.push({
          repair_id: repairWidgetStore.chooseRepair[i][j].id,
          product_id: repairWidgetStore.deviceModel[i].id,
          cost: repairWidgetStore.chooseRepair[i][j].cost,
          duration: repairWidgetStore.chooseRepair[i][j].estimate,
          product_name:
            repairWidgetStore.deviceBrand[i].name + " " + repairWidgetStore.deviceModel[i].name,
          repair_name: repairWidgetStore.chooseRepair[i][j].name,
        })
      }
    }
    const params = {} as PostAppointParams
    params.store_id = storesDetails.store_id
    params.location_id = storesDetails.location_id
    params.customer_id = 1
    params.type = tp
    params.is_voided = storesDetails.is_voided
    params.delivery_method = repairWidgetStore.deliveryMethod.code
    params.customer_email = repairWidgetStore.contactDetails.email
    params.customer_first_name = repairWidgetStore.contactDetails.firstName
    params.customer_last_name = repairWidgetStore.contactDetails.lastName
    params.customer_phone = repairWidgetStore.contactDetails.phone
    params.customer_address_1 =
      repairWidgetStore.contactDetails.address1 && repairWidgetStore.contactDetails.address1.name
    params.customer_address_2 =
      repairWidgetStore.contactDetails.address2 && repairWidgetStore.contactDetails.address2.name
    params.customer_city = repairWidgetStore.contactDetails.city
    params.customer_state =
      repairWidgetStore.contactDetails.province && repairWidgetStore.contactDetails.province.code
    params.customer_postcode = repairWidgetStore.contactDetails.postalCode
    params.customer_country =
      repairWidgetStore.contactDetails.country && repairWidgetStore.contactDetails.country.code
    params.customer_note = repairWidgetStore.message
    params.customer_contact_method = repairWidgetStore.receiveQuote.code
    params.repairs = repairs
    params.selected_date =
      repairWidgetStore.repairWidgetInitialValue.selectDate || moment().format("YYYY-MM-DD")
    // params.selected_start_time = RevertTimeTZ(
    //   repairWidgetStore.repairWidgetInitialValue.selected_start_time || moment().format("HH:mm"),
    //   repairWidgetStore.timezone
    // )
    // params.selected_end_time = RevertTimeTZ(
    //   repairWidgetStore.repairWidgetInitialValue.selected_end_time,
    //   repairWidgetStore.timezone
    // )
    params.selected_start_time =
      repairWidgetStore.repairWidgetInitialValue.selected_start_time || moment().format("HH:mm")
    params.selected_end_time = repairWidgetStore.repairWidgetInitialValue.selected_end_time
    params.booking_date = moment().format("YYYY-MM-DD")

    repairWidgetAPI
      .postAppointmentQuote(params)
      .then((res: any) => {
        repairWidgetStore.changeAppointResponse(res.data)
        if (code === "MAIL_IN" && features.includes("FRONTEND_REPAIR_QUOTE")) {
          handleStep(11)
        } else if (code !== "MAIL_IN" && features.includes("FRONTEND_REPAIR_APPOINTMENT")) {
          ChooseNextStep()
        } else {
          setToastParams({
            msg: t("Something went wrong, please try again or contact us."),
            isWarning: true,
          })
          setDisableStatus(false)
          setIsSubmitting(false)
          return
        }
      })
      .catch(() => {
        setToastParams({
          msg: t("Something went wrong, please try again or contact us."),
          isError: true,
        })
        setDisableStatus(false)
        setIsSubmitting(false)
      })
  }

  const ChooseNextStep = () => {
    handleStep(step + 1)
  }

  const onKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && step === 9) {
        handleSubmit()
      }
    },
    [step, code]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step])

  const resetStatuses = () => {
    setToastParams({
      msg: "",
      isError: false,
      isWarning: false,
      isInfo: false,
      isSuccess: false,
    })
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card className="repair-service-summary-card">
        <div className="service-choose-device-container">
          <Typography className="repair-service-summary-title">{t("Service Summary")}</Typography>
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
                <Typography className="details">{repairWidgetData.contactDetails.phone}</Typography>
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
              {code !== "MAIL_IN" && (
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
          <div className="repair-service-summary-detail-container">
            <div className="repair-service-summary-flex-container bordered">
              <Typography className="topic">{t("Device")}:</Typography>
              <Typography className="topic">{t("Service")}:</Typography>
            </div>
            {repairWidgetData.deviceBrand &&
              repairWidgetData.deviceBrand.map((item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {repairWidgetData.chooseRepair[index].map(
                      (chooseItem: any, chooseIndex: number) => {
                        return (
                          <div className="repair-service-summary-flex-container" key={chooseIndex}>
                            <Typography className="details">
                              {repairWidgetData.deviceModel[index].name
                                .toString()
                                .includes(item.name.toString())
                                ? repairWidgetData.deviceModel[index].name
                                : item.name + " " + repairWidgetData.deviceModel[index].name}
                            </Typography>
                            <Typography className="details">{t(chooseItem.name)}</Typography>
                          </div>
                        )
                      }
                    )}
                  </React.Fragment>
                )
              })}
          </div>
          <div className="service-choose-device-container">
            {code !== "MAIL_IN" && (
              <FeatureToggles features={features}>
                <Feature
                  name="FRONTEND_REPAIR_APPOINTMENT"
                  inactiveComponent={() => <></>}
                  activeComponent={() => (
                    <Button
                      title={t("Schedule Appointment")}
                      bgcolor={mainData.general.colorPalle.nextButtonCol}
                      borderR="20px"
                      maxWidth="400px"
                      height="30px"
                      fontSize="17px"
                      margin="0 auto"
                      onClick={handleSubmit}
                      disable={disableStatus}
                    >
                      {isSubmitting && <Loading />}
                    </Button>
                  )}
                />
              </FeatureToggles>
            )}
            {code === "MAIL_IN" && (
              <FeatureToggles features={features}>
                <Feature
                  name="FRONTEND_REPAIR_QUOTE"
                  inactiveComponent={() => <></>}
                  activeComponent={() => (
                    <Button
                      title={t("Get Shipping Label")}
                      bgcolor={mainData.general.colorPalle.nextButtonCol}
                      borderR="20px"
                      maxWidth="400px"
                      height="30px"
                      fontSize="17px"
                      margin="0 auto"
                      onClick={handleSubmit}
                      disable={disableStatus}
                    >
                      {isSubmitting && <Loading />}
                    </Button>
                  )}
                />
              </FeatureToggles>
            )}
          </div>
        </div>
      </Card>
      <Toast params={toastParams} resetStatuses={resetStatuses} />
    </div>
  )
}

export default RepairServiceSummary
