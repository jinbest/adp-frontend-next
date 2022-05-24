import React from "react"
import { Grid } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import { makeStyles } from "@material-ui/core/styles"
import _ from "lodash"

const Section3 = () => {
  const data = storesDetails.storeCnts
  const trade = data.tradePage.section3
  const children = _.sortBy(trade.children, (o) => o.order)
  const [t] = useTranslation()
  const classes = useStyles()

  return (
    <section className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>{t(trade.title)}</div>
        <Grid container spacing={3}>
          {children.map((i: any) => (
            <Grid key={i.subtitle} item xs={12} md={6}>
              <div className={classes.card}>
                <img src={i.img} alt={i.subtitle} />
                <div className={classes.cardContent}>
                  <div className={classes.subtitle}>{i.subtitle}</div>
                  <div className={classes.subcontent}>{i.subcontent}</div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default Section3

const useStyles = makeStyles({
  root: {
    backgroundColor: "#235B89",
    position: "relative",
    marginBottom: -40,
    "&:after": {
      content: "''",
      width: "100%",
      height: "100%",
      position: "absolute",
      backgroundColor: "inherit",
      zIndex: -1,
      bottom: 0,
      transformOrigin: "right",
      transform: "skewY(-4deg)",
    }
  },
  container: {
    maxWidth: 1440,
    width: "100%",
    margin: "auto",
    paddingTop: 46,
    paddingBottom: 100,
    color: "white",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 36,
    lineHeight: "37px",
    textAlign: "center",
    marginBottom: 48,
    fontFamily: "Helvetica Neue Bold !important"
  },
  card: {
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Helvetica Neue Bold !important",
    marginBottom: 20,
    marginTop: 40
  },
  subcontent: {
    fontFamily: "Helvetica Neue Regular !important",
    maxWidth: 600,
    margin: "auto"
  },
  cardContent: {
    fontSize: 24,
  },
  "@media (max-width: 1440px)": {
    root: {
      marginBottom: -80
    },
    container: {
      paddingLeft: 48,
      paddingRight: 48
    }
  },
  "@media (max-width: 1024px)": {
    mainTitle: {
      fontSize: 36
    },
    phone: {
      width: 430
    }
  },
  "@media (max-width: 768px)": {
    title: {
      fontSize: 24
    },
    cardContent: {
      marginLeft: 17,
      fontSize: 16
    },
    card: {
      display: "flex",
      alignItems: "center",
      "& img": {
        width: 100,
        height: 63
      }
    },
    subtitle: {
      margin: 0,
      textAlign: "left"
    },
    subcontent: {
      textAlign: "left",
    },
    root: {
      marginBottom: -120
    },
  }
})