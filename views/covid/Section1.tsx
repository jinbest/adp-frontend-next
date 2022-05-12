import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails, repairWidgetStore } from "../../store"
import { Typography, Box } from "@material-ui/core"
import Button from "../../components/Button"
import { useTranslation } from "react-i18next"
import { isExternal } from "../../services/helper"
import { Link } from "react-router-dom"
import _ from "lodash"

type Props = {
  handleStatus: (status: boolean) => void
}

const Section1 = ({ handleStatus }: Props) => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const themeType = data.general?.themeType
  const thisPage = data.covidPage.section1
  const buttons = _.sortBy(thisPage.buttons, (o) => o.order)
  const [t] = useTranslation()

  const handleGetQuote = () => {
    repairWidgetStore.init()
    handleStatus(false)
  }

  return (
    <div className={`${classes.root} covid-section1-container`}>
      <div className="decoration-line" />
      <h1 className={`${classes.mainTitle} covid-main-title`}>{t(thisPage.title)}</h1>
      <Typography className={`${classes.mainContent} covid-main-content`}>{t(thisPage.content)}</Typography>
      <div className="align-center d-flex">
        {buttons.map((item: any, index: number) => {
          return (
            <React.Fragment key={index}>
              {item.visible && (
                <Box className="service-section-button covid-section-button" style={{ margin: "initial" }}>
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
                        borderR={themeType === "marnics" ? "0" : "20px"}
                        width={themeType === "marnics" ? "190px" : "95%"}
                      />
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      style={{ textDecoration: "none" }}
                      onClick={handleGetQuote}
                    >
                      <Button
                        title={t(item.title)}
                        bgcolor={data.general.colorPalle.repairButtonCol}
                        borderR={themeType === "marnics" ? "0" : "20px"}
                        width={themeType === "marnics" ? "190px" : "95%"}
                      />
                    </Link>
                  )}
                </Box>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Section1

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "1440px",
      padding: "250px 30px 0",
      margin: "auto",
      display: "block",
      textAlign: "center",
      ["@media (max-width:1200px)"]: {
        paddingTop: "210px",
      },
      ["@media (max-width:500px)"]: {
        padding: "180px 30px 0px",
      },
      ["@media (max-width:425px)"]: {
        padding: "200px 30px 0px",
      },
    },
    mainTitle: {
      color: "black",
      fontSize: "50px",
      marginBottom: "10px",
      fontFamily: "Poppins Bold",
      fontWeight: "bold",
      justifyContent: "center",
      letterSpacing: "2px",
      ["@media (max-width:1400px)"]: {
        fontSize: "4vw !important",
        marginBottom: "3vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "5vw !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "5.5vw !important",
        width: "100%",
      },
    },
    mainContent: {
      color: "black",
      fontSize: "30px",
      marginBottom: "30px",
      justifyContent: "center",
      margin: "auto",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw !important",
        width: "100%",
      },
    },
  })
)
