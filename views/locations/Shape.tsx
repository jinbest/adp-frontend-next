import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../../store"

const Shape = () => {
  const data = storesDetails.storeCnts
  const shapeData = data.businessPage.shapeData
  const classes = useStyles()

  return (
    <div>
      <div className={classes.corner}>
        <img
          src={shapeData.businessCornerShape}
          width="1"
          height="auto"
          alt="location-corner-shape"
        />
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
    corner: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "35vw",
      minWidth: "400px",
      zIndex: -2,
      "& > img": {
        width: "100%",
      },
      ["@media (max-width:768px)"]: {
        top: 30,
        minWidth: "350px",
      },
      ["@media (max-width:500px)"]: {
        display: "none",
      },
    },
    skitImg: {
      position: "absolute",
      right: "15vw",
      top: "350px",
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
