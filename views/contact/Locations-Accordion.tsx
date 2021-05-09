import React, { useState, useEffect } from "react"
import { createStyles, makeStyles } from "@material-ui/core"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { observer } from "mobx-react"
import { storesDetails, repairWidgetStore } from "../../store"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Link } from "react-router-dom"
import PhoneIcon from "@material-ui/icons/Phone"
import CallSplitIcon from "@material-ui/icons/CallSplit"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { isEmpty } from "lodash"
import {
  // getRegularHours,
  // getHourType,
  getAddress,
  makeLocations,
  phoneFormatString,
} from "../../services/helper"

// const DAYS_OF_THE_WEEK: string[] = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"]

type Props = {
  features: any[]
  handleStatus: (status: boolean) => void
  location_id: number
  handleLocationID: (id: number) => void
}

const LocationsAccordion = ({ features, handleStatus, location_id, handleLocationID }: Props) => {
  const locations = storesDetails.allLocations
  const data = storesDetails.storeCnts
  const [t] = useTranslation()
  const classes = useStyles()
  const [expanded, setExpanded] = useState<number | false>(0)
  const [feats, setFeatures] = useState<any[]>([])

  useEffect(() => {
    const cntFeatures: any[] = []
    for (let i = 0; i < features.length; i++) {
      if (features[i].isActive) {
        cntFeatures.push(features[i].flag)
      }
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
    for (let i = 0; i < locations.length; i++) {
      if (parseInt(locations[i].id) === location_id) {
        setExpanded(i)
        break
      }
    }
  }, [locations, location_id])

  const handleChange = (panel: number) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(panel)
    if (storesDetails.cntUserLocationSelected) {
      handleLocSelect(locations[panel])
    }
    if (isExpanded) {
      handleLocationID(locations[panel].id)
    }
  }

  useEffect(() => {
    if (storesDetails.cntUserLocationSelected && locations.length) {
      for (let i = 0; i < locations.length; i++) {
        if (
          !isEmpty(storesDetails.cntUserLocation) &&
          storesDetails.cntUserLocation[0].location_id === locations[i].id
        ) {
          handleLocationID(locations[i].id)
          setExpanded(i)
          break
        }
      }
      return
    }
  }, [storesDetails.cntUserLocation])

  return (
    <div className={`${classes.container} custom-scroll-bar`}>
      <div
        className={classes.banner}
        style={{ background: storesDetails.storeCnts.homepage.header.brandData.brandThemeCol }}
      >
        {`${storesDetails.allLocations.length} Stores near you`}
      </div>
      {locations.map((element: any, index: number) => {
        return (
          <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
            className={classes.accordion}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
            >
              <h2 className={classes.summaryTitle}>{storesDetails.storesDetails.name}</h2>
              <h2 className={classes.summaryContent}>{getAddress(element)}</h2>
              <div className={classes.directions}>
                <a
                  href={`${
                    element.business_page_link != null
                      ? element.business_page_link
                      : `https://www.google.com/maps/search/?api=1&query=${getAddress(element)
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
                  <span>{t("Directions")}</span>
                </a>
                <div
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
                      {phoneFormatString(element.phone)}
                    </span>
                  </a>
                </div>
              </div>
              <div style={{ display: "flex" }}>
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
                <FeatureToggles features={feats}>
                  <Feature
                    name="FRONTEND_REPAIR_APPOINTMENT"
                    inactiveComponent={() => <></>}
                    activeComponent={() => (
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
                    )}
                  />
                </FeatureToggles>
              </div>
            </AccordionSummary>
            <AccordionDetails
              style={{ display: "block", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
            >
              details
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

export default observer(LocationsAccordion)

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      maxHeight: "500px",
      overflowY: "scroll",
      borderRadius: "5px",
      background: "white",
    },
    banner: {
      height: "40px",
      borderRadius: "5px 5px 0 0",
      color: "white",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
    },
    accordion: {
      margin: "0 !important",
      "& .MuiAccordionSummary-content": {
        margin: "0 !important",
        display: "block !important",
      },
    },
    summaryTitle: {
      fontSize: "14px",
      fontFamily: "Poppins Bold !important",
    },
    summaryContent: {
      fontSize: "14px",
    },
    directions: {
      display: "flex",
      "& a": {
        display: "flex",
        alignItems: "center",
        marginRight: "15px",
        "& svg": {
          marginRight: "5px",
        },
      },
      "& span": {
        color: "black !important",
        marginLeft: "10px",
        fontSize: "14px",
        "&:hover": {
          opacity: 0.6,
        },
      },
    },
    phoneText: {
      marginLeft: "10px",
      textDecoration: "none",
      "&:hover": {
        opacity: 0.6,
      },
    },
    getAppoint: {
      width: "fit-content",
      fontSize: "13px !important",
      lineHeight: "15px",
      color: "white",
      borderRadius: "20px",
      height: "25px",
      outline: "none",
      cursor: "pointer",
      margin: "5px 3px",
      border: "none",
      padding: "0 10px",
      "&:hover": {
        opacity: 0.8,
      },
    },
  })
)
