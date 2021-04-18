import React from "react"
import { Button } from "../../components"
import { Typography, Box } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"

const Section5 = () => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section5
  const [t] = useTranslation()

  return (
    <section className={"sec5-Back"} style={{ display: "none" }}>
      <Box className={"Container sec5-container"}>
        <Typography className="f40 bold mg-t-1">{t(thisPage.title)}</Typography>
        <Typography className="f18">{t(thisPage.content)}</Typography>
        <img
          className={"mg-t-1 section5-img"}
          src={storesDetails.commonCnts.bounceImg}
          width="1"
          height="auto"
          alt="bounce-img"
        />
        <Typography className="f24 bold">{t(thisPage.subtitle)}</Typography>
        <Box className="col_center">
          <ul>
            <Typography className={"protect-content"}>{t(thisPage.subcontent)}</Typography>
            {thisPage.subcontentData.map((item: string, index: number) => {
              return (
                <li key={index} className={"protect-content"}>
                  <span className="dot">&nbsp;&bull;&nbsp;</span>
                  {t(item)}
                </li>
              )
            })}
          </ul>
        </Box>
        <Box className={"sec5-button"}>
          <Button
            title={t(thisPage.btnTitle)}
            bgcolor={data.general.colorPalle.themeColor}
            borderR="20px"
          />
        </Box>
      </Box>
    </section>
  )
}

export default Section5
