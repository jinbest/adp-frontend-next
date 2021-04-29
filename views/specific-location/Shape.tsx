import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../../store"

const Shape = () => {
  const data = storesDetails.storeCnts
  const shapeData = data.businessPage.shapeData
  const classes = useStyles()

  return (
    <div className={classes.corner}>
      <img
        src={shapeData.businessCornerShape}
        width="1"
        height="auto"
        alt="spec-location-corner-shape"
      />
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
        display: "none",
      },
    },
  })
)
