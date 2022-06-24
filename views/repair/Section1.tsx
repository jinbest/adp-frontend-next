import React from "react"
import { Grid, Box, Typography } from "@material-ui/core"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next"
import { storesDetails, repairWidgetStore } from "../../store"
import { isExternal } from "../../services/helper"
import _ from "lodash"

interface Props {
  handleStatus: (status: boolean) => void
}

const Section1 = ({ handleStatus }: Props) => {
  const data = storesDetails.storeCnts
  const themeType = data.general.themeType
  const repair = data.repairPage.section1
  const buttons = _.sortBy(repair.buttons, (o) => o.order)
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
      <section className="Container repair-section1-container">
        <div className="repair-section1-content">
          <img src={repair.decorationImg} alt="decoration" className="repair-section1-decoration" />
          <Grid container className="service-section1">
            <Grid item xs={12} sm={themeType === "snap" ? 12 : 7} md={7}>
              <div className="decoration-bar" style={{ backgroundColor: repair.themeCol }} />
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
                {buttons.map((item: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      {item.visible ? (
                        <Box className="service-section-button repair-section-button">
                          {isExternal(item.link) ? (
                            <a
                              href={item.link}
                              style={{ textDecoration: "none" }}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button
                                title={t(item.title)}
                                bgcolor={themeType === "marnics" ? "#fff" : data.general.colorPalle.repairButtonCol}
                                borderR={themeType === "marnics" ? "0" : "20px"}
                                txcolor={themeType === "marnics" ? data.general.colorPalle.repairButtonCol : "#fff"}
                                width={themeType === "marnics" ? "100%" : "90%"}
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
                                bgcolor={themeType === "marnics" ? "#fff" : data.general.colorPalle.repairButtonCol}
                                borderR={themeType === "marnics" ? "0" : "20px"}
                                txcolor={themeType === "marnics" ? data.general.colorPalle.repairButtonCol : "#fff"}
                                width={themeType === "marnics" ? "100%" : "90%"}
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
            <Grid item xs={12} sm={themeType === "snap" ? 12 : 5} md={5} className="repair-section1-img-container">
              <img src={repair.decorationImg} alt="decoration" className="repair-section1-decoration-mobile" />
              <img
                src={storesDetails.commonCnts.repairPhoneImg}
                alt="repair-phone"
                className="repair-section1-img"
                style={{ width: "100%", marginTop: "-80px" }}
                width="1"
                height="auto"
              />
            </Grid>
          </Grid>
          <img src={storesDetails.commonCnts.repairPhoneImg} alt="repair-phone" className="mobile-repair-section1-img" />
        </div>
      </section>
    </div>
  )
}

export default observer(Section1)
