import React, { useState, useEffect, useCallback } from "react"
import { Grid, Typography } from "@material-ui/core"
import { Card } from "./"
import { Button } from "../../../components"
import RepairSummary from "./RepairSummary"
import { useTranslation } from "react-i18next"
import { repairWidgetStore, storesDetails } from "../../../store"

type Props = {
  data: any
  step: number
  handleStep: (step: number) => void
  handleChangeChooseData: (step: number, chooseData: any) => void
  repairWidgetData: any
}

const UsefulInfo = ({
  data,
  step,
  handleStep,
  handleChangeChooseData,
  repairWidgetData,
}: Props) => {
  const mainData = storesDetails.storeCnts
  const themeCol = mainData.general.colorPalle.themeColor

  const [message, setMessage] = useState("")
  const [t] = useTranslation()

  const ChooseNextStep = () => {
    handleChangeChooseData(8, message)
    handleStep(step + 1)
  }

  useEffect(() => {
    setMessage(repairWidgetData.message)
  }, [repairWidgetData])

  const onKeyPress = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        if (event.shiftKey) {
          return
        } else {
          ChooseNextStep()
        }
      }
    },
    [step, message]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step, message])

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
              <div className="useful-textarea-div">
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                  }}
                  placeholder={t(data.placeholder)}
                  className="useful-textarea"
                />
              </div>
            </div>
            <div className="service-card-button">
              <Button
                title={t("Next")}
                bgcolor={mainData.general.colorPalle.nextButtonCol}
                borderR="20px"
                width="120px"
                height="30px"
                fontSize="17px"
                onClick={ChooseNextStep}
              />
              <p>{t("or press ENTER")}</p>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="service-summary-card">
            <RepairSummary
              step={step}
              themeCol={themeCol}
              showInfo={true}
              repairWidgetStore={repairWidgetStore}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default UsefulInfo
