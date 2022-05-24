import React, { useEffect, useState } from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { repairWidgetStore, storesDetails } from "../../store"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { observer } from "mobx-react"
import { Link } from "react-router-dom"
import PhoneIcon from "@material-ui/icons/Phone"
import CallSplitIcon from "@material-ui/icons/CallSplit"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { isEmpty } from "lodash"
import {
  getRegularHours,
  getHourType,
  getAddress,
  makeLocations,
  phoneFormatString,
} from "../../services/helper"
import dynamic from "next/dynamic"
import { DAYS_OF_THE_WEEK, featureToggleKeys } from "../../const/_variables"

const DynamicCustomMap = dynamic(() => import("../../components/CustomMap"), { ssr: false })

interface Props {
  locations: any[]
  handleStatus: (status: boolean) => void
  location_id: number
  handleLocationID: (id: number) => void
  features: any[]
}

const SectionMap = ({
  locations,
  handleStatus,
  location_id,
  handleLocationID,
  features,
}: Props) => {
  const data = storesDetails.storeCnts
  const [t] = useTranslation()
  const classes = useStyles()
  const [expanded, setExpanded] = useState<number | false>(0)
  const [selectedLocation, setSelectedLocation] = useState<null | any>(locations[0])
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [feats, setFeatures] = useState<any[]>([])

  useEffect(() => {
    const cntFeatures: any[] = []
    if (!isEmpty(features) && features.length) {
      features.forEach((item) => {
        if (item.isActive) {
          cntFeatures.push(item.flag)
        }
      })
    }
    setFeatures(cntFeatures)
  }, [features])

  const handleLocSelect = (location: any) => {
    storesDetails.cntUserLocation = makeLocations([location])
    storesDetails.changeLocationID(location.id)
    storesDetails.changeCntUserLocationSelected(true)
  }
  const handleGetQuote = () => {
    repairWidgetStore.init()
    handleStatus(false)
  }

  useEffect(() => {
    if (!isEmpty(locations) && locations.length) {
      locations.forEach((item, index) => {
        if (parseInt(item.id) === location_id) {
          setExpanded(index)
          setIsExpanded(true)
          setSelectedLocation(item)
          return
        }
      })
    }
  }, [locations, location_id])

  const handleChange = (panel: number) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    // setExpanded(isExpanded ? panel : false)
    // setIsExpanded(isExpanded)
    setExpanded(panel)
    setIsExpanded(true)
    if (storesDetails.cntUserLocationSelected) {
      handleLocSelect(locations[panel])
    }
    if (isExpanded) {
      setSelectedLocation(locations[panel])
      handleLocationID(locations[panel].id)
    }
  }

  useEffect(() => {
    if (storesDetails.cntUserLocationSelected && locations.length) {
      locations.forEach((item, index) => {
        if (
          !isEmpty(storesDetails.cntUserLocation) &&
          storesDetails.cntUserLocation[0].location_id === item.id
        ) {
          setSelectedLocation(item)
          handleLocationID(item.id)
          setExpanded(index)
          setIsExpanded(true)
          return
        }
      })
      return
    }
  }, [storesDetails.cntUserLocation])

  return (
    <section className={`Container ${classes.root}`}>
      <Grid container style={{ paddingTop: "180px", paddingBottom: "100px" }}>
        <Grid item lg={6} md={12} sm={12} xs={12} className={classes.item1}>
          {locations.map((element, index) => (
            <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h2>{getAddress(element)}</h2>
              </AccordionSummary>
              <AccordionDetails style={{ display: "block" }}>
                <Grid container>
                  <Grid
                    item
                    container
                    md={4}
                    sm={12}
                    xs={12}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: "fit-content",
                    }}
                  >
                    <Grid item container md={12} sm={12} xs={12} style={{ marginBottom: "20px" }}>
                      <Grid item md={12} sm={6} xs={6} style={{ marginBottom: "20px" }}>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <PhoneIcon />
                          <a href={`tel:${element.phone}`} className={classes.phoneText}>
                            <span
                              style={{
                                color: data.general.colorPalle.repairButtonCol,
                              }}
                            >
                              {phoneFormatString(element.phone, element.phoneFormat)}
                            </span>
                          </a>
                        </p>
                      </Grid>
                      <Grid item md={12} sm={6} xs={6}>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <a
                            href={`${
                              element.business_page_link != null
                                ? element.business_page_link
                                : `https://www.google.com/maps/search/?api=1&query=${getAddress(
                                    element
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
                            <CallSplitIcon />
                            <span className={classes.directions}>{t("Directions")}</span>
                          </a>
                        </p>
                      </Grid>
                    </Grid>
                    <Grid item container>
                      <Grid
                        item
                        md={12}
                        sm={6}
                        xs={6}
                        style={{
                          marginBottom: "20px",
                          display: "flex",
                        }}
                      >
                        <Link
                          to={data.general.routes.repairWidgetPage}
                          style={{
                            textDecoration: "none",
                            display: "flex",
                          }}
                          onClick={handleGetQuote}
                        >
                          <button
                            className={classes.getAppoint}
                            style={{
                              backgroundColor: data.general.colorPalle.repairButtonCol,
                            }}
                            onClick={() => {
                              handleLocSelect(element)
                            }}
                          >
                            {t("Get Quote")}
                          </button>
                        </Link>
                      </Grid>
                      <FeatureToggles features={feats}>
                        <Feature
                          name={featureToggleKeys.FRONTEND_REPAIR_APPOINTMENT}
                          inactiveComponent={() => <></>}
                          activeComponent={() => (
                            <Grid
                              item
                              md={12}
                              sm={6}
                              xs={6}
                              style={{
                                marginBottom: "20px",
                                display: "flex",
                              }}
                            >
                              <Link
                                to={data.general.routes.repairWidgetPage}
                                style={{
                                  textDecoration: "none",
                                  display: "flex",
                                }}
                                onClick={handleGetQuote}
                              >
                                <button
                                  className={classes.getAppoint}
                                  style={{
                                    backgroundColor: data.general.colorPalle.repairButtonCol,
                                  }}
                                  onClick={() => {
                                    handleLocSelect(element)
                                  }}
                                >
                                  {t("Book Appointment")}
                                </button>
                              </Link>
                            </Grid>
                          )}
                        />
                      </FeatureToggles>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    md={8}
                    sm={12}
                    xs={12}
                    className={`hours-div ${classes.timePanelWrapp}`}
                  >
                    <div>
                      <p className="block-title" style={{ textAlign: "start" }}>
                        {t("Hours")}
                      </p>
                    </div>

                    {getRegularHours(element.location_hours).map((item, index) => (
                      <Grid key={index} item container md={12} sm={12} xs={12}>
                        <Grid item md={6} sm={6} xs={6}>
                          <p className={`block-content ${classes.nonHoverEffect}`}>
                            {t(DAYS_OF_THE_WEEK[item.day])}
                          </p>
                        </Grid>
                        <Grid item md={6} sm={6} xs={6}>
                          <p className={`block-content ${classes.nonHoverEffect}`}>
                            {!item.open || !item.close
                              ? item.by_appointment_only
                                ? t("Call to book appointment")
                                : t("Closed")
                              : getHourType(item.open) + "-" + getHourType(item.close)}
                          </p>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className={classes.item2}>
          <DynamicCustomMap
            selectedLocation={selectedLocation}
            locations={locations}
            isDetail={isExpanded}
          />
        </Grid>
      </Grid>
    </section>
  )
}

export default observer(SectionMap)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down("sm")]: {
        justifyContent: "space-between",
        "& h2": {
          fontSize: " 18px",
        },
        "& span": {
          fontSize: "12px",
        },
      },
      [theme.breakpoints.down("xs")]: {
        "& h2": {
          fontSize: " 18px",
        },
        "& span": {
          fontSize: "12px",
        },
      },
    },
    getAppoint: {
      width: "170px",
      fontSize: "13px !important",
      lineHeight: "15px",
      color: "white",
      borderRadius: "20px",
      height: "40px",
      outline: "none",
      cursor: "pointer",
      minWidth: "115px",
      margin: "auto",
      border: "none",
      [theme.breakpoints.down("sm")]: {
        width: "170px",
        fontSize: "12px !important",
      },
      [theme.breakpoints.down("xs")]: {
        width: "130px",
        fontSize: "10px !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "10px !important",
        lineHeight: "12px",
        height: "30px",
      },
      ["@media (max-width:375px)"]: {
        width: "100px",
        minWidth: "100px",
      },
      "&:hover": {
        opacity: 0.8,
      },
    },
    timePanelWrapp: {
      // justifyContent: "space-around",
      [theme.breakpoints.down("sm")]: {
        justifyContent: "flex-start",
        "& p": {
          fontSize: "16px",
        },
      },
      [theme.breakpoints.down("xs")]: {
        "& p": {
          fontSize: "12px",
        },
      },
    },
    item1: {
      order: 1,
      [theme.breakpoints.up("lg")]: {
        order: 1,
      },
    },
    item2: {
      order: 2,
      [theme.breakpoints.up("lg")]: {
        order: 2,
      },
    },
    directions: {
      color: "black",
      marginLeft: "10px",
      fontWeight: "bold",
      "&:hover": {
        color: "rgba(0,0,0,0.4)",
      },
    },
    nonHoverEffect: {
      textDecoration: "none !important",
      opacity: "1 !important",
      cursor: "default !important",
    },
    phoneText: {
      marginLeft: "10px",
      textDecoration: "none",
      "&:hover": {
        opacity: 0.6,
      },
    },
  })
)
