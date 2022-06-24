import React, { useState, useEffect } from "react"
import { Grid, Box } from "@material-ui/core"
import CardFix from "../../components/CardFix"
import ContentFix from "../../components/ContentFix"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { useHistory } from "react-router-dom"
import { repairWidgetStore, storesDetails } from "../../store"
import _, { isEmpty } from "lodash"
import { featureToggleKeys } from "../../const/_variables"

type Props = {
  features: any[]
}

const Section2 = ({ features }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section2
  const themeType = data.general.themeType
  const cards = _.sortBy(thisPage.cards, (o) => o.order) || []
  const contents = _.sortBy(thisPage.contents, (o) => o.order)
  const [t] = useTranslation()
  const history = useHistory()

  const [feats, setFeatures] = useState<any[]>([])

  useEffect(() => {
    const cntFeatures: any[] = []
    if (!isEmpty(features) && features.length) {
      features.forEach((item) => {
        if (item.isActive) {
          cntFeatures.push(item.flag)
        }
      })
    }
    setFeatures(cntFeatures)
  }, [features, data])

  const handleRepairWidget = (title: string) => {
    repairWidgetStore.init()
    history.push(`${data.general.routes.repairWidgetPage}?c=${title}`)
  }

  const Container: React.FC = ({ children }) => (
    (themeType === "marnics" || themeType === "snap") ? <div className="section2-container" style={{ backgroundImage: `url(${thisPage.bgImg})` }}>{children}</div> : <>{children}</>
  )

  return (
    <FeatureToggles features={feats}>
      <Feature
        name={featureToggleKeys.FRONTEND_REPAIR}
        inactiveComponent={() => <></>}
        activeComponent={() => (
          <Container>
            <section className="Container">
              <h2 className="section-title">{t(thisPage.title)}</h2>
              {cards.length ? (
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
              ) : (
                <></>
              )}
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
          </Container>
        )}
      />
    </FeatureToggles>
  )
}

export default Section2
