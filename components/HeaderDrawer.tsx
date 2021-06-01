import React, { useEffect, useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Button from "./Button"
import InputComponent from "./InputComponent"
import LangDropdown from "./LangDropdown"
import Loading from "./Loading"
import { observer } from "mobx-react"
import { ToastMsgParams } from "./toast/toast-msg-params"
import Toast from "./toast/toast"
import { storesDetails } from "../store"
import { makeLocations } from "../services/helper"
import { findLocationAPI } from "../services/"
import { repairWidgetStore } from "../store/"
import {
  getAddress,
  isExternal,
  DuplicatedNavItem,
  isOriginSameAsLocation,
  isSlugLink,
} from "../services/helper"
import _ from "lodash"

type Anchor = "top" | "left" | "bottom" | "right"

type NavItemProps = {
  href: string
  text: string
  flag: string
  order: number
  visible: boolean
}

interface Props {
  children?: any
  toggleMenuStatus: (val: boolean) => void
  handleStatus: (status: boolean) => void
  features: any[]
  themeCol: string
}

const HeaderDrawer = (props: Props) => {
  const { children, toggleMenuStatus, handleStatus, features, themeCol } = props
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.header
  const navItemLinks: NavItemProps[] = _.sortBy(data.homepage.header.navItems, (o) => o.order)
  const brandItemLinks = _.sortBy(data.homepage.header.brandItems, (o) => o.order)
  const [t] = useTranslation()

  const classes = useStyles()
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const [modalStatus, setModalStatus] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [storeStatus, setStoreStatus] = useState(false)
  const [locSelStatus, setLocSelStatus] = useState(false)
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)
  const [requireUserInfo, setRequireUserInfo] = useState(false)
  const [pos, setPos] = useState({ latitude: "", longitude: "" })
  const [locations, setLocations] = useState<any[]>(storesDetails.cntUserLocation)
  const [postCode, setPostCode] = useState("")

  useEffect(() => {
    if (storesDetails.findAddLocation.length) {
      setStoreStatus(true)
    }
    setLocSelStatus(storesDetails.cntUserLocationSelected)
  }, [])

  const handleFindStore = () => {
    if (!storeStatus) {
      setGeoPos()
    } else {
      handleModalOpen()
    }
  }

  const handleModalOpen = () => {
    setModalStatus(true)
  }

  const handleModalClose = () => {
    setModalStatus(false)
    setLoadingStatus(false)
  }

  const setCoords = (pos: any) => {
    setPos({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    })
  }

  // navigator.geolocation.getCurrentPosition(() => {})

  const setGeoPos = () => {
    if (navigator.platform.includes("Mac")) {
      setRequireUserInfo(true)
      handleModalOpen()
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords(pos)
        setRequireUserInfo(false)
      },
      () => {
        setRequireUserInfo(true)
        handleModalOpen()
      }
    )
  }

  useEffect(() => {
    if (!requireUserInfo && pos.latitude) {
      if (locations.length) return
      setLoadingStatus(true)
      findLocationAPI
        .findGeoLocation(storesDetails.store_id, pos)
        .then((res: any) => {
          if (res.length) {
            storesDetails.changeFindAddLocation(res)
            setLocations(makeLocations(storesDetails.findAddLocation))
            storesDetails.changeLocationID(res[0].id)
            setStoreStatus(true)
            setModalStatus(true)
          } else {
            setToastParams({
              msg: "Response is an empty data, please input your infos.",
              isWarning: true,
            })
            setPos({ latitude: "", longitude: "" })
            setRequireUserInfo(true)
          }
          setLoadingStatus(false)
        })
        .catch((error) => {
          console.log("Error to find location with GeoCode", error)
          setToastParams({
            msg: "Error to find location with GeoCode.",
            isError: true,
          })
          setPos({ latitude: "", longitude: "" })
          setRequireUserInfo(true)
          setLoadingStatus(false)
        })
    }
  }, [pos, locations])

  useEffect(() => {
    storesDetails.changeCntUserLocation(locations)
  }, [locations])

  useEffect(() => {
    storesDetails.changeCntUserLocationSelected(locSelStatus)
  }, [locSelStatus])

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleGetLocation(event.target.value)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [])

  const handleGetLocation = (poscode: string) => {
    if (!poscode) return
    const data: any = {
      city: "",
      state: "",
      postcode: poscode, // R3P0N2
      country: "",
    }
    setLoadingStatus(true)
    findLocationAPI
      .findAddLocation(storesDetails.store_id, data)
      .then((res: any) => {
        if (res.length) {
          storesDetails.changeFindAddLocation(res)
          setLocations(makeLocations(storesDetails.findAddLocation))
          storesDetails.changeLocationID(res[0].id)
        } else {
          setToastParams({
            msg: "Response is an empty data, please check your infos.",
            isWarning: true,
          })
        }
        setRequireUserInfo(false)
        setStoreStatus(true)
        setLoadingStatus(false)
      })
      .catch((error) => {
        console.log("Error to find location with Address", error)
        setToastParams({
          msg: "Error to find location with Postal Code, please check your code.",
          isError: true,
        })
        setLoadingStatus(false)
      })
  }

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
    toggleMenuStatus(open)
  }

  const resetStatuses = () => {
    setToastParams({
      msg: "",
      isError: false,
      isWarning: false,
      isInfo: false,
      isSuccess: false,
    })
  }

  const handleLocSelect = (index: number) => {
    const cntLocation: any = storesDetails.cntUserLocation[index]
    setLocations([cntLocation])
    storesDetails.changeLocationID(cntLocation.location_id)
    setLocSelStatus(true)
  }

  const viewMoreStores = () => {
    setLocations(makeLocations(storesDetails.findAddLocation))
    setLocSelStatus(false)
  }

  const handleBookRepair = () => {
    setModalStatus(false)
    setState({ ...state, ["left"]: false })
    repairWidgetStore.init()
    toggleMenuStatus(false)
  }

  return (
    <React.Fragment>
      <div onClick={toggleDrawer("left", true)}>{children}</div>
      <Drawer anchor="left" open={state["left"]} onClose={toggleDrawer("left", false)}>
        <div className={classes.root}>
          <div className={classes.drawerLogo}>
            <img src={data.logoData.logoHeaderImg} alt="drawer-logo" width="1" height="auto" />
          </div>
          {navItemLinks.map((item: NavItemProps, index: number) => {
            return (
              <React.Fragment key={index}>
                {item.visible ? (
                  <React.Fragment>
                    {item.href && item.href !== "#" && (
                      <div
                        className={classes.itemDiv}
                        onClick={() => {
                          setState({ ...state, ["left"]: false })
                          toggleMenuStatus(false)
                          handleStatus(true)
                        }}
                      >
                        {isExternal(item.href) ? (
                          <>
                            {isOriginSameAsLocation(item.href) ? (
                              <a href={item.href} style={{ display: "flex" }}>
                                {t(item.text)}
                              </a>
                            ) : (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "flex" }}
                              >
                                {t(item.text)}
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            {isSlugLink(item.href) ? (
                              <a href={item.href} style={{ display: "flex" }}>
                                {t(item.text)}
                              </a>
                            ) : (
                              <Link to={item.href} style={{ display: "flex" }}>
                                {t(item.text)}
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <></>
                )}
              </React.Fragment>
            )
          })}
          {brandItemLinks.map((item: any, index: number) => {
            return (
              <React.Fragment key={index}>
                {item.visible && !DuplicatedNavItem(navItemLinks, item) ? (
                  <React.Fragment>
                    {item.href && item.href !== "#" && (
                      <div
                        className={classes.itemDiv}
                        onClick={() => {
                          setState({ ...state, ["left"]: false })
                          toggleMenuStatus(false)
                          handleStatus(true)
                        }}
                      >
                        {isExternal(item.href) ? (
                          <>
                            {isOriginSameAsLocation(item.href) ? (
                              <a href={item.href} style={{ display: "flex" }}>
                                {t(item.text)}
                              </a>
                            ) : (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "flex" }}
                              >
                                {t(item.text)}
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            {isSlugLink(item.href) ? (
                              <a href={item.href} style={{ display: "flex" }}>
                                {t(item.text)}
                              </a>
                            ) : (
                              <Link to={item.href} style={{ display: "flex" }}>
                                {t(item.text)}
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <></>
                )}
              </React.Fragment>
            )
          })}
          {data.homepage.header.visibility.covidPage && (
            <div
              className={classes.itemDiv}
              onClick={() => {
                setState({ ...state, ["left"]: false })
                toggleMenuStatus(false)
                handleStatus(true)
              }}
            >
              <Link
                to={data.homepage.footer.bottomLinks.covidPage.link}
                style={{ display: "flex" }}
              >
                {t(data.homepage.footer.bottomLinks.covidPage.text)}
              </Link>
            </div>
          )}
          <div className={classes.findStoreDiv}>
            <Button
              title={t("Find a Store")}
              bgcolor={themeCol}
              borderR="20px"
              width="80%"
              height="40px"
              margin="10px auto"
              fontSize="17px"
              disable={loadingStatus}
              onClick={handleFindStore}
            >
              {loadingStatus && <Loading />}
            </Button>
          </div>
          {thisPage.visibility.lang && <LangDropdown />}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalStatus}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <div className={classes.paper}>
              {!storeStatus && requireUserInfo && (
                <div style={{ textAlign: "center" }}>
                  <InputComponent
                    value={postCode}
                    placeholder={t("Postal Code*")}
                    handleChange={(e) => {
                      setPostCode(e.target.value)
                    }}
                  />
                  <Button
                    title={t("Get Location")}
                    bgcolor={themeCol}
                    borderR="20px"
                    width="80%"
                    height="30px"
                    margin="10px auto"
                    fontSize="15px"
                    disable={loadingStatus}
                    onClick={() => handleGetLocation(postCode)}
                  >
                    {loadingStatus && <Loading />}
                  </Button>
                </div>
              )}
              {storeStatus && (
                <React.Fragment>
                  <div className="custom-menu-locations-container">
                    {storesDetails.cntUserLocation.map((item: any, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <p
                            onClick={() => handleLocSelect(index)}
                            className={
                              "block-content" + (locSelStatus ? ` ${classes.nonHoverEffect}` : "")
                            }
                            style={{
                              fontSize: locSelStatus ? "15px" : "12px",
                              textAlign: locSelStatus ? "center" : "left",
                            }}
                          >
                            {item.location_name +
                              ", " +
                              item.address_1 +
                              " (" +
                              item.distance +
                              ")"}
                          </p>
                        </React.Fragment>
                      )
                    })}
                  </div>
                  {locSelStatus && (
                    <React.Fragment>
                      {storesDetails.cntUserLocation.map((item: any, id: number) => {
                        return (
                          <div key={id}>
                            {item.days.map((it: any, index: number) => {
                              return (
                                <div key={index}>
                                  <p className="block-title" style={{ fontSize: "14px" }}>
                                    {t("Hours")}
                                  </p>
                                  <div className="hours-div">
                                    <div>
                                      {it.wkDys.map((itm: any, idx: number) => {
                                        return (
                                          <p
                                            className="block-content"
                                            style={{
                                              textDecoration: "none",
                                              opacity: 1,
                                              fontSize: "14px",
                                              cursor: "default",
                                            }}
                                            key={idx}
                                          >
                                            {t(itm)}
                                          </p>
                                        )
                                      })}
                                    </div>
                                    <div>
                                      {item.hours[index].hrs.map((itm: any, idx: number) => {
                                        return (
                                          <p
                                            className="block-content"
                                            style={{
                                              textDecoration: "none",
                                              opacity: 1,
                                              fontSize: "14px",
                                              cursor: "default",
                                            }}
                                            key={idx}
                                          >
                                            {itm === "Closed" ? t(itm) : itm}
                                          </p>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  )}
                  <div className="content-block">
                    {locSelStatus && (
                      <a
                        className="link"
                        style={{ color: themeCol, fontSize: "12px" }}
                        href={
                          storesDetails.cntUserLocation[0] &&
                          storesDetails.cntUserLocation[0].business_page_link
                            ? storesDetails.cntUserLocation[0].business_page_link
                            : "https://www.google.com/business/"
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("View Store Details")}
                      </a>
                    )}
                    {storesDetails.findAddLocation.length > 1 && (
                      <a
                        className="link"
                        style={{ color: themeCol, fontSize: "12px" }}
                        onClick={viewMoreStores}
                      >
                        {t("View More Stores")}
                      </a>
                    )}
                    {locSelStatus && (
                      <a
                        className="link"
                        style={{ color: themeCol, fontSize: "12px" }}
                        href={`${
                          storesDetails.cntUserLocation[0] &&
                          storesDetails.cntUserLocation[0].business_page_link != null
                            ? storesDetails.cntUserLocation[0].business_page_link
                            : `https://www.google.com/maps/search/?api=1&query=${getAddress(
                                storesDetails.cntUserLocation[0]
                              )
                                .split(" ")
                                .join("+")}`
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("Get Directions")}
                      </a>
                    )}
                  </div>
                  <FeatureToggles features={features}>
                    <Feature
                      name="FRONTEND_REPAIR_APPOINTMENT"
                      inactiveComponent={() => <></>}
                      activeComponent={() => (
                        <Link
                          to={data.general.routes.repairWidgetPage}
                          style={{ textDecoration: "none" }}
                          onClick={handleBookRepair}
                        >
                          <Button
                            title={t("Book Appointment")}
                            bgcolor={themeCol}
                            borderR="20px"
                            width="175px"
                            height="30px"
                            margin="0px 0 10px"
                            fontSize="15px"
                          />
                        </Link>
                      )}
                    />
                  </FeatureToggles>
                </React.Fragment>
              )}
            </div>
          </Modal>
        </div>
      </Drawer>
      <Toast params={toastParams} resetStatuses={resetStatuses} />
    </React.Fragment>
  )
}

export default observer(HeaderDrawer)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 200,
      padding: "30px 20px",
    },
    itemDiv: {
      padding: "10px 0",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      "& > a": {
        textDecoration: "none",
        color: "black",
        fontSize: "14px",
      },
      "&:hover": {
        opacity: 0.5,
      },
    },
    findStoreDiv: {
      position: "absolute",
      bottom: "100px",
      width: 200,
      ["@media (max-width:425px)"]: {
        "& button": {
          height: "40px !important",
          fontSize: "15px !important",
        },
      },
    },
    drawerLogo: {
      width: 150,
      margin: "0 auto 10px",
      textAlign: "center",
      "& img": {
        width: "auto",
        maxWidth: "100%",
        height: "100px",
      },
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid rgba(0,0,0,0.1)",
      borderRadius: "10px",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 1),
      outline: "none",
      maxWidth: 300,
    },
    nonHoverEffect: {
      textDecoration: "none !important",
      opacity: "1 !important",
      cursor: "default !important",
    },
  })
)
