import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography, Grid } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { Section4 } from "../../model/specific-config-param"
import _ from "lodash"
import CardPopular from "../../components/CardPopular"
import { storesDetails } from "../../store"
import { observer } from "mobx-react"

type Props = {
  config: Section4
}

const SpecSection4 = ({ config }: Props) => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const [t] = useTranslation()
  const cards = _.sortBy(config.cards, (o) => o.order)

  return (
    <div
      className={classes.container}
      style={{
        backgroundImage: config.imgVisible ? "url('/img/wave-bg.svg')" : "none",
      }}
    >
      <div className="Container">
        <h1 className={`section-title ${classes.title}`}>{t(config.title)}</h1>
        <Typography className={classes.content}>{t(config.content)}</Typography>
        {config.imgVisible && (
          <Grid container spacing={2} className="card-customized-container-desktop">
            {cards.map((item: any, index: number) => {
              return (
                <Grid item xs={6} sm={6} md={3} style={{ paddingTop: "0px" }} key={index}>
                  <CardPopular
                    title={item.title}
                    subtitle={t(item.subtitle)}
                    price={item.price}
                    priceCol={data.general.colorPalle.priceCol}
                    img={item.img}
                  />
                </Grid>
              )
            })}
          </Grid>
        )}
      </div>
    </div>
  )
}

export default observer(SpecSection4)

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      padding: "100px 0 30px",
      ["@media (max-width:960px)"]: {
        padding: "0px 0 30px",
      },
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
  })
)
