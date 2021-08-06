import React, { useEffect, useState } from "react"
import { createStyles, makeStyles, Grid } from "@material-ui/core"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import { Map } from "leaflet"
import LocationsAccordion from "./Locations-Accordion"
import FindStoreSearch from "../../components/FindStoreSearch"
import { getAddress, makeLocations } from "../../services/helper"
import { useTranslation } from "react-i18next"
import { observer } from "mobx-react"
import { storesDetails } from "../../store"
import { ToastMsgParams } from "../../components/toast/toast-msg-params"
import Toast from "../../components/toast/toast"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { findLocationAPI } from "../../services"
import { isEmpty } from "lodash"

type Props = {
  selectedLocation: any
  setSelectLocation: (val: any) => void
  features: any[]
  handleStatus: (status: boolean) => void
  handleLocationID: (id: number) => void
  location_id: number
  setLocationID: (val: number) => void
}

const WholeMap = ({
  selectedLocation,
  features,
  handleStatus,
  handleLocationID,
  location_id,
  setSelectLocation,
  setLocationID,
}: Props) => {
  const [t] = useTranslation()
  const locations = storesDetails.findAddLocation
  const buttonCol = storesDetails.storeCnts.general.colorPalle.themeColor

  const store_id = storesDetails.store_id

  const icon = L.icon({
    iconUrl: `https://storage.googleapis.com/adp_assets/images/${store_id}/marker-icon.png`,
  })

  const classes = useStyles()
  let centerX = 49.865759
  let centerY = -97.211811

  const [map, setMap] = useState<null | Map>(null)
  const [postCode, setPostCode] = useState("")
  const [isFinding, setIsFinding] = useState(false)
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)
  const [mapLocations, setMapLocations] = useState<any[]>(locations)
  const [centerMap, setCenterMap] = useState<L.LatLngExpression | undefined>([centerX, centerY])
  const [zoom, setZoom] = useState(6)
  const [longitudes, setLongitudes] = useState(locations.map((v) => v.longitude))
  const [latitudes, setLatitudes] = useState(locations.map((v) => v.latitude))

  useEffect(() => {
    _replaceLatLngCode_()
  }, [longitudes, latitudes])

  useEffect(() => {
    let zm = 4
    if (!isEmpty(selectedLocation)) {
      centerX = selectedLocation.latitude
      centerY = selectedLocation.longitude
      zm = 14
      setMapLocations([selectedLocation])
      setLongitudes([selectedLocation.longitude])
      setLatitudes([selectedLocation.latitude])
    } else if (locations && locations.length > 0) {
      const lngs = locations.map((v) => v.longitude)
      const lats = locations.map((v) => v.latitude)
      setMapLocations(locations)
      setLongitudes(lngs)
      setLatitudes(lats)
      const pCenterX = lats.reduce((a, b) => a + b, 0) / locations.length
      const pCenterY = lngs.reduce((a, b) => a + b, 0) / locations.length
      const maxRadiusX = Math.max(...lats.map((v) => v - centerX))
      const maxRadiusY = Math.max(...lngs.map((v) => v - centerY))
      const pZoom = 12 / (Math.max(maxRadiusX, maxRadiusY) / 5 + 3)
      centerX = pCenterX
      centerY = pCenterY
      zm = pZoom
    } else {
      centerX = 49.865759
      centerY = -97.211811
      zm = 6
    }
    setCenterMap([centerX, centerY])
    setZoom(zm)
    if (map) {
      // map.setView([centerX, centerY], zm)
      map.flyTo([centerX, centerY], zm)
    }
  }, [selectedLocation, map])

  const openPopup = (marker: any) => {
    if (marker && typeof window !== "undefined" && !isEmpty(selectedLocation)) {
      window.setTimeout(() => {
        marker.openPopup()
      }, 1000)
    } else if (marker && typeof window !== "undefined") {
      window.setTimeout(() => {
        marker.closePopup()
      }, 1000)
    }
  }

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPostCode(e.target.value)
  }

  const handleClickSearchButton = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (!postCode) return
    findLocation()
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [postCode])

  const onKeyPress = async (event: any) => {
    if (event.key === "Enter" && postCode) {
      findLocation()
    }
  }

  const findLocation = async () => {
    const infoData = {
      city: "",
      state: "",
      postcode: postCode,
      country: "",
    }

    findLocationAPI
      .findAddLocation(storesDetails.store_id, infoData)
      .then((res: any) => {
        if (res.length) {
          storesDetails.changeFindAddLocation(res)
          storesDetails.changeLocationID(storesDetails.findAddLocation[0].id)
          storesDetails.changeCntUserLocation(makeLocations([storesDetails.findAddLocation[0]]))
          storesDetails.changeCntUserLocationSelected(true)
        } else {
          setToastParams({
            msg: "Failed to load locations.",
            isError: true,
          })
        }
      })
      .catch(() => {
        setToastParams({
          msg: t("Something went wrong, failed to fetch locations."),
          isError: true,
        })
      })
      .finally(() => {
        setIsFinding(false)
        setPostCode("")
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

  const _replaceLatLngCode_ = () => {
    for (let idx = 1; idx < locations.length; idx++) {
      let closetX = false,
        closetY = false
      latitudes.forEach((item: number, index: number) => {
        if (index < idx && Math.abs(latitudes[idx] - item) < 0.2) {
          closetX = true
          return
        }
      })
      longitudes.forEach((item: number, index: number) => {
        if (index < idx && Math.abs(longitudes[idx] - item) < 0.2) {
          closetY = true
          return
        }
      })
      if (closetX) {
        latitudes[idx] += 1
        setLatitudes([...latitudes])
      }
      if (closetY) {
        longitudes[idx] += 1
        setLongitudes([...longitudes])
      }
    }
  }

  return (
    <div>
      <div className={classes.customContainer}>
        <Grid container spacing={3} className={classes.customComponent}>
          <Grid item xs={12} md={4} className={classes.item1}>
            <LocationsAccordion
              features={features}
              handleStatus={handleStatus}
              handleLocationID={handleLocationID}
              location_id={location_id}
              setSelectLocation={setSelectLocation}
              setLocationID={setLocationID}
            />
          </Grid>
          <Grid item xs={12} md={8} className={classes.item2}>
            <FindStoreSearch
              placeholder={t("Enter your postal code")}
              color="rgba(0,0,0,0.8)"
              bgcolor="white"
              border="rgba(0,0,0,0.2)"
              buttonCol={buttonCol}
              value={postCode}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeSearch(e)
              }}
              handleButtonClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                await handleClickSearchButton(e)
              }}
              isSubmit={isFinding}
            />
          </Grid>
        </Grid>
        <Toast params={toastParams} resetStatuses={resetStatuses} />
      </div>

      <div className={classes.map}>
        <MapContainer
          center={centerMap}
          zoom={zoom}
          scrollWheelZoom={false}
          touchZoom={false}
          whenCreated={setMap}
          className={classes.mapContainer}
          doubleClickZoom={false}
          dragging={false}
          closePopupOnClick={false}
          // zoomSnap={false}
          // zoomDelta={false}
          trackResize={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapLocations.length &&
            mapLocations.map((element, index) => {
              return (
                <Marker
                  // position={[element.latitude, element.longitude]}
                  position={[latitudes[index], longitudes[index]]}
                  key={index}
                  ref={openPopup}
                  icon={icon}
                >
                  <Popup>
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
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <h2 className={classes.popupWrapper}>{getAddress(element)}</h2>
                    </a>
                  </Popup>
                </Marker>
              )
            })}
        </MapContainer>
      </div>
    </div>
  )
}
export default observer(WholeMap)

