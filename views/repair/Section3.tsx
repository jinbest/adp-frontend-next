import React from "react"
import { Grid, Typography } from "@material-ui/core"
import CardRepairSec3 from "../../components/CardRepairSec3"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"

const Section3 = () => {
  const data = storesDetails.storeCnts
  const repair = data.repairPage.section3
  const [t] = useTranslation()

  return (
    <section className={"service-section-3"}>
      <div className={"Container"}>
        <Typography className={"service-section-title-2"}>{t(repair.title)}</Typography>
        <Typography className={"service-section-content"}>{t(repair.content)}</Typography>
        <Grid container item xs={12} spacing={2}>
          {repair.children.map((item: any, index: number) => {
            return (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <CardRepairSec3
                  img={item.img}
                  subtitle={t(item.subtitle)}
                  content={t(item.subcontent)}
                />
              </Grid>
            )
          })}
        </Grid>
      </div>
    </section>
  )
}

export default Section3
