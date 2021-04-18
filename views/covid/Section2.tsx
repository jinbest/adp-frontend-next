import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../../store"
import { Typography, Grid } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Card } from "../repair/widget-component"
import _ from "lodash"

const Section2 = () => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const thisPage = data.covidPage.section2
  const logoData = _.sortBy(thisPage.data, (o) => o.order)
  const [t] = useTranslation()

  return (
    <div className={classes.root}>
      <div className={classes.cardContainer}>
        <Card className={classes.card}>
          <Typography className={classes.mainTitle}>{t(thisPage.title)}</Typography>
          <Grid container spacing={3}>
            {logoData.map((item: any, index: number) => {
              return (
                <Grid item xs={12} md={6} key={index} className={classes.item}>
                  {item.visible && (
                    <>
                      <img src={item.img} alt={`covid-logo-${index}`} width="1" height="auto" />
                      <div>
                        <Typography className={classes.subTitle}>{t(item.title)}</Typography>
                        <Typography className={classes.itemText}>{t(item.content)}</Typography>
                      </div>
                    </>
                  )}
                </Grid>
              )
            })}
          </Grid>
          <Typography className={classes.itemText} style={{ marginTop: "20px" }}>
            {t(thisPage.content)}
          </Typography>
          <Typography
            className={classes.itemText}
            style={{ marginTop: "20px", fontWeight: "bold" }}
          >
            {`${t(thisPage.bottomText)} `}
            <Link to={data.general.routes.contactPage} className={classes.itemText}>
              {t("Contact Us")}.
            </Link>
          </Typography>
        </Card>
      </div>
    </div>
  )
}

export default Section2

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "1440px",
      margin: "0 auto 140px !important",
      padding: "0 2rem",
      display: "block",
      textAlign: "center",
      ["@media (max-width:500px)"]: {
        margin: "0 auto 50px !important",
      },
      ["@media (max-width:425px)"]: {
        margin: "0 auto 100px !important",
      },
    },
    cardContainer: {
      margin: "100px auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ["@media (max-width:600px)"]: {
        margin: "50px auto -20px",
      },
    },
    card: {
      padding: "50px 30px",
      height: "auto",
      maxWidth: "1200px !important",
      ["@media (max-width:600px)"]: {
        padding: "40px 20px",
      },
    },
    mainTitle: {
      fontSize: "40px !important",
      textAlign: "center",
      color: "black",
      fontFamily: "Poppins Bold !important",
      fontWeight: "bold",
      letterSpacing: "1px",
      marginBottom: "50px",
      ["@media (max-width:1400px)"]: {
        fontSize: "3vw !important",
        marginBottom: "3vw !important",
      },
      ["@media (max-width:960px)"]: {
        marginBottom: "50px !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3.5vw !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4vw !important",
        width: "100%",
      },
    },
    item: {
      display: "flex",
      "& >img": {
        width: "80px",
      },
      "& > div": {
        textAlign: "left",
        marginLeft: "20px",
      },
      ["@media (max-width:500px)"]: {
        padding: "8px !important",
        "& >img": {
          width: "15vw",
        },
        "& > div": {
          marginLeft: "3vw",
        },
      },
    },
    itemText: {
      fontSize: "18px !important",
      color: "black",
      ["@media (max-width:1400px)"]: {
        fontSize: "16px !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3vw !important",
        width: "100%",
      },
    },
    subTitle: {
      fontSize: "19px !important",
      fontWeight: "bold",
      ["@media (max-width:1400px)"]: {
        fontSize: "17px !important",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.2vw !important",
        width: "100%",
      },
    },
  })
)
