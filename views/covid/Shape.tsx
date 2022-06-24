import React from "react"
import { storesDetails } from "../../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"

const Shape = () => {
  const classes = useStyles()
  const data = storesDetails.commonCnts
  const themeType = storesDetails.storeCnts.general?.themeType

  return (
    <div>
      {themeType === "marnics" ?
        <div className="marnics-banner-container">
          <div className="marnics-banner-bg">
            <div className="marnics-banner1 marnics-banner-left" />
            <div className="marnics-banner1 marnics-banner-right" />
          </div>
          <div className="marnics-banner-bg">
            <div className="marnics-banner2 marnics-banner2-left" />
            <div className="marnics-banner2 marnics-banner2-right" />
          </div>
        </div> :
        <div className={`${classes.shape} covid-shape`}>
          <img
            className={classes.shapeImg}
            src={data.covidBannerImg}
            width="1"
            height="auto"
            alt="covid-banner"
          />
          <div className="covid-back" />
        </div>
      }
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
