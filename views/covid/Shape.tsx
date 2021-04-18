import React from "react"
import { storesDetails } from "../../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"

const Shape = () => {
  const classes = useStyles()
  const data = storesDetails.commonCnts

  return (
    <div>
      <div className={classes.shape}>
        <img
          className={classes.shapeImg}
          src={data.covidBannerImg}
          width="1"
          height="auto"
          alt="covid-banner"
        />
      </div>
    </div>
  )
}

export default Shape

const useStyles = makeStyles(() =>
  createStyles({
    shape: {
      position: "absolute",
      margin: "auto",
      top: 0,
      width: "100%",
      overflow: "hidden !important",
      zIndex: -2,
      ["@media (max-width:768px)"]: {
        height: "510px",
      },
    },
    shapeImg: {
      width: "100%",
      minWidth: "1000px",
      minHeight: "650px",
      ["@media (max-width:1024px)"]: {
        minHeight: "600px",
      },
      ["@media (max-width:768px)"]: {
        minHeight: "500px",
      },
      ["@media (max-width:425px)"]: {
        minHeight: "380px",
        minWidth: "700px",
      },
    },
  })
)
