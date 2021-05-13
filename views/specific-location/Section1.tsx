import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import { Section1 } from "../../model/specific-config-param"
import CustomButtons from "./component/custom-buttons"
import HoursViewer from "./component/hours-viewer"
import AddressViewer from "./component/address-viewer"
import dynamic from "next/dynamic"
import { findIndex, isEmpty } from "lodash"
import { StoreLocation } from "../../model/store-location"
import { observer } from "mobx-react"

const DynamicCustomMap = dynamic(() => import("../../components/CustomMap"), { ssr: false })

type Props = {
  config: Section1
  locID: number
}

const SpecSection1 = ({ config, locID }: Props) => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const locIndex = findIndex(storesDetails.allLocations, { id: locID })
  const location: StoreLocation =
    locIndex > -1 ? storesDetails.allLocations[locIndex] : ({} as StoreLocation)
  const [t] = useTranslation()

  return (
    <div className={classes.root}>
      <h1 className={classes.mainTitle}>{t(config.title)}</h1>
      <Typography className={classes.mainContent}>{t(config.subTitle)}</Typography>
      <Grid container spacing={2} className={classes.locationsContainer}>
        <Grid item xs={12} md={4} className={classes.order1}>
          {!isEmpty(location) && (
            <>
              <div className={classes.details}>
                <div className={classes.item1}>
                  <Typography className={classes.cardTitle}>
                    {config.locationExtraNote.title}
                  </Typography>
                  <AddressViewer location={location} />
                  <Typography className={classes.cardContent}>
                    {config.locationExtraNote.content}
                  </Typography>
                </div>
                <div className={classes.item2}>
                  <HoursViewer location={location} />
                  <CustomButtons
                    location={location}
                    color={data.general.colorPalle.repairButtonCol}
                  />
                </div>
              </div>
            </>
          )}
        </Grid>
        <Grid item xs={12} md={8} className={classes.order2}>
          {config.displayMap && !isEmpty(location) && (
            <div className={classes.mapDetails}>
              <DynamicCustomMap
                selectedLocation={location}
                locations={storesDetails.allLocations}
                isDetail={true}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default observer(SpecSection1)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "1440px",
      padding: "175px 30px 0 !important",
      margin: "auto",
      display: "block",
      textAlign: "left",
      ["@media (max-width:1200px)"]: {
        paddingTop: "140px !important",
      },
      ["@media (max-width:500px)"]: {
        padding: "150px 30px 0 !important",
      },
      ["@media (max-width:425px)"]: {
        padding: "180px 30px 0 !important",
      },
    },
    mainTitle: {
      color: "black",
      fontSize: "55px !important",
      lineHeight: "70px !important",
      fontWeight: "bold",
      fontFamily: "Poppins Bold",
      justifyContent: "center",
      width: "900px",
      maxWidth: "100%",
      margin: "20px 0",
      ["@media (max-width:1400px)"]: {
        fontSize: "4vw !important",
        width: "65vw",
        lineHeight: "5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "5vw !important",
        width: "100%",
        textAlign: "center",
        lineHeight: "6vw !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4.5vw !important",
        margin: "5px 0",
      },
    },
    mainContent: {
      color: "black",
      fontSize: "40px !important",
      marginBottom: "40px !important",
      justifyContent: "left",
      width: "80%",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:960px)"]: {
        marginBottom: "0px !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
        width: "100%",
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw !important",
      },
    },
    locationsContainer: {
      margin: "0px auto 100px !important",
      padding: "20px !important",
      ["@media (max-width:1000px)"]: {
        margin: "0px auto 50px !important",
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
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4.5vw !important",
        marginBottom: "30px !important",
      },
    },
    details: {
      width: "100%",
      height: "100%",
      boxShadow: "-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.4)",
      borderRadius: "10px",
      "& > div": {
        padding: "25px 25px 15px",
      },
      display: "block",
      ["@media (max-width:960px)"]: {
        display: "flex",
        "& > div": {
          padding: "50px 25px 15px",
        },
      },
      ["@media (max-width:600px)"]: {
        display: "block",
        paddingTop: "40px !important",
        "& > div": {
          padding: "10px",
        },
      },
    },
    item1: {
      ["@media (max-width:960px)"]: {
        width: "40%",
      },
      ["@media (max-width:600px)"]: {
        width: "initial",
      },
    },
    item2: {
      ["@media (max-width:960px)"]: {
        width: "60%",
      },
      ["@media (max-width:600px)"]: {
        width: "initial",
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
    cardContent: {
      fontSize: "12px",
      marginTop: "15px",
      color: "rgba(0,0,0,0.75)",
    },
    mapDetails: {
      width: "100%",
      height: "100%",
      boxShadow: "-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.4)",
      borderRadius: "10px",
      "& > div": {
        padding: "20px",
      },
      "& div": {
        maxHeight: "500px !important",
      },
      ["@media (max-width:500px)"]: {
        "& > div": {
          padding: "10px",
        },
      },
    },
    order1: {
      order: 2,
      [theme.breakpoints.up("md")]: {
        order: 1,
      },
    },
    order2: {
      order: 1,
      [theme.breakpoints.up("md")]: {
        order: 2,
      },
    },
  })
)
