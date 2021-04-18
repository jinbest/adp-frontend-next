import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      textAlign: "center",
      marginTop: "350px",
      marginBottom: "100px",
    },
    title: {
      fontSize: "50px",
      padding: "0 50px 50px",
    },
    button: {
      fontSize: "30px",
      padding: "5px 30px",
      backgroundColor: "#666",
      color: "white",
      borderRadius: "50px",
      textDecoration: "none",
      outline: "none",
      "&:hover": {
        backgroundColor: "#333",
      },
    },
  })
)

const Error = () => {
  const classes = useStyles()
  const [t] = useTranslation()

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>
        {t("OOPS! WE UNFORTUNATELY DO NOT HAVE AN OFFER FOR YOUR DEVICE AT THIS TIME.")}
      </h1>
      <a href="/" className={classes.button}>
        {t("Return to Home")}
      </a>
    </div>
  )
}

export default Error
