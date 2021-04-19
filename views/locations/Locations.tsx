import React, { useEffect, useState } from "react"
import Head from "next/head"
import Shape from "./Shape"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Grid, Typography, Box } from "@material-ui/core"
import Button from "../../components/Button"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { repairWidgetStore, storesDetails } from "../../store"
import { getRegularHours, getHourType, getAddress, phoneFormatString } from "../../services/helper"
import { MetaParams } from "../../model/meta-params"

const DAYS_OF_THE_WEEK: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

type Props = {
  handleStatus: (status: boolean) => void
}

const Locations = ({ handleStatus }: Props) => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const thisPage = data.locationPage
  const [t] = useTranslation()

  const [pageTitle, setPageTitle] = useState("Locations")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  const handleGetQuote = () => {
    const cntAppointment: any = repairWidgetStore.appointResponse
    repairWidgetStore.init()
    repairWidgetStore.changeAppointResponse(cntAppointment)
    handleStatus(false)
  }

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
        <link rel="icon" id="favicon" href={data.homepage.headData.fav.img} />
        <link rel="apple-touch-icon" href={data.homepage.headData.fav.img} />
      </Head>

      <Shape />
      <div className={classes.root}>
        <h1 className={classes.mainTitle}>{t(thisPage.section1.title)}</h1>
        <Typography className={classes.mainContent}>{t(thisPage.section1.subtitle)}</Typography>
        {thisPage.section1.button.visible ? (
          <Box className={classes.buttonDiv}>
            <Link
              to={thisPage.section1.button.link}
              style={{ textDecoration: "none" }}
              onClick={handleGetQuote}
            >
              <Button
                title={t(thisPage.section1.button.title)}
                bgcolor={data.general.colorPalle.repairButtonCol}
                borderR="20px"
                width="100%"
                margin="0 auto"
              />
            </Link>
          </Box>
        ) : (
          <></>
        )}
        <div className={classes.locationsContainer}>
          <Typography className={classes.subTitle}>
            {`${t("All")} ${storesDetails.storesDetails.name} ${t("Locations")}`}
          </Typography>
          <Grid container spacing={5}>
            {storesDetails.allLocations.map((item: any, index: number) => {
              return (
                <Grid item xs={12} md={6} key={index}>
                  <div className={classes.item}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          <Typography className={classes.cardTitle}>
                            {item.location_name}
                          </Typography>
                          <Typography className={classes.cardText}>
                            {`${item.address_1},`}
                          </Typography>
                          <Typography className={classes.cardText}>
                            {`${item.address_2 ? item.address_2 + ", " : ""}${
                              item.city ? item.city + ", " : ""
                            } ${item.state ? item.state + " " : ""} ${
                              item.postcode
                                ? item.postcode.substring(0, 3) +
                                  " " +
                                  item.postcode.substring(3, item.postcode.length)
                                : ""
                            }`}
                          </Typography>
                          <a
                            href={`tel:${item.phone}`}
                            style={{
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            <Typography className={classes.cardText}>
                              {phoneFormatString(item.phone)}
                            </Typography>
                          </a>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            margin: "0 0 10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <a
                            href={`${
                              item.business_page_link != null
                                ? item.business_page_link
                                : `https://www.google.com/maps/search/?api=1&query=${getAddress(
                                    item
                                  )
                                    .split(" ")
                                    .join("+")}`
                            }`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecoration: "none",
                              color: "black",
                            }}
                          >
                            <Button
                              title={t("Get Directions")}
                              bgcolor={data.general.colorPalle.repairButtonCol}
                              borderR="20px"
                              width="auto"
                              margin="10px 10px 0 0"
                              fontSize="12px"
                              height="25px"
                            />
                          </a>
                          <a href={`tel:${item.phone}`} style={{ textDecoration: "none" }}>
                            <Button
                              title={t("Call Now")}
                              bgcolor={data.general.colorPalle.repairButtonCol}
                              borderR="20px"
                              width="auto"
                              margin="10px 10px 0 0"
                              fontSize="12px"
                              height="25px"
                            />
                          </a>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.cardTitle}>{t("Hours")}</Typography>
                        {getRegularHours(item.location_hours).map((it, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              width: "100%",
                              marginBottom: "5px",
                            }}
                          >
                            <div style={{ width: "40%", margin: 0, padding: 0 }}>
                              <Typography className={classes.cardText}>
                                {t(DAYS_OF_THE_WEEK[it.day])}
                              </Typography>
                            </div>
                            <div style={{ width: "60%", margin: 0, padding: 0 }}>
                              <Typography className={classes.cardText}>
                                {!it.open || !it.close
                                  ? it.by_appointment_only
                                    ? t("Call to book appointment")
                                    : t("Closed")
                                  : getHourType(it.open) + "-" + getHourType(it.close)}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              )
            })}
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default Locations

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "1440px",
      padding: "250px 30px 0 !important",
      margin: "auto",
      display: "block",
      textAlign: "left",
      ["@media (max-width:1200px)"]: {
        paddingTop: "210px !important",
      },
      ["@media (max-width:500px)"]: {
        padding: "180px 30px 0 !important",
      },
      ["@media (max-width:425px)"]: {
        padding: "200px 30px 0 !important",
      },
    },
    mainTitle: {
      color: "black",
      fontSize: "55px !important",
      lineHeight: "70px !important",
      // textShadow: "1px 0 black",
      fontWeight: "bold",
      fontFamily: "Poppins Bold",
      justifyContent: "center",
      width: "1000px",
      maxWidth: "100%",
      ["@media (max-width:1400px)"]: {
        fontSize: "4vw !important",
        marginBottom: "3vw !important",
        width: "75vw",
        lineHeight: "5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "5vw !important",
        width: "85vw",
        lineHeight: "6vw !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4.5vw !important",
        width: "100%",
        textAlign: "center",
      },
    },
    mainContent: {
      color: "black",
      fontSize: "40px !important",
      marginTop: "50px !important",
      marginBottom: "40px !important",
      justifyContent: "left",
      width: "80%",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw !important",
        width: "100%",
        textAlign: "center",
        marginTop: "30px !important",
      },
    },
    buttonDiv: {
      maxWidth: "250px",
      width: "100%",
      margin: "initial",
      ["@media (max-width:500px)"]: {
        margin: "auto",
        maxWidth: "180px",
      },
    },
    locationsContainer: {
      margin: "100px auto",
      padding: "20px",
      ["@media (max-width:1000px)"]: {
        margin: "0px auto 50px",
      },
    },
    subTitle: {
      color: "black",
      fontSize: "40px !important",
      lineHeight: "1 !important",
      // textShadow: "1px 0 black",
      fontFamily: "Poppins Bold !important",
      fontWeight: "bold",
      justifyContent: "center",
      marginTop: "50px !important",
      marginBottom: "40px !important",
      ["@media (max-width:1400px)"]: {
        fontSize: "3vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "4vw !important",
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4.5vw !important",
        marginBottom: "30px !important",
      },
    },
    item: {
      width: "100%",
      height: "100%",
      boxShadow: "-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.4)",
      borderRadius: "10px",
      "& > div": {
        padding: "25px",
      },
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      ["@media (max-width:1400px)"]: {
        fontSize: "15px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "18px",
      },
      ["@media (max-width:700px)"]: {
        fontSize: "15px",
        marginBottom: "5px",
      },
      ["@media (max-width:400px)"]: {
        fontSize: "14px",
      },
    },
    cardText: {
      fontSize: "15px",
      marginBottom: "5px",
      color: "black",
      ["@media (max-width:1400px)"]: {
        fontSize: "13px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "15px",
      },
      ["@media (max-width:700px)"]: {
        fontSize: "13px",
        marginBottom: "3px",
      },
      ["@media (max-width:400px)"]: {
        fontSize: "12px",
        marginBottom: "2px",
      },
    },
  })
)
