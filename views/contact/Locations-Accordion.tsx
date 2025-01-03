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
import _, { isEmpty, findIndex } from "lodash"
import { getAddress, makeLocations, phoneFormatString } from "../../services/helper"
import HoursViewer from "../specific-location/component/hours-viewer"
import ContactModal from "../business/ContactModal"
import { featureToggleKeys } from "../../const/_variables"

type Props = {
  features: any[]
  handleStatus: (status: boolean) => void
  location_id: number
  handleLocationID: (id: number) => void
  setSelectLocation: (val: any) => any
  setLocationID: (val: number) => any
}

const LocationsAccordion = ({
  features,
  handleStatus,
  handleLocationID,
  location_id,
  setSelectLocation,
  setLocationID,
}: Props) => {
  const locations = _.sortBy(storesDetails.findAddLocation, (o) =>
    o.distance ? o.distance : o.display_order
  )
  const data = storesDetails.storeCnts
  const [t] = useTranslation()
  const classes = useStyles()
  const [expanded, setExpanded] = useState<number | false>(false)
  const [feats, setFeatures] = useState<any[]>([])
  const [openModal, setOpenModal] = useState(false)

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
    storesDetails.changeCntUserLocation(makeLocations([location]))
    storesDetails.changeLocationID(location.id)
    storesDetails.changeCntUserLocationSelected(true)
  }

  const handleContactModal = (location: any) => {
    handleLocSelect(location)
    setOpenModal(true)
  }

  const handleGetQuote = () => {
    repairWidgetStore.init()
    handleStatus(false)
  }

  useEffect(() => {
    if (location_id < 1) {
      return
    }
    for (let i = 0; i < locations.length; i++) {
      if (parseInt(locations[i].id) === location_id) {
        setExpanded(i)
        break
      }
    }
  }, [locations, location_id])

  const handleChange = (panel: number) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    if (panel === expanded) {
      setExpanded(false)
      setSelectLocation({} as any)
      setLocationID(0)
      return
    }
    if (storesDetails.cntUserLocationSelected) {
      handleLocSelect(locations[panel])
    }
    if (isExpanded) {
      handleLocationID(locations[panel].id)
      setExpanded(panel)
    }
  }

  useEffect(() => {
    if (
      storesDetails.cntUserLocationSelected &&
      locations.length &&
      !isEmpty(storesDetails.cntUserLocation)
    ) {
      const locIndex = findIndex(locations, { id: storesDetails.cntUserLocation[0].location_id })
      if (locIndex > -1) {
        handleLocationID(locations[locIndex].id)
        setExpanded(locIndex)
      }
      return
    }
  }, [storesDetails.cntUserLocation])

  const getBGStyle = () => {
    return storesDetails.storeCnts.homepage.header.brandData.brandThemeCol
  }
  return (
    <div className={`${classes.container} accordion-wrapper`}>
      <div
        className={`${classes.banner} contact-banner`}
        style={{ background: getBGStyle() }}
      >
        {`${storesDetails.findAddLocation.length} Stores near you`}
      </div>
      <div className="accordion-container">
        {locations.map((element: any, index: number) => {
          return (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
              className={`${classes.accordion} accordion ${expanded === index ? "active-accordion" : ""}`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="expandmore" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={`${classes.accordionSummary} accordion-summary`}
              >
                <h2 className={`${classes.summaryTitle} contact-summary-title`}>
                  {element.distance
                    ? `${element.location_name} (${(element.distance / 1000).toFixed(1)}km)`
                    : element.location_name}
                </h2>
                <h2 className={`${classes.summaryContent} contact-summary-content`}>{getAddress(element)}</h2>
                <div className={classes.directions}>
                  <a
                    href={`${element.business_page_link != null
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
                        {phoneFormatString(element.phone, element.phoneFormat)}
                      </span>
                    </a>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
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
                      name={featureToggleKeys.FRONTEND_REPAIR_APPOINTMENT}
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
                  <button
                    className={classes.getAppoint}
                    style={{
                      backgroundColor: data.general.colorPalle.repairButtonCol,
                    }}
                    onClick={() => {
                      handleContactModal(element)
                    }}
                  >
                    {t("Contact Us")}
                  </button>
                </div>
              </AccordionSummary>
              <AccordionDetails className={`${classes.accordionDetails} accordion-details`}>
                <HoursViewer location={element} />
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
      <ContactModal openModal={openModal} handleModal={setOpenModal} />
    </div>
  )
}

export default observer(LocationsAccordion)

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      borderRadius: "5px",
      background: "white",
      maxWidth: "450px",
      margin: "auto",
      boxShadow: "0px 5px 8px 3px rgb(0 0 0 / 20%)",
    },
    banner: {
      height: "60px",
      borderRadius: "5px 5px 0 0",
      color: "white",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      fontSize: "20px",
    },
    accordion: {
      margin: "0 !important",
      "& .MuiAccordionSummary-content": {
        margin: "0 !important",
        display: "block !important",
      },
    },
    accordionSummary: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "0 20px 10px",
      "& .MuiSvgIcon-root": {
        width: "35px",
        height: "35px",
      },
      ["@media (max-width:1200px)"]: {
        padding: "0 15px 10px",
        "& .MuiButtonBase-root": {
          padding: "5px",
        },
      },
    },
    accordionDetails: {
      display: "block",
      padding: "10px 30px",
    },
    summaryTitle: {
      fontSize: "18px",
      margin: 0,
      padding: "10px 0",
      fontFamily: "Poppins Bold !important",
    },
    summaryContent: {
      fontSize: "16px",
      margin: 0,
      padding: "0 0 10px",
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
      ["@media (max-width:1200px)"]: {
        "& svg": {
          fontSize: "1rem",
        },
        "& a": {
          marginRight: "10px",
        },
      },
    },
    phoneText: {
      marginLeft: "10px",
      textDecoration: "none",
      "&:hover": {
        opacity: 0.6,
      },
      ["@media (max-width:1200px)"]: {
        marginLeft: "0px",
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
      ["@media (max-width:1200px)"]: {
        fontSize: "11px !important",
        whiteSpace: "nowrap",
      },
    },
  })
)
