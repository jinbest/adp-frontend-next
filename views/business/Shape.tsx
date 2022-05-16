import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../../store"

const Shape = () => {
  const data = storesDetails.storeCnts
  const shapeData = data.businessPage.shapeData
  const classes = useStyles()
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
        <div>
          <div className={classes.corner}>
            <img
              src={shapeData.businessCornerShape}
              width="1"
              height="auto"
              alt="business-corner-shape"
            />
          </div>
          <div className={classes.leftDesktop}>
            <img
              src={shapeData.shapeLeftDesktop}
              width="1"
              height="auto"
              alt="business-left-shape-desktop"
            />
          </div>
          <div className={classes.leftMobile}>
            <img
              src={shapeData.shapeLeftMobile}
              width="1"
              height="auto"
              alt="business-left-shape-mobile"
            />
          </div>
        </div>
      }
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
        minWidth: "290px",
        top: 0,
      },
      ["@media (max-width:425px)"]: {
        top: 30,
      },
    },
    leftDesktop: {
      position: "absolute",
      top: 300,
      left: 0,
      width: "10vw",
      minWidth: "100px",
      zIndex: -2,
      "& > img": {
        width: "100%",
      },
      ["@media (max-width:1500px)"]: {
        top: 200,
      },
      ["@media (max-width:768px)"]: {
        display: "none",
      },
    },
    leftMobile: {
      position: "absolute",
      top: 150,
      left: 0,
      width: "10vw",
      minWidth: "100px",
      zIndex: -2,
      "& > img": {
        width: "100%",
      },
      display: "none",
      ["@media (max-width:768px)"]: {
        display: "block",
      },
      ["@media (max-width:500px)"]: {
        display: "none",
      },
    },
  })
)
