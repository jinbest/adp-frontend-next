import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import { phoneFormatString } from "../../../services/helper"
import { StoreLocation } from "../../../model/store-location"

type Props = {
  location: StoreLocation
}

const AddressViewer = ({ location }: Props) => {
  const classes = useStyles()

  return (
    <>
      <Typography className={classes.cardText}>{`${location.address_1},`}</Typography>
      <Typography className={classes.cardText}>
        {`${location.address_2 ? location.address_2 + ", " : ""}${
          location.city ? location.city + ", " : ""
        } ${location.state ? location.state + " " : ""} ${
          location.postcode
            ? location.postcode.substring(0, 3) +
              " " +
              location.postcode.substring(3, location.postcode.length)
            : ""
        }`}
      </Typography>
      <a href={`tel:${location.phone}`} className={classes.link}>
        <Typography className={classes.cardText}>{phoneFormatString(location.phone, 1)}</Typography>
      </a>
    </>
  )
}

export default AddressViewer

const useStyles = makeStyles(() =>
  createStyles({
    cardText: {
      fontSize: "15px",
      marginBottom: "5px",
      color: "black",
      ["@media (max-width:1400px)"]: {
        fontSize: "13px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "15px",
      },
      ["@media (max-width:700px)"]: {
        fontSize: "13px",
        marginBottom: "3px",
      },
      ["@media (max-width:400px)"]: {
        fontSize: "12px",
        marginBottom: "2px",
      },
    },
    link: {
      textDecoration: "none",
      display: "inline-block",
    },
  })
)
