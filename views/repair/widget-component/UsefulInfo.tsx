import React, { useState, useEffect, useCallback } from "react"
import { Grid, Typography } from "@material-ui/core"
import Card from "./Card"
import Button from "../../../components/Button"
import RepairSummary from "./RepairSummary"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../../store"
import ReactTooltip from "react-tooltip"

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
  const themeType = mainData.general.themeType

  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)
  const [count, setCount] = useState(0)
  const [t] = useTranslation()

  const ChooseNextStep = () => {
    if (error) return
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
    [step, message, error]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step, message, error])

  useEffect(() => {
    setCount(message ? message.length : 0)
    if (message && message.length > 500) {
      setError(true)
    } else {
      setError(false)
    }
  }, [message])

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
              <div className="d-flex">
                {error && (
                  <ReactTooltip id="error-tip" place="top" effect="solid">
                    {t("You can only enter 500 characters")}
                  </ReactTooltip>
                )}
                <div className="error-tooltip" data-tip data-for="error-tip">
                  <span style={{ color: count > 500 ? "red" : "black" }}>{count}</span>
                  <span> / 500</span>
                </div>
              </div>
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
                disable={error}
              />
              <p>{t("or press ENTER")}</p>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="service-summary-card">
            <RepairSummary themeCol={themeCol} showInfo={true} />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default UsefulInfo
