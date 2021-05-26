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
import ApiClient from "../../services/api-client"
import { ToastMsgParams } from "../../components/toast/toast-msg-params"
import Config from "../../config/config"
import Toast from "../../components/toast/toast"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const icon = L.icon({ iconUrl: "/img/marker-icon.png" })

type Props = {
  selectedLocation: any
  features: any[]
  handleStatus: (status: boolean) => void
  handleLocationID: (id: number) => void
  location_id: number
}

const WholeMap = ({
  selectedLocation,
  features,
  handleStatus,
  handleLocationID,
  location_id,
}: Props) => {
  const [t] = useTranslation()
  const locations = storesDetails.findAddLocation
  const buttonCol = storesDetails.storeCnts.general.colorPalle.themeColor
  const apiClient = ApiClient.getInstance()

  const classes = useStyles()
  let centerX = 49.865759
  let centerY = -97.211811
  let zoom = 6
  const [map, setMap] = useState<null | Map>(null)
  const [postCode, setPostCode] = useState("")
  const [isFinding, setIsFinding] = useState(false)
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)

  useEffect(() => {
    if (selectedLocation) {
      centerX = selectedLocation.latitude
      centerY = selectedLocation.longitude
      zoom = 14
    } else if (locations && locations.length > 0) {
      const longitudes = locations.map((v) => v.longitude)
      const latitudes = locations.map((v) => v.latitude)
      const pCenterX = latitudes.reduce((a, b) => a + b, 0) / 5
      const pCenterY = longitudes.reduce((a, b) => a + b, 0) / 5
      const maxRadiusX = Math.max(...latitudes.map((v) => v - centerX))
      const maxRadiusY = Math.max(...longitudes.map((v) => v - centerY))
      const pZoom = 17 / (Math.max(maxRadiusX, maxRadiusY) / 5 + 3)
      centerX = pCenterX
      centerY = pCenterY
      zoom = pZoom
    } else {
      centerX = 49.865759
      centerY = -97.211811
      zoom = 6
    }
    if (map) {
      map.setView([centerX, centerY], zoom)
    }
  }, [selectedLocation, map])

  const openPopup = (marker: any) => {
    if (marker && typeof window !== "undefined") {
      window.setTimeout(() => {
        marker.openPopup()
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

    try {
      setIsFinding(true)
      const apiURL = `${Config.STORE_SERVICE_API_URL}dc/store/${storesDetails.store_id}/locations/address`
      const findLocs = await apiClient.post<any[]>(apiURL, infoData)
      storesDetails.changeFindAddLocation(findLocs)
      storesDetails.changeLocationID(storesDetails.findAddLocation[0].id)
      storesDetails.changeCntUserLocation(makeLocations([storesDetails.findAddLocation[0]]))
      storesDetails.changeCntUserLocationSelected(true)
    } catch (error) {
      setToastParams({
        msg: t("Error to find location with Postal Code, please check your postcode."),
        isError: true,
      })
    } finally {
      setIsFinding(false)
      setPostCode("")
    }
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
          center={[centerX, centerY]}
          zoom={zoom}
          scrollWheelZoom={false}
          whenCreated={setMap}
          className={classes.mapContainer}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {[selectedLocation].length &&
            [selectedLocation].map((element, index) => {
              return (
                <Marker
                  position={[element.latitude, element.longitude]}
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
