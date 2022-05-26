import React, { useState, useEffect } from "react"
import { Typography, Grid } from "@material-ui/core"
import { CardPopular } from "../../components"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { storesDetails } from "../../store"
import { featureToggleKeys } from "../../const/_variables"
import { isEmpty } from "lodash"

type Props = {
  features: any[]
}

const Section3 = ({ features }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section3
  const commonData = storesDetails.commonCnts
  // const deviceCard = thisPage.deviceCard
  const [t] = useTranslation()

  const [feats, setFeatures] = useState<any[]>([])

  if (!thisPage.visible) return null

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

  return (
    <FeatureToggles features={feats}>
      <Feature
        name={featureToggleKeys.FRONTEND_ONLINE_PURCHASE}
        inactiveComponent={() => <></>}
        activeComponent={() => (
          <section className="sec3-container-parent">
            <div className="Container section3-container">
              <Typography className="section-title section3-title">{t(thisPage.title)}</Typography>
            </div>
            <div
              className="section3-back"
              style={{
                backgroundImage: "url(" + thisPage.bgImg + ")",
              }}
            >
              <div className="Container section3-container">
                <Grid container item xs={12} spacing={2}>
                  {commonData.popularCardData.map((item: any, index: number) => {
                    return (
                      <Grid item xs={6} sm={3} style={{ paddingTop: "0px" }} key={index}>
                        <CardPopular
                          title={item.title}
                          subtitle={t(item.subtitle)}
                          price={item.price}
                          priceCol={data.general.colorPalle.priceCol}
                          img={item.img}
                          key={index}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                {/* <Box className="pd-t-5 section3-device-card">
                  <Grid container item xs={12} spacing={2}>
                    <Grid item sm={6} md={7}>
                      <Typography className="section-title white section3-subtitle" style={{ color: thisPage.color }}>
                        {thisPage.subtitle.map((item: string, index: number) => {
                          return (
                            <React.Fragment key={index}>
                              {t(item)} <br />
                            </React.Fragment>
                          )
                        })}
                      </Typography>
                      <Typography className="white f24 section3-content" style={{ color: thisPage.color }}>
                        {t(thisPage.content)}
                      </Typography>
                    </Grid>
                    <Grid item sm={6} md={5}>
                      <img
                        src={deviceCard.img}
                        alt="device-list"
                        className="card-img"
                        width="1"
                        height="auto"
                      />
                    </Grid>
                  </Grid>
                </Box> */}
              </div>
            </div>
          </section>
        )}
      />
    </FeatureToggles>
  )
}

export default Section3
