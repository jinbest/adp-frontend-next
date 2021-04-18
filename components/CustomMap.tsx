import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Map } from "leaflet";
import { getAddress } from "../services/helper";

type Props = {
  locations: any[];
  selectedLocation: any;
  isDetail: boolean;
};

const CustomMap = ({ locations, selectedLocation, isDetail }: Props) => {
  const classes = useStyles();
  let centerX = 49.865759;
  let centerY = -97.211811;
  let zoom = 6;
  const [map, setMap] = useState<null | Map>(null);

  useEffect(() => {
    if (isDetail && selectedLocation) {
      centerX = selectedLocation.latitude;
      centerY = selectedLocation.longitude;
      zoom = 14;
    } else if (locations && locations.length > 0) {
      const longitudes = locations.map((v) => v.longitude);
      const latitudes = locations.map((v) => v.latitude);
      const pCenterX = latitudes.reduce((a, b) => a + b, 0) / 5;
      const pCenterY = longitudes.reduce((a, b) => a + b, 0) / 5;
      const maxRadiusX = Math.max(...latitudes.map((v) => v - centerX));
      const maxRadiusY = Math.max(...longitudes.map((v) => v - centerY));
      const pZoom = 17 / (Math.max(maxRadiusX, maxRadiusY) / 5 + 3);
      centerX = pCenterX;
      centerY = pCenterY;
      zoom = pZoom;
    } else {
      centerX = 49.865759;
      centerY = -97.211811;
      zoom = 6;
    }
    if (map) {
      map.setView([centerX, centerY], zoom);
    }
  }, [isDetail, selectedLocation, map]);

  const openPopup = (marker: any) => {
    if (marker && typeof window !== "undefined") {
      window.setTimeout(() => {
        marker.openPopup();
      }, 1000);
    }
  };

  return (
    <div className={classes.mapWrapper}>
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
              <Marker
                position={[element.latitude, element.longitude]}
                key={index}
                ref={openPopup}
              >
                <Popup>
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
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <h2 className={classes.popupWrapper}>
                      {getAddress(element)}
                    </h2>
                  </a>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};
export default CustomMap;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapWrapper: {
      padding: "10px",
    },
    mapContainer: {
      height: "700px",
      overflow: "hidden !important",
      [theme.breakpoints.down("md")]: {
        height: "1000px",
      },
      [theme.breakpoints.down("sm")]: {
        height: "800px",
      },
      [theme.breakpoints.down("xs")]: {
        height: "500px",
      },
    },
    popupWrapper: {
      fontSize: "12px !important",
    },
  })
);
