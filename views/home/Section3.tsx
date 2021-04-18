import React, { useState, useEffect } from "react"
import { Typography, Grid, Box } from "@material-ui/core"
import { CardPopular } from "../../components"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { storesDetails } from "../../store"

type Props = {
  features: any[]
}

const Section3 = ({ features }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section3
  const commonData = storesDetails.commonCnts
  const deviceCard = thisPage.deviceCard
  const [t] = useTranslation()

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

  return (
    <FeatureToggles features={feats}>
      <Feature
        name={"FRONTEND_ONLINE_PURCHASE"}
        inactiveComponent={() => <></>}
        activeComponent={() => (
          <section className={"sec3-container-parent"}>
            <div className={"Container"}>
              <Typography className={"section-title"}>{t(thisPage.title)}</Typography>
            </div>
            <div
              className={"section3-back"}
              style={{
                backgroundImage: "url(" + thisPage.bgImg + ")",
              }}
            >
              <div className={"Container"}>
                <Grid container item xs={12} spacing={2}>
                  {commonData.popularCardData.map((item: any, index: number) => {
                    return (
                      <Grid item xs={6} sm={6} md={3} style={{ paddingTop: "0px" }} key={index}>
                        <CardPopular
                          title={item.title}
                          subtitle={t(item.subtitle)}
                          price={item.price}
                          priceCol={data.colorPalle.priceCol}
                          img={item.img}
                          key={index}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                <Box className="pd-t-5">
                  <Grid container item xs={12} spacing={2}>
                    <Grid item sm={12} md={7}>
                      <Typography
                        className={"section-title white"}
                        style={{ color: thisPage.color }}
                      >
                        {thisPage.subtitle.map((item: string, index: number) => {
                          return (
                            <React.Fragment key={index}>
                              {t(item)} <br />
                            </React.Fragment>
                          )
                        })}
                      </Typography>
                      <Typography className="white f24" style={{ color: thisPage.color }}>
                        {t(thisPage.content)}
                      </Typography>
                    </Grid>
                    <Grid item sm={12} md={5}>
                      <img
                        src={deviceCard.img}
                        alt="device-list"
                        className={"card-img"}
                        width="1"
                        height="auto"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </div>
          </section>
        )}
      />
    </FeatureToggles>
  )
}

export default Section3
