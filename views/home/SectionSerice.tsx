import React from "react"
import { Grid } from "@material-ui/core"
import { storesDetails } from "../../store"
import { ServiceCard } from "../../components"

const SectionService: React.FC = () => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.services
  return (
    <section className="Container service-section-wrapper">
      <div className="service-section-container">
        <Grid container spacing={2}>
          {thisPage.map((item: any, index: number) => (
            <Grid key={index} item xs={6} sm={3}>
              <ServiceCard
                icon={item.img}
                title={item.title}
                link={item.href}
                btnTitle={item.btnTitle}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}
export default SectionService
