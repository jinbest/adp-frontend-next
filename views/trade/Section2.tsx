import React from "react"
import { Grid } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import _ from "lodash"
import { makeStyles } from "@material-ui/core/styles"

const Section2 = () => {
  const data = storesDetails.storeCnts
  const trade = data.tradePage.section2
  const contents = _.sortBy(trade.contents, (o) => o.order)
  const [t] = useTranslation()
  const classes = useStyles()

  return (
    <div className="trade-section-2-wrapper" style={{backgroundImage: `url(${trade.bgImg})`}}>
      <section className={`${classes.root} trade-section-2-container`}>
        <div className={`${classes.title} trade-section-2-title`}>{t(trade.title)}</div>
        <Grid container spacing={2}>
          {contents.map((item: any) => (
            <Grid item xs={12} md={4} key={item.title}>
              <div className={`${classes.card} trade-card`}>
                {item.img && <img src={item.img} />}
                <div className={`${classes.cardcontent} trade-card-content`}>
                  <div className={`${classes.cardtitle} trade-card-title`}>{item.title}</div>
                  <div className={`${classes.carddesc} trade-card-desc`}>{item.content}</div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        {trade.subtitle ? <div className="trade-section-2-subtitle">{t(trade.subtitle)}</div> : null}
        {trade.subcontents ?
          <Grid container spacing={2}>
            {trade.subcontents.map((item: any) => (
              <Grid item xs={12} md={6} key={item.title}>
                <div className="trade-sub-card">
                  {item.img && <img src={item.img} />}
                  <div className="trade-subcard-content">
                    <div className="trade-subcard-title">{item.title}</div>
                    <div className="trade-subcard-desc">{item.content}</div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid> :
          null 
        }
      </section>
    </div>
  )
}

export default Section2

const useStyles = makeStyles({
  root: {
    maxWidth: 1440,
    margin: "auto",
    marginTop: 350,
    paddingBottom: 48
  },
  title: {
    textAlign: "center",
    fontSize: 64,
    fontFamily: "Helvetica Neue Bold !important",
    lineHeight: "117.5%",
    color: "black",
    marginBottom: 75
  },
  card: {
    fontSize: 24,
    textAlign: "center"
  },
  cardcontent: {
    marginTop: 40,
  },
  cardtitle: {
    fontFamily: "Helvetica Neue Bold !important",
    color: "black",
    textAlign: "center",
    maxWidth: 332,
    margin: "0px auto 20px"
  },
  carddesc: {
    fontFamily: "Helvetica Neue Regular !important",
    color: "black",
    textAlign: "center",
    maxWidth: 332,
    margin: "auto"
  },
  "@media (max-width: 1024px)": {
    root: {
      marginTop: 180,
      paddingLeft: 48,
      paddingRight: 48
    },
    title: {
      fontSize: 48
    }
  },
  "@media (max-width: 960px)": {
    card: {
      display: "flex",
      alignItems: "center"
    },
    title: {
      marginBottom: 33
    },
    cardcontent: {
      marginTop: 0,
      marginLeft: 36,
      flex: 1
    },
    cardtitle: {
      textAlign: "left",
      maxWidth: "100%"
    },
    carddesc: {
      textAlign: "left",
      maxWidth: "100%"
    }
  },
  "@media (max-width: 768px)": {
    phone: {
      top: 215
    },
    title: {
      fontSize: 24
    },
    card: {
      fontSize: 16,
      lineHeight: "20px",
      "& svg": {
        width: 90,
        height: 90
      }
    },
    cardtitle: {
      marginBottom: 16
    }
  },
  "@media (max-width: 600px)": {
    root: {
      marginTop: 300,
      paddingLeft: 20,
      paddingRight: 20
    },
    title: {
      fontSize: 20,
      marginBottom: 28
    },
    card: {
      "& svg": {
        width: 52,
        height: 52
      }
    },
    cardcontent: {
      marginLeft: 26
    },
    cardtitle: {
      marginBottom: 10
    }
  },
  "@media (max-width: 500px)": {
    root: {
      marginTop: 220
    }
  }
})