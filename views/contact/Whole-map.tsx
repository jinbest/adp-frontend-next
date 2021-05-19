import React, { useEffect, useState } from "react"
import { createStyles, makeStyles, Grid } from "@material-ui/core"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import { Map } from "leaflet"
import LocationsAccordion from "./Locations-Accordion"
import FindStoreSearch from "../../components/FindStoreSearch"
import { getAddress } from "../../services/helper"
import { useTranslation } from "react-i18next"
import { observer } from "mobx-react"
import { storesDetails } from "../../store"
import "leaflet/dist/leaflet.css"

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
  const locations = storesDetails.allLocations
  const buttonCol = storesDetails.storeCnts.general.colorPalle.themeColor

  const classes = useStyles()
  let centerX = 49.865759
  let centerY = -97.211811
  let zoom = 6
  const [map, setMap] = useState<null | Map>(null)

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

  return (
    <div>
      <MapContainer
        center={[centerX, centerY]}
        zoom={zoom}
        scrollWheelZoom={true}
        className={classes.mapContainer}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {[selectedLocation].length &&
          [selectedLocation].map((element, index) => {
            return (
              <Marker position={[element.latitude, element.longitude]} key={index} ref={openPopup}>
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
      <div className={classes.customContainer}>
        <Grid container spacing={3} className={classes.customComponent}>
          <Grid item xs={12} md={4} style={{ maxWidth: "500px", margin: "auto" }}>
            <LocationsAccordion
              features={features}
              handleStatus={handleStatus}
              handleLocationID={handleLocationID}
              location_id={location_id}
            />
          </Grid>
          <Grid item xs={12} md={8} style={{ height: "fit-content" }}>
            <FindStoreSearch
              placeholder={t("Enter your postal code")}
              color="rgba(0,0,0,0.8)"
              bgcolor="white"
              border="rgba(0,0,0,0.2)"
              buttonCol={buttonCol}
              handleChange={() => {
                //EMPTY
              }}
              handleButtonClick={() => {
                //EMPTY
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
export default observer(WholeMap)

const useStyles = makeStyles(() =>
  createStyles({
    mapContainer: {
      height: "100vh",
      overflow: "hidden !important",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1,
      ["@media (max-width:960px)"]: {
        height: "200vh",
      },
    },
    customContainer: {
      position: "absolute",
      zIndex: 2,
      width: "100%",
      height: 0,
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
    },
  })
)
