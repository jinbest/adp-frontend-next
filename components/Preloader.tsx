import React from "react"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      width: "100vw",
      height: "100vh",
      background: "#000",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.1,
    },
    loader: {
      width: "100px !important",
      height: "100px !important",
      color: "#888",
    },
  })
)

export default function Preloader() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.loader} />
    </div>
  )
}
