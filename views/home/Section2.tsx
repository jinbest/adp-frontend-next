import React, { useState, useEffect } from "react"
import { Grid, Box } from "@material-ui/core"
import CardFix from "../../components/CardFix"
import ContentFix from "../../components/ContentFix"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { useHistory } from "react-router-dom"
import { repairWidgetStore, storesDetails } from "../../store"
import _ from "lodash"
import { featureToggleKeys } from "../../const/_variables"

const categoryFilterName = [
  {
    name: "Cellphone",
    slug: "Phones",
  },
  {
    name: "Tablet",
    slug: "Tablets",
  },
  {
    name: "Computer",
    slug: "Laptops",
  },
  {
    name: "Console",
    slug: "Console",
  },
  {
    name: "Other",
    slug: "Other",
  },
]

type Props = {
  features: any[]
}

const Section2 = ({ features }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section2
  const cards = _.sortBy(thisPage.cards, (o) => o.order)
  const contents = _.sortBy(thisPage.contents, (o) => o.order)
  const [t] = useTranslation()
  const history = useHistory()

  const [feats, setFeatures] = useState<any[]>([])

  useEffect(() => {
    const cntFeatures: any[] = []
    for (let i = 0; i < features.length; i++) {
      if (features[i].isActive) {
        cntFeatures.push(features[i].flag)
      }
    }
    setFeatures(cntFeatures)
  }, [features, data])

  const handleRepairWidget = (title: string) => {
    repairWidgetStore.init()
    const slugIndex = _.findIndex(categoryFilterName, (o) => o.name === title)
    if (slugIndex > -1) {
      history.push(
        `${data.general.routes.repairWidgetPage}?c=${categoryFilterName[slugIndex].slug}`
      )
    } else {
      history.push(data.general.routes.repairWidgetPage)
    }
  }

  return (
    <FeatureToggles features={feats}>
      <Feature
        name={featureToggleKeys.FRONTEND_REPAIR}
        inactiveComponent={() => <></>}
        activeComponent={() => (
          <section className="Container">
            <h2 className="section-title">{t(thisPage.title)}</h2>
            <div className="card-customized-container-desktop">
              {cards.map((item: any, index: number) => {
                return (
                  <div
                    className="card-customized-item"
                    key={index}
                    onClick={() => handleRepairWidget(item.title)}
                  >
                    <CardFix title={t(item.title)} img={item.img} key={index} />
                  </div>
                )
              })}
            </div>
            <div className="card-customized-container-mobile">
              {cards.slice(0, 3).map((item: any, index: number) => {
                return (
                  <div
                    className="card-customized-item"
                    key={index}
                    onClick={() => handleRepairWidget(item.title)}
                  >
                    <CardFix title={t(item.title)} img={item.img} key={index} />
                  </div>
                )
              })}
            </div>
            <div className="card-customized-container-mobile">
              {cards.slice(3, 5).map((item: any, index: number) => {
                return (
                  <div
                    className="card-customized-item"
                    key={index}
                    onClick={() => handleRepairWidget(item.title)}
                  >
                    <CardFix title={t(item.title)} img={item.img} key={index} />
                  </div>
                )
              })}
            </div>
            <Grid container item xs={12} spacing={2}>
              {contents.map((item: any, index: number) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box className="cart-contentfix-container">
                      <ContentFix
                        title={t(item.title)}
                        content={t(item.content)}
                        themeCol={data.general.colorPalle.underLineCol}
                        key={index}
                      />
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </section>
        )}
      />
    </FeatureToggles>
  )
}

export default Section2
