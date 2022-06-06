import React from "react"
import { Grid, Typography } from "@material-ui/core"
import CardRepairSec2 from "../../components/CardRepairSec2"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import _ from "lodash"

const Section2 = () => {
  const data = storesDetails.storeCnts
  const repair = data.repairPage.section2
  const contents = _.sortBy(repair.contents, (o) => o.order)
  const [t] = useTranslation()

  return (
    <section
      className="service-section2"
      style={{
        backgroundImage: repair.hasBackground ? "url(" + repair.bgImg + ")" : "",
      }}
    >
      <div className="Container service-section2-text-field">
        <Typography className="service-section-subtitle">{t(repair.subtitle)}</Typography>
        <Typography className="service-section-title-1">{t(repair.title)}</Typography>
        <Grid container item xs={12} spacing={2} className="repair-sec-content-div">
          {contents.map((item: any, index: number) => {
            return (
              <Grid item xs={12} md={4} key={index}>
                <CardRepairSec2 type={item.type} subtitle={t(item.title)} img={item.img}>
                  {item.type === "ReceiveDevice"
                    ? `${storesDetails.storesDetails.name} ${t(item.content)}`
                    : t(item.content)}
                </CardRepairSec2>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </section>
  )
}

export default Section2
