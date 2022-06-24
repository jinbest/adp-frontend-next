import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../store"
import { observer } from "mobx-react"

const Badge = () => {
  const classes = useStyles()

  return (
    <div className={`${classes.root} badge-container`}>
      {typeof storesDetails.commonCnts.badgeImg === "string" ?
        <a href="https://www.devicelist.ca/" target="_blank" rel="noreferrer">
          <img
            src={storesDetails.commonCnts.badgeImg}
            alt="badge-img"
            className={`${classes.badgeImg} badge-image`}
          />
        </a> :
        storesDetails.commonCnts.badgeImg.map((i: any, index: number) => (
          <a href="https://www.devicelist.ca/" target="_blank" rel="noreferrer" key={index}>
            <img
              src={i}
              alt="badge-img"
              className={`${classes.badgeImg} badge-image`}
            />
          </a>
        ))
      }
    </div>
  )
}

export default observer(Badge)

const useStyles = makeStyles(() =>
  createStyles({
    "@keyframes blinker": {
      "0%, 10%, 20%, 30%, 100%": {
        opacity: 1,
        transform: "rotateY(0deg)",
      },
      "5%, 15%": {
        opacity: 1,
        transform: "rotateY(90deg)",
      },
      "25%": {
        opacity: 0,
        transform: "rotateY(0deg)",
      },
    },
    root: {
      position: "fixed",
      left: "20px",
      bottom: "20px",
      display: "flex",
      zIndex: 15,
      "& img": {
        width: "67px"
      },
      ["@media (max-width:500px)"]: {
        display: "none",
      },
    },
    badgeImg: {
      animationName: "$blinker",
      animationDuration: "20s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      minWidth: 67,
      marginRight: 13,
    },
  })
)