const useStyles = makeStyles(() =>
  createStyles({
    map: {
      height: "calc(100vh + 200px)",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1,
      overflow: "hidden !important",
      ["@media (max-width:960px)"]: {
        position: "relative",
        width: "calc(100% - 60px)",
        margin: "0 auto 50px",
        height: "500px",
      },
      ["@media (max-width:425px)"]: {
        width: "calc(100% - 40px)",
      },
    },
    mapContainer: {
      height: "calc(100vh + 200px)",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      ["@media (max-width:960px)"]: {
        height: "500px",
      },
    },
    customContainer: {
      position: "absolute",
      zIndex: 2,
      width: "100%",
      height: 0,
      ["@media (max-width:960px)"]: {
        position: "inherit",
        height: "fit-content",
        paddingTop: "170px",
      },
      ["@media (max-width:425px)"]: {
        paddingTop: "180px",
      },
    },
    popupWrapper: {
      fontSize: "12px !important",
    },
    customComponent: {
      maxWidth: "1440px",
      width: "95%",
      padding: "170px 0 50px",
      margin: "0 0 0 100px",
      height: 0,
      ["@media (max-width:1600px)"]: {
        margin: "auto !important",
      },
      ["@media (max-width:960px)"]: {
        padding: "0 0 50px",
        height: "fit-content",
      },
    },
    item1: {
      maxWidth: "500px",
      margin: "auto",
      order: 1,
      ["@media (max-width:960px)"]: {
        order: 2,
      },
    },
    item2: {
      height: "fit-content",
      order: 2,
      ["@media (max-width:960px)"]: {
        order: 1,
      },
    },
  })
)
