import React from "react"
import { Grid, Box, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { isExternal } from "../../services/helper"
import { storesDetails } from "../../store"

type Props = {
  handleStatus: (status: boolean) => void
}

const Section4 = ({ handleStatus }: Props) => {
  const data = storesDetails.storeCnts
  const repair = data.repairPage.section4
  const [t] = useTranslation()
  const classes = useStyles()

  return (
    <section className="Container">
      <Grid container className="repair-sec4-grid-root" spacing={2}>
        <Grid item xs={12} md={6} className={classes.item1}>
          <Typography className="service-section-title-1" style={{ color: repair.themeCol }}>
            {t(repair.title)}
          </Typography>
          <Typography className="service-section-content" style={{ color: repair.themeCol }}>
            {t(repair.subtitle)}
          </Typography>
          <Box className="service-section-button">
            {isExternal(repair.link) ? (
              <a
                href={repair.link}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button
                  title={t(repair.btnTitle)}
                  bgcolor={data.general.colorPalle.repairButtonCol}
                  borderR="20px"
                />
              </a>
            ) : (
              <Link
                to={repair.link}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  handleStatus(true)
                }}
              >
                <Button
                  title={t(repair.btnTitle)}
                  bgcolor={data.general.colorPalle.repairButtonCol}
                  borderR="20px"
                />
              </Link>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} className={`${classes.item2} repair-sec4-img`}>
          <img
            src={storesDetails.commonCnts.repairSec4Img}
            alt="repair-sec4-img"
            style={{ width: "100%", maxWidth: "700px" }}
            width="1"
            height="auto"
          />
        </Grid>
      </Grid>
    </section>
  )
}

export default Section4

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item1: {
      order: 2,
      "& > div": {
        margin: "auto !important",
      },
      [theme.breakpoints.up("md")]: {
        order: 1,
        marginTop: "0px",
        "& > div": {
          margin: "inherit !important",
        },
      },
      marginTop: "50px",
    },
    item2: {
      order: 1,
      [theme.breakpoints.up("md")]: {
        order: 2,
      },
    },
  })
)
