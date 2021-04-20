import React from "react"
import { Grid, Box, Typography } from "@material-ui/core"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next"
import { storesDetails, repairWidgetStore } from "../../store"
import { isExternal } from "../../services/helper"
interface Props {
  handleStatus: (status: boolean) => void
}

const Section1 = ({ handleStatus }: Props) => {
  const data = storesDetails.storeCnts
  const repair = data.repairPage.section1
  const [t] = useTranslation()

  const handleRepairWidget = () => {
    repairWidgetStore.init()
    handleStatus(false)
  }

  return (
    <div
      className="service-section1-special-bg"
      style={{
        backgroundImage: repair.hasBackground ? "url(" + repair.bgImg + ")" : "",
      }}
    >
      <section className="Container">
        <Grid container className="service-section1">
          <Grid item xs={12} sm={7}>
            <Typography
              className="service-section-title-1"
              style={{
                color: repair.themeCol,
              }}
            >
              {t(repair.title)}
            </Typography>
            <Typography className="service-section-content" style={{ color: repair.themeCol }}>
              {t(repair.subtitle)}
            </Typography>
            <div style={{ display: "flex" }}>
              {repair.buttons.map((item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {item.visible ? (
                      <Box className="service-section-button">
                        {isExternal(item.link) ? (
                          <a
                            href={item.link}
                            style={{ textDecoration: "none" }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              title={t(item.title)}
                              bgcolor={data.general.colorPalle.repairButtonCol}
                              borderR="20px"
                              width="90%"
                            />
                          </a>
                        ) : (
                          <Link
                            to={item.link}
                            style={{ textDecoration: "none" }}
                            onClick={handleRepairWidget}
                          >
                            <Button
                              title={t(item.title)}
                              bgcolor={data.general.colorPalle.repairButtonCol}
                              borderR="20px"
                              width="90%"
                            />
                          </Link>
                        )}
                      </Box>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </Grid>
          <Grid item xs={12} sm={5}>
            <img
              src={storesDetails.commonCnts.repairPhoneImg}
              alt="repair-phone"
              style={{ width: "100%", marginTop: "-80px" }}
              width="1"
              height="auto"
            />
          </Grid>
        </Grid>
      </section>
    </div>
  )
}

export default observer(Section1)
