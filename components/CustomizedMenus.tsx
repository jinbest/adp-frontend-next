import React, { useState, useEffect } from "react"
import { withStyles, createStyles, makeStyles } from "@material-ui/core/styles"
import Menu, { MenuProps } from "@material-ui/core/Menu"
import Button from "./Button"
import InputComponent from "./InputComponent"
import { useTranslation } from "react-i18next"
import { repairWidgetStore, storesDetails } from "../store/"
import { findLocationAPI } from "../services/"
import { Link } from "react-router-dom"
import { observer } from "mobx-react"
import { ToastMsgParams } from "./toast/toast-msg-params"
import Toast from "./toast/toast"
import Loading from "./Loading"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { makeLocations, getAddress, AddFormat12, getConvertHourType } from "../services/helper"

const StyledMenu = withStyles({
  paper: {
    borderRadius: "15px",
    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    overflow: "inherit !important",
    marginTop: "5px",
    border: "1px solid #C4C4C4",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))

const useStyles = makeStyles(() =>
  createStyles({
    nonHoverEffect: {
      textDecoration: "none !important",
      opacity: "1 !important",
      cursor: "default !important",
    },
  })
)
interface Props {
  btnTitle: string
  width: string
  features: any[]
}

const CustomizedMenus = ({ btnTitle, width, features }: Props) => {
  const data = storesDetails.storeCnts
  const themeColor = data.general.colorPalle.themeColor
  const underLineCol = data.general.colorPalle.underLineCol
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [t] = useTranslation()
  const [pos, setPos] = useState({ latitude: "", longitude: "" })
  const [locSelStatus, setLocSelStatus] = useState(storesDetails.cntUserLocationSelected)
  const [locations, setLocations] = useState<any[]>(storesDetails.cntUserLocation)
  const [requireUserInfo, setRequireUserInfo] = useState(false)
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)
  const [postCode, setPostCode] = useState("")
  const [isRequest, setIsRequest] = useState(false)
  const [myStore, setMyStore] = useState("My Store")

  const classes = useStyles()

  const handleLocSelect = (index: number) => {
    const cntLocation: any = storesDetails.cntUserLocation[index]
    setLocations([cntLocation])
    storesDetails.changeLocationID(cntLocation.location_id)
    setLocSelStatus(true)
  }

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const setCoords = (pos: any) => {
    setPos({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    })
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

  // navigator.geolocation.getCurrentPosition(() => {})

  useEffect(() => {
    if (Boolean(anchorEl)) {
      if (storesDetails.cntUserLocation.length) {
        return
      }
      if (navigator.platform.includes("Mac")) {
        setRequireUserInfo(true)
        return
      }
      navigator.permissions
        ? navigator.permissions.query({ name: "geolocation" }).then(function (PermissionStatus) {
            if (PermissionStatus.state == "granted") {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setCoords)
                setRequireUserInfo(false)
              } else {
                console.log("Geolocation is not supported by this browser.")
                setRequireUserInfo(true)
              }
            } else if (PermissionStatus.state == "prompt") {
              console.log("not yet grated or denied")
              setRequireUserInfo(true)
            } else {
              setRequireUserInfo(true)
              setPos({ latitude: "", longitude: "" })
            }
          })
        : setRequireUserInfo(true)
    }
  }, [anchorEl])

  useEffect(() => {
    if (!requireUserInfo && pos.latitude) {
      if (locations.length) return
      findLocationAPI
        .findGeoLocation(storesDetails.store_id, pos)
        .then((res: any) => {
          if (res.length) {
            storesDetails.changeFindAddLocation(res)
            setLocations(makeLocations([storesDetails.findAddLocation[0]]))
            storesDetails.changeLocationID(storesDetails.findAddLocation[0].id)
          } else {
            setToastParams({
              msg: "Response is an empty data, please input your infos.",
              isWarning: true,
            })
            setPos({ latitude: "", longitude: "" })
            setRequireUserInfo(true)
          }
        })
        .catch((error) => {
          console.log("Error to find location with GeoCode", error)
          setToastParams({
            msg: "Error to find location with GeoCode.",
            isError: true,
          })
          setPos({ latitude: "", longitude: "" })
          setRequireUserInfo(true)
        })
    }
  }, [pos, locations])

  useEffect(() => {
    storesDetails.changeCntUserLocationSelected(locSelStatus)
    if (locations.length <= 1) {
      setMyStore(t("Nearest Location"))
    } else {
      setMyStore(t("All Locations"))
    }
    if (locSelStatus) {
      setMyStore(t("Selected Location"))
    }
  }, [locSelStatus, locations])

  useEffect(() => {
    storesDetails.changeCntUserLocation(locations)
  }, [locations])

  const viewMoreStores = () => {
    setLocations(makeLocations(storesDetails.findAddLocation))
    setLocSelStatus(false)
  }

  const handleBookRepair = () => {
    repairWidgetStore.init()
  }

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

  useEffect(() => {
    if (storesDetails.allLocations.length > 1 || !storesDetails.allLocations.length) return
    storesDetails.changeFindAddLocation(storesDetails.allLocations)
    storesDetails.changeCntUserLocationSelected(true)
    setLocations(makeLocations(storesDetails.allLocations))
    setLocSelStatus(true)
    storesDetails.changeLocationID(storesDetails.allLocations[0].id)
  }, [])

  const handleGetLocation = (poscode: string) => {
    if (!poscode) return
    const infoData: any = {
      city: "",
      state: "",
      postcode: poscode,
      country: "",
    }
    setIsRequest(true)
    findLocationAPI
      .findAddLocation(storesDetails.store_id, infoData)
      .then((res: any) => {
        if (res.length) {
          storesDetails.changeFindAddLocation(res)
          setLocations(makeLocations([storesDetails.findAddLocation[0]]))
          storesDetails.changeLocationID(storesDetails.findAddLocation[0].id)
          setRequireUserInfo(false)
        } else {
          setToastParams({
            msg: "Response is an empty data, please check your infos.",
            isWarning: true,
          })
          setIsRequest(false)
        }
      })
      .catch((error) => {
        console.log("Error to find location with Address", error)
        setToastParams({
          msg: "Error to find location with Postal Code, please check your code.",
          isError: true,
        })
        setIsRequest(false)
      })
  }

  return (
    <div>
      <Button
        title={
          !locSelStatus
            ? t(btnTitle)
            : storesDetails.cntUserLocation[0] && AddFormat12(storesDetails.cntUserLocation[0])
        }
        bgcolor={!locSelStatus ? themeColor : "transparent"}
        txcolor={!locSelStatus ? "white" : "black"}
        border={!locSelStatus ? "1px solid rgba(0,0,0,0.1)" : "none"}
        textDecorator={!locSelStatus ? "none" : "underline"}
        borderR="20px"
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        icon={true}
        fontSize="17px"
        width={!locSelStatus ? width : "auto"}
        hover={!locSelStatus ? true : false}
      />
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className="triangle" style={{ right: "65px" }}></div>
        <div className="menu-content-div">
          <div
            className="left-content"
            style={{
              width: locSelStatus || !locations.length ? "215px" : "500px",
            }}
          >
            <div className="content-block">
              {storesDetails.cntUserLocation.length || !requireUserInfo ? (
                <p className="block-title">{myStore}</p>
              ) : (
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
                    bgcolor={themeColor}
                    borderR="20px"
                    width="80%"
                    height="30px"
                    margin="10px auto"
                    fontSize="15px"
                    disable={isRequest}
                    onClick={() => handleGetLocation(postCode)}
                  >
                    {isRequest && <Loading />}
                  </Button>
                </div>
              )}
              <div className="custom-menu-locations-container">
                {storesDetails.cntUserLocation.map((item: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <p
                        onClick={() => handleLocSelect(index)}
                        className={
                          "block-content" + (locSelStatus ? ` ${classes.nonHoverEffect}` : "")
                        }
                      >
                        {item.distance
                          ? item.location_name +
                            ", " +
                            AddFormat12(item) +
                            " (" +
                            item.distance +
                            ")"
                          : item.location_name + ", " + AddFormat12(item)}
                      </p>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
            <div className="content-block">
              {locSelStatus && (
                <a
                  className="link"
                  style={{ color: underLineCol }}
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
              {storesDetails.findAddLocation.length > 1 &&
                !requireUserInfo &&
                locations.length < storesDetails.findAddLocation.length && (
                  <a className="link" style={{ color: underLineCol }} onClick={viewMoreStores}>
                    {t("View More Stores")}
                  </a>
                )}
              {locSelStatus && (
                <a
                  className="link"
                  style={{ color: underLineCol }}
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
            {locSelStatus && (
              <FeatureToggles features={features}>
                <Feature
                  name="FRONTEND_REPAIR_APPOINTMENT"
                  inactiveComponent={() => <></>}
                  activeComponent={() => (
                    <>
                      <style jsx>{`
                        a {
                          text-decoration: none;
                        }
                      `}</style>
                      <Link to={data.general.routes.repairWidgetPage}>
                        <div onClick={handleBookRepair}>
                          <Button
                            title={t("Book Appointment")}
                            bgcolor={themeColor}
                            borderR="20px"
                            width="175px"
                            height="30px"
                            margin="0"
                            fontSize="15px"
                          />
                        </div>
                      </Link>
                    </>
                  )}
                />
              </FeatureToggles>
            )}
          </div>
          {locSelStatus && (
            <React.Fragment>
              <div
                style={{
                  borderLeft: "2px solid rgba(0,0,0,0.25)",
                  margin: "30px 10px",
                }}
              ></div>
              <div style={{ width: "390px" }}>
                {storesDetails.cntUserLocation.map((item: any, id: number) => {
                  return (
                    <div key={id}>
                      {item.days.map((it: any, index: number) => {
                        return (
                          <div key={index}>
                            <p className="block-title">{t("Hours")}</p>
                            <div className="hours-div">
                              <div>
                                {it.wkDys.map((itm: any, idx: number) => {
                                  return (
                                    <p
                                      className="block-content"
                                      style={{
                                        textDecoration: "none",
                                        opacity: 1,
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
                                {item.loc_hours.map((itm: any, idx: number) => {
                                  return (
                                    <p
                                      className="block-content"
                                      style={{
                                        textDecoration: "none",
                                        opacity: 1,
                                        cursor: "default",
                                      }}
                                      key={idx}
                                    >
                                      {!itm.open || !itm.close
                                        ? t("Closed")
                                        : `${getConvertHourType(
                                            itm.open,
                                            item.timezone,
                                            repairWidgetStore.timezone
                                          )} - ${getConvertHourType(
                                            itm.close,
                                            item.timezone,
                                            repairWidgetStore.timezone
                                          )}`}
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
              </div>
            </React.Fragment>
          )}
        </div>
      </StyledMenu>
      <Toast params={toastParams} resetStatuses={resetStatuses} />
    </div>
  )
}

export default observer(CustomizedMenus)
