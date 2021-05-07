import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../../store"

const Shape = () => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.waveBg}>
        <img src="/img/location-wave-bg.png" alt="location wave bg" />
      </div>
      <div className={classes.skitImg}>
        <img
          src={storesDetails.commonCnts.locationsData.skitterMobile}
          width="1"
          height="auto"
          alt="skitter-mobile"
        />
      </div>
    </div>
  )
}

export default Shape

const useStyles = makeStyles(() =>
  createStyles({
    waveBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      overflow: "hidden !important",
      "& > img": {
        width: "100%",
        minWidth: "1700px",
      },
      zIndex: -2,
      ["@media (max-width:1000px)"]: {
        "& > img": {
          minWidth: "1500px",
        },
      },
      ["@media (max-width:600px)"]: {
        "& > img": {
          minWidth: "180vw",
        },
      },
      ["@media (max-width:500px)"]: {
        "& > img": {
          minWidth: "200vw",
        },
      },
      ["@media (max-width:425px)"]: {
        "& > img": {
          minWidth: "1000px",
        },
      },
      ["@media (max-width:375px)"]: {
        "& > img": {
          minWidth: "950px",
        },
      },
    },
    skitImg: {
      position: "absolute",
      right: "15vw",
      top: "300px",
      width: "450px",
      zIndex: -1,
      "& img": {
        width: "100%",
      },
      ["@media (max-width:1600px)"]: {
        right: "7vw",
      },
      ["@media (max-width:1200px)"]: {
        right: "4vw",
        top: "290px",
        width: "400px",
      },
      ["@media (max-width:1000px)"]: {
        display: "none",
      },
    },
  })
)
