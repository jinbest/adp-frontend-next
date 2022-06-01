import React, { useState, useEffect } from "react"
// import { CardMobile } from "../../components"
import { Button, Search } from "../../components"
import { Grid, Box } from "@material-ui/core"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { Link } from "react-router-dom"
import { repairWidgetStore, storesDetails } from "../../store"
import { useTranslation } from "react-i18next"
import { isExternal } from "../../services/helper"
import { observer } from "mobx-react"
import _, { isEmpty } from "lodash"
import { featureToggleKeys } from "../../const/_variables"

type Props = {
  features: any[]
  handleStatus: (status: boolean) => void
}

const Section1 = ({ features, handleStatus }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section1
  const themeType = data.general.themeType
  const buttons = _.sortBy(thisPage.buttons, (o) => o.order)
  const [t] = useTranslation()

  // const [feats, setFeatures] = useState<any[]>([])
  const [featSearch, setFeatSearch] = useState<any[]>([])
  // const [gridMD, setGridMD] = useState(data.cardMobileData.gridMD)

  useEffect(() => {
    // const cntCardMobileData: any = data.cardMobileData.data
    const cntFeature: any[] = [],
      cntFeatSearch: any[] = []

    if (!isEmpty(features) && features.length) {
      features.forEach((item) => {
        if (item.flag === "SEARCH" && item.isActive) {
          cntFeatSearch.push(item.flag)
        }
        if (item.isActive) {
          cntFeature.push(item.flag)
        }
      })
    }
    // const cntGridMD = Math.round(12 / cntFeature.length)
    // setFeatures(cntFeature)
    setFeatSearch(cntFeatSearch)
    // setGridMD(cntGridMD)
  }, [data, features, t])

  const handleGetQuote = (link: string) => {
    if (link !== data.general.routes.repairWidgetPage) return
    repairWidgetStore.init()
    handleStatus(false)
  }

  return (
    <section className="Container">
      <Grid container className="section1-container">
        <Grid item xs={12} md={6} className="section1-top">
          {thisPage.decorationBar && <div className="decoration-bar" />}
          <h1 className="section1-title align-center">{t(thisPage.title)}</h1>
          <p className="section1-subtitle align-center">{t(thisPage.subtitle)}</p>
          <div className={`${(themeType === "marnics" || themeType === "snap") ? "" : "align-center"} d-flex`}>
            {buttons.map((item: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  {item.visible ? (
                    <Box className="service-section-button" style={{ margin: "initial" }}>
                      {isExternal(item.link) ? (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <Button
                            title={t(item.title)}
                            bgcolor={data.general.colorPalle.repairButtonCol}
                            borderR={themeType === "marnics" ? "0" : "20px"}
                            width={themeType === "marnics" ? "fit-content" : "95%"}
                            fontSize={themeType === "marnics" ? "20px" : "18px"}
                            fontFamily={themeType === "marnics" ? "Helvetica Neue Medium" : "Poppins Regular"}
                          />
                        </a>
                      ) : (
                        <Link to={item.link} onClick={() => handleGetQuote(item.link)}>
                          <Button
                            title={t(item.title)}
                            bgcolor={data.general.colorPalle.repairButtonCol}
                            borderR={themeType === "marnics" ? "0" : "20px"}
                            width={themeType === "marnics" ? "fit-content" : "95%"}
                            fontSize={themeType === "marnics" ? "20px" : "18px"}
                            padding={themeType === "marnics" ? "8px 16px" : "3px 6px"}
                            fontFamily={themeType === "marnics" ? "Helvetica Neue Medium" : "Poppins Regular"}
                          />
                        </Link>
                      )}
                    </Box>
                  ) : (
                    <></>
                  )}
                </React.Fragment>
              )
            })}
          </div>
          <FeatureToggles features={featSearch}>
            <Feature
              name={featureToggleKeys.FRONTEND_GLOBAL_SEARCH}
              inactiveComponent={() => <></>}
              activeComponent={() => (
                <Box className="sec1-search_input">
                  <Search
                    placeholder={thisPage.searchPlaceholder}
                    color="white"
                    bgcolor={storesDetails.storeCnts.general.colorPalle.themeColor}
                    height="60px"
                    handleChange={() => {
                      // EMPTY
                    }}
                    handleIconClick={() => {
                      // EMPTY
                    }}
                  />
                </Box>
              )}
            />
          </FeatureToggles>
        </Grid>
        {thisPage.heroImg &&
          <Grid item xs={12} md={6} className="section1-top-hero">
            <img src={thisPage.heroImg} alt="hero" className="hero" />
          </Grid>
        }
      </Grid>
      {/* <Grid container item xs={12} spacing={3} className="sec1-card-mobile-data">
        {thisPage.cards.data.map((item: any, index: number) => {
          return (
            <FeatureToggles features={feats} key={index}>
              <Feature
                name={item.flag}
                inactiveComponent={() => <></>}
                activeComponent={() => (
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={gridMD}
                    style={{
                      paddingTop: "0px",
                      margin: "0 auto 5px",
                      maxWidth: "500px",
                    }}
                  >
                    <CardMobile
                      title={t(item.title)}
                      img={item.img}
                      btnTitle={item.btnTitle}
                      color={data.colorPalle.orange}
                      key={index}
                      heart={index === 0 ? require('../../static/_common/img/heart.png').default : ""}
                      heartCol={data.colorPalle.heartCol}
                      href={item.href}
                    />
                  </Grid>
                )}
              />
            </FeatureToggles>
          )
        })}
      </Grid> */}
    </section>
  )
}

export default observer(Section1)
