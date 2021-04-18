import React from "react"
import { DeviceListComponent } from "../../components"
// import {Button} from '../../components'
import { Typography, Grid, Box } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import _ from "lodash"

const Section4 = () => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.section4
  const imageData = _.sortBy(thisPage.data, (o) => o.order)
  const [t] = useTranslation()

  return (
    <div className={"sec4-background"}>
      <section className={"Container"}>
        <Box className={"sec4-container-box"}>
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography className={"f40 bold " + "section4-title"}>
                {t(thisPage.title)}
              </Typography>
              {/* <Box className={'section4-button mobile'}>
                <Button 
                  title={t(thisPage.btnTitle)} 
                  bgcolor={data.colorPalle.themeColor} 
                  borderR='20px'
                />
              </Box> */}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid item container xs={12}>
                {imageData.slice(0, 2).map((item: any, index: number) => {
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box className={"cart-device-list"}>
                        <DeviceListComponent
                          img={item.img}
                          title={t(item.title)}
                          content={t(item.content)}
                          key={index}
                          contentVisible={thisPage.contentVisible}
                        >
                          {t(item.title)}
                        </DeviceListComponent>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            {/* <Grid item xs={12}>
              <Box className={'section4-button desktop'}>
                <Button title={t(thisPage.btnTitle)} bgcolor={data.colorPalle.themeColor} borderR='20px' />
              </Box>
            </Grid> */}
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} sm={12} md={3}></Grid>
            <Grid item xs={12} sm={12} md={9}>
              <Grid item container xs={12}>
                {imageData.slice(2, 5).map((item: any, index: number) => {
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Box className={"cart-device-list"}>
                        <DeviceListComponent
                          img={item.img}
                          title={t(item.title)}
                          content={t(item.content)}
                          key={index}
                          contentVisible={thisPage.contentVisible}
                        >
                          {t(item.title)}
                        </DeviceListComponent>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box className={"sec4-container-special-box"}>
          <Grid container item xs={12}>
            <Typography className={"f40 bold " + "section-title"}>{t(thisPage.title)}</Typography>
          </Grid>
          <Grid container item xs={12}>
            <div style={{ display: "flex", margin: "auto" }}>
              {imageData.map((item: any, index: number) => {
                return (
                  <Box className={"cart-device-list"} key={index}>
                    <DeviceListComponent
                      img={item.img}
                      title={t(item.title)}
                      content={t(item.content)}
                      key={index}
                      contentVisible={thisPage.contentVisible}
                    >
                      {t(item.title)}
                    </DeviceListComponent>
                  </Box>
                )
              })}
            </div>
          </Grid>
        </Box>
      </section>
    </div>
  )
}

export default Section4
