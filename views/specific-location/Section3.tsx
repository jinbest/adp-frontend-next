import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography, Grid } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { Section3 } from "../../model/specific-config-param"
import { observer } from "mobx-react"

type Props = {
  config: Section3
}

const SpecSection3 = ({ config }: Props) => {
  const classes = useStyles()
  const [t] = useTranslation()

  return (
    <div className={`Container ${classes.container}`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} className={classes.item}>
          <h1 className={`section-title ${classes.title}`}>{t(config.title)}</h1>
          <Typography className={classes.content}>{t(config.content)}</Typography>
        </Grid>
        {config.imgVisible && (
          <Grid item xs={12} md={6} className={classes.item}>
            <img src={config.imgLink} alt="specific-section3-img" className={classes.img} />
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default observer(SpecSection3)

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      padding: "100px 32px 0",
      ["@media (max-width:960px)"]: {
        padding: "50px 32px 0",
      },
    },
    item: {
      margin: "auto !important",
    },
    title: {
      textAlign: "left",
      ["@media (max-width:768px)"]: {
        textAlign: "center",
      },
    },
    content: {
      color: "black",
      fontSize: "30px !important",
      marginBottom: "30px !important",
      justifyContent: "center",
      margin: "auto",
      textAlign: "left",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw !important",
        width: "100%",
      },
    },
    img: {
      width: "100%",
    },
  })
)
