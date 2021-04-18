import React, { useState, useEffect } from "react"
import Geocode from "react-geocode"
import { findLocationAPI } from "../services/"
import { storesDetails } from "../store/"

Geocode.setApiKey("")
Geocode.enableDebug()

const usePos = () => {
  const [pos, setPos] = useState({ lat: "", long: "" })
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoords)
    } else {
      alert("GeoLocation not enabled")
    }
  }

  /* -- get formated address from geocode via api --
  useEffect(() => {    
    if (pos.lat) {      
      Geocode.fromLatLng(pos.lat, pos.long).then(
        (response:any) => {
          const address = response.results[0].formatted_address;
          console.log(address);
        },
        (error:any) => {
          console.error(error);
        }
      );
    }
  }, [pos]);
  ------------------------------------------------- */

  const getCoords = (pos: any) => {
    setPos({
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    })
  }

  getLocation()

  return { lat: pos.lat, long: pos.long }
}

const findGeoLoc = (geoPos: any) => {
  const geoData: any = {
    longitude: geoPos.long,
    latitude: geoPos.lat,
  }
  findLocationAPI
    .findGeoLocation(storesDetails.store_id, geoData)
    .then((res: any) => {
      storesDetails.changeFindAddLocation(res.data)
    })
    .catch((error) => {
      console.log("Error to find location with GeoCode", error)
    })
}

const GetUserLocation = () => {
  const pos = usePos()

  useEffect(() => {
    if (pos.lat) {
      findGeoLoc(pos)
    }
  }, [pos])

  return (
    <div style={{ display: "none" }}>
      <p>Lat {pos.lat}</p>
      <p>Long: {pos.long}</p>
    </div>
  )
}

export default GetUserLocation
