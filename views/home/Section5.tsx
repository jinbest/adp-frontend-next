import React from "react"
import { Button } from "../../components"
import { Typography, Box } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"

const Section5 = () => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section5
  const themeType = data.general.themeType
  const [t] = useTranslation()
  if (!thisPage.visible) return null
  return (
    <>
      {thisPage.decorationUpImg && <img src={thisPage.decorationUpImg} alt="decorationUpImg" className="decorationUpImg" />}
      <section className="sec5-Back">
        <Box className="Container sec5-container">
          <Typography className="f40 bold mg-t-1 sec5-title">{t(thisPage.title)}</Typography>
          <Typography className="f18 sec5-content">{t(thisPage.content)}</Typography>
          <img
            className="mg-t-1 section5-img"
            src={storesDetails.commonCnts.bounceImg}
            width="1"
            height="auto"
            alt="bounce-img"
          />
          <Typography className="f24 bold sec5-title">{t(thisPage.subtitle)}</Typography>
          <span className="protect-content">
            {t(thisPage.subcontent)}
            {thisPage.subcontentData.map((item: string, index: number) => (
              <span key={index}>&nbsp;&bull;&nbsp;{t(item)}</span>
            ))}
          </span>
          <Box className="sec5-button">
            <Button
              title={t(thisPage.btnTitle)}
              bgcolor={data.general.colorPalle.themeColor}
              borderR={themeType === "marnics" ? "0px" : "20px"}
            />
          </Box>
        </Box>
      </section>
      {thisPage.decorationDownImg && <img src={thisPage.decorationDownImg} alt="decorationDownImg" className="decorationDownImg" />}
    </>
  )
}

export default Section5
