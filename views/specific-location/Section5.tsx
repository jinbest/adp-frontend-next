import React from "react"
import CardWhyCustomer from "../../components/CardWhyCustomer"
import { Typography, Grid, Box } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Section5 } from "../../model/specific-config-param"
import _ from "lodash"

type Props = {
  config: Section5
}

const SpecSection5 = ({ config }: Props) => {
  const [t] = useTranslation()
  const classes = useStyles()
  const reviews = _.sortBy(config.reviews, (o) => o.order)

  return (
    <section className="Container center sec6-container">
      <Typography className="section-review-title">{t(config.title)}</Typography>
      <Typography className={classes.subTitle}>{t("View more")}</Typography>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        className={`sec6-card ${classes.reviewCard}`}
        style={{ maxWidth: "inherit" }}
      >
        {reviews.map((item: any, index: number) => {
          return (
            <Grid item xs={12} md={4} key={index}>
              <Box className={`sec6-card ${classes.reviewCard}`}>
                <CardWhyCustomer
                  key={index}
                  score={item.score}
                  days={item.day}
                  content={item.content}
                  reviewer={item.reviewer}
                />
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </section>
  )
}

export default SpecSection5

const useStyles = makeStyles(() =>
  createStyles({
    subTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      ["@media (max-width:425px)"]: {
        fontSize: "3.5vw !important",
      },
    },
    reviewCard: {
      ["@media (max-width:960px)"]: {
        margin: "auto !important",
      },
    },
  })
)
