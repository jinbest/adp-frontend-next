import React, { useEffect, useState } from "react"
import Head from "next/head"
import Shape from "./Shape"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Grid, Typography, Box } from "@material-ui/core"
import Button from "../../components/Button"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { repairWidgetStore, storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"
import CustomButtons from "../specific-location/component/custom-buttons"
import HoursViewer from "../specific-location/component/hours-viewer"
import AddressViewer from "../specific-location/component/address-viewer"
import { groupLocations } from "../../services/helper"
import _, { capitalize } from "lodash"

type Props = {
  handleStatus: (status: boolean) => void
}

const Locations = ({ handleStatus }: Props) => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const themeType = data.general.themeType
  const thisPage = data.locationPage
  const [t] = useTranslation()

  const [pageTitle, setPageTitle] = useState("Locations")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  const cityNames: string[] = []
  storesDetails.allLocations.forEach((item: any) => {
    cityNames.push(item.city)
  })
  const groupNames = _.uniqBy(cityNames, (item) => item)
  const groupBy = thisPage.section1.group
  const groupByLocations: any = groupBy ? groupLocations(storesDetails.allLocations) : ({} as any)

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
    repairWidgetStore.init()
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
      <div className={`${classes.root} location-container`}>
        {themeType === "marnics" && <div className="decoration-bar location-decoration-bar" style={{ background: "white" }} />}
        <h1 className={`${classes.mainTitle} marnics-location-main-title`}>{t(thisPage.section1.title)}</h1>
        <Typography className={`${classes.mainContent} marnics-location-main-content`}>{t(thisPage.section1.subtitle)}</Typography>
        {thisPage.section1.button.visible ? (
          <Box className={`${classes.buttonDiv} quote-button`}>
            <Link
              to={thisPage.section1.button.link}
              style={{ textDecoration: "none" }}
              onClick={handleGetQuote}
            >
              <Button
                title={t(thisPage.section1.button.title)}
                bgcolor={themeType === "marnics" ? "white" : data.general.colorPalle.repairButtonCol}
                borderR={themeType === "marnics" ? "0" : "20px"}
                width="100%"
                margin="0 auto"
                txcolor={themeType === "marnics" ? data.general.colorPalle.repairButtonCol : "white"}
              />
            </Link>
          </Box>
        ) : (
          <></>
        )}
        <div className={`${classes.locationsContainer} marnics-location-container`}>
          {themeType !== "marnics" && storesDetails.storesDetails.name &&
            <Typography className={classes.subTitle}>
              {`${t("All")} ${storesDetails.storesDetails.name} ${t("Locations")}`}
            </Typography>
          }
          {groupBy ? (
            <>
              {groupNames.map((it: string, idx: number) => {
                return (
                  <React.Fragment key={idx}>
                    <p className={classes.groupName}>{`${capitalize(it)}, ${groupByLocations[it][0].state
                      }`}</p>
                    <Grid container spacing={5}>
                      {groupByLocations[it].map((item: any, index: number) => {
                        return (
                          <Grid item xs={12} md={6} key={index}>
                            <div className={`${classes.item} marnics-location-item`}>
                              {
                                themeType === "marnics" ?
                                  <section>
                                    {item.image_url ? (
                                      <img
                                        src={item.image_url}
                                        alt={`${index}-location`}
                                        className={classes.marnicsLocation}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    <div className={classes.locationCardContent}>
                                      <div className={classes.locationCardTitle}>{item.location_name}</div>
                                      <Grid container>
                                        <Grid item xs={12} sm={6}>
                                          <div className={classes.locationCardAdd}>{item.address_1 + (item.address_2 ? ` , ${item.address_2} ` : "") + (item.address_3 ? ` , ${item.address_3}` : "") + (item.city ? ` | ${item.city}` : "") + (item.state ? ` | ${item.state}` : "")}</div>
                                          <CustomButtons
                                            location={item}
                                            color={data.general.colorPalle.repairButtonCol}
                                          />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                          <HoursViewer location={item} />
                                        </Grid>
                                      </Grid>
                                    </div>
                                  </section> :
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
                                      {item.image_url ? (
                                        <img
                                          src={item.image_url}
                                          alt={`${index}-location`}
                                          className={classes.location}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                      <div>
                                        <Typography className={classes.cardTitle}>
                                          {item.location_name}
                                        </Typography>
                                        <AddressViewer location={item} />
                                      </div>
                                      <CustomButtons
                                        location={item}
                                        color={data.general.colorPalle.repairButtonCol}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <HoursViewer location={item} />
                                    </Grid>
                                  </Grid>}
                            </div>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </React.Fragment>
                )
              })}
            </>
          ) : (
            <Grid container spacing={5}>
              {_.sortBy(storesDetails.allLocations, (o) => o.display_order).map(
                (item: any, index: number) => {
                  return (
                    <Grid item xs={12} md={6} key={index}>
                      <div className={`${classes.item} marnics-location-item`}>
                        {themeType === "marnics" ?
                          <section>
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={`${index}-location`}
                                className={classes.marnicsLocation}
                              />
                            ) : (
                              <></>
                            )}
                            <div className={classes.locationCardContent}>
                              <div className={classes.locationCardTitle}>{item.location_name}</div>
                              <Grid container>
                                <Grid item xs={12} sm={6}>
                                  <div className={classes.locationCardAdd}>{item.address_1 + (item.address_2 ? ` , ${item.address_2} ` : "") + (item.address_3 ? ` , ${item.address_3}` : "") + (item.city ? ` | ${item.city}` : "") + (item.state ? ` | ${item.state}` : "")}</div>
                                  <CustomButtons
                                    location={item}
                                    color={data.general.colorPalle.repairButtonCol}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <HoursViewer location={item} />
                                </Grid>
                              </Grid>
                            </div>
                          </section> :
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
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={`${index}-location`}
                                  className={classes.location}
                                />
                              ) : (
                                <></>
                              )}
                              <div>
                                <Typography className={classes.cardTitle}>
                                  {item.location_name}
                                </Typography>
                                <AddressViewer location={item} />
                              </div>
                              <CustomButtons
                                location={item}
                                color={data.general.colorPalle.repairButtonCol}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <HoursViewer location={item} />
                            </Grid>
                          </Grid>}
                      </div>
                    </Grid>
                  )
                }
              )}
            </Grid>
          )}
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
      padding: "200px 30px 0",
      margin: "auto",
      display: "block",
      textAlign: "left",
      ["@media (max-width:1200px)"]: {
        paddingTop: "210px",
      },
      ["@media (max-width:600px)"]: {
        paddingTop: "160px",
      },
      ["@media (max-width:425px)"]: {
        paddingTop: "200px",
      },
    },
    mainTitle: {
      color: "black",
      fontSize: "55px",
      lineHeight: "70px",
      fontWeight: "bold",
      fontFamily: "Poppins Bold",
      justifyContent: "center",
      width: "1000px",
      maxWidth: "100%",
      ["@media (max-width:1400px)"]: {
        fontSize: "4vw !important",
        marginBottom: "3vw !important",
        width: "75vw",
        lineHeight: "5vw",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "5vw !important",
        width: "85vw",
        lineHeight: "6vw !important",
      },
      ["@media (max-width:600px)"]: {
        fontSize: "4.5vw",
        width: "100%",
        textAlign: "center",
      },
    },
    mainContent: {
      color: "black",
      fontSize: "40px",
      marginTop: "50px",
      marginBottom: "40px",
      justifyContent: "left",
      width: "80%",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
      },
      ["@media (max-width:600px)"]: {
        fontSize: "3.5vw !important",
        width: "100%",
        textAlign: "center",
        margin: "10px 0 30px !important",
      },
    },
    buttonDiv: {
      maxWidth: "250px",
      width: "100%",
      margin: "initial",
      ["@media (max-width:600px)"]: {
        margin: "auto",
        maxWidth: "180px",
      },
    },
    locationsContainer: {
      margin: "0 auto",
      padding: "250px 20px 100px",
      ["@media (max-width:1000px)"]: {
        padding: "150px 20px 100px",
      },
      ["@media (max-width:600px)"]: {
        padding: "50px 20px 100px",
      },
    },
    subTitle: {
      color: "black",
      fontSize: "40px !important",
      lineHeight: "1 !important",
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
      },
      ["@media (max-width:600px)"]: {
        textAlign: "center",
        marginBottom: "20px !important",
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
      ["@media (max-width:500px)"]: {
        "& > div": {
          padding: "10px",
        },
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
    location: {
      width: "95%",
      marginBottom: "20px",
      ["@media (max-width:600px)"]: {
        width: "100%",
      },
    },
    marnicsLocation: {
      width: "100%",
      height: 187,
    },
    locationCardContent: {
      padding: "30px 35px",
      ["@media (max-width:1024px)"]: {
        padding: 30
      },
      ["@media (max-width:600px)"]: {
        padding: 17
      },
    },
    locationCardTitle: {
      fontSize: 30,
      fontFamily: "Helvetica Neue Bold !important",
      color: "black",
      lineHeight: "120%",
      marginBottom: 20,
      ["@media (max-width:600px)"]: {
        fontSize: 24,
        marginBottom: 0
      },
    },
    locationCardAdd: {
      fontSize: 24,
      fontFamily: "Helvetica Neue Medium !important",
      color: "black",
      lineHeight: "120%",
      marginBottom: 40,
      ["@media (max-width:768px)"]: {
        maxWidth: 200
      },
      ["@media (max-width:600px)"]: {
        fontSize: 20,
        marginBottom: 20
      },
    },
    groupName: {
      margin: "40px 10px 20px",
      fontSize: "25px !important",
      fontFamily: "Poppins Bold !important",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
      },
      ["@media (max-width:600px)"]: {
        fontSize: "3.5vw !important",
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4vw !important",
      },
    },
  })
)
