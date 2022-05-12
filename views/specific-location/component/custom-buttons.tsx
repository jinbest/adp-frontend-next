import React from "react"
import Button from "../../../components/Button"
import { StoreLocation } from "../../../model/store-location"
import { getAddress } from "../../../services/helper"
import { useTranslation } from "react-i18next"
import { createStyles, makeStyles } from "@material-ui/core/styles"

type Props = {
  location: StoreLocation
  color: string
}

const CustomButtons = ({ location, color }: Props) => {
  const [t] = useTranslation()
  const classes = useStyles()

  return (
    <div className={`${classes.container} location-button-container`}>
      <a
        href={`${
          location.business_page_link != null
            ? location.business_page_link
            : `https://www.google.com/maps/search/?api=1&query=${getAddress(location)
                .split(" ")
                .join("+")}`
        }`}
        target="_blank"
        rel="noreferrer"
        className={classes.link}
      >
        <Button
          title={t("Get Directions")}
          bgcolor={color}
          borderR="20px"
          width="auto"
          margin="10px 10px 0 0"
          fontSize="12px"
          height="25px"
        />
      </a>
      <a href={`tel:${location.phone}`} className={classes.link}>
        <Button
          title={t("Call Now")}
          bgcolor={color}
          borderR="20px"
          width="auto"
          margin="10px 10px 0 0"
          fontSize="12px"
          height="25px"
        />
      </a>
    </div>
  )
}

export default CustomButtons

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      margin: "0 0 10px",
      flexWrap: "wrap",
    },
    link: {
      textDecoration: "none",
      color: "black",
    },
  })
)
