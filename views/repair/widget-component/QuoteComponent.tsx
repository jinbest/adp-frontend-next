import React from "react"
import { Typography } from "@material-ui/core"
import Card from "./Card"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../../store"
import Image from "next/image"

const imgSize = [
  { width: 126, height: 155 },
  { width: 147, height: 140 },
]

type Props = {
  data: any
  quoteKey: number
  repairWidgetData: any
}

const QuoteComponent = ({ data, quoteKey, repairWidgetData }: Props) => {
  const storeName = storesDetails.storesDetails.name

  const [t] = useTranslation()

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card className="repair-service-summary-card">
        <div className="quote-container">
          <div className="quote-image">
            <Image
              src={data[quoteKey].img}
              alt="quote-img"
              width={imgSize[quoteKey].width}
              height={imgSize[quoteKey].height}
              layout="responsive"
            />
          </div>
          <Typography className="repair-service-summary-title">
            {`${t(data[quoteKey].title)} ${storeName}`}
          </Typography>
          <Typography className="quote-component-content" id="service-widget-success-page">
            {t("You will receive an")} <b>{t("Email").toLocaleLowerCase()}</b> {t("at")}{" "}
            <b>{repairWidgetData.contactDetails.email}</b> {t("shortly")}, {t(data[quoteKey].text)}
          </Typography>
        </div>
      </Card>
    </div>
  )
}

export default QuoteComponent
