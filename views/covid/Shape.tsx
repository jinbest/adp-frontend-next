import React from "react"
import { storesDetails } from "../../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Image from "next/image"

const Shape = () => {
  const classes = useStyles()
  const data = storesDetails.commonCnts

  return (
    <div>
      <div className={classes.shape}>
        <Image
          src={data.covidBannerImg}
          layout="responsive"
          width="2000"
          height="1200"
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
        top: "100px",
      },
      ["@media (max-width:425px)"]: {
        top: "150px",
      },
    },
  })
)
