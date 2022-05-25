import React, { useEffect, useState } from "react"
import { storesDetails } from "../../store"
import Head from "next/head"
import Shape from "./Shape"
import ContactModal from "./ContactModal"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import Button from "../../components/Button"
import { useTranslation } from "react-i18next"
import Card from "../repair/widget-component/Card"
import { ShippingLabel, FreeShipping, CustomerService, Pay, QuickTurnaround, Soldering } from "./SVGs"
import { MetaParams } from "../../model/meta-params"
import _ from "lodash"

type Props = {
  handleStatus: (status: boolean) => void
}

const Business = ({ handleStatus }: Props) => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const themeType = data.general.themeType
  const thisPage = data.businessPage
  const services = _.sortBy(thisPage.section2.services, (o) => o.order)
  const [t] = useTranslation()

  const [pageTitle, setPageTitle] = useState("Business Solutions | ")
  const [metaList, setMetaList] = useState<MetaParams[]>([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
        <link rel="icon" id="favicon" href={data.homepage.headData.fav.img} />
        <link rel="apple-touch-icon" href={data.homepage.headData.fav.img} />
      </Head>

      <Shape />
      <div className={`${classes.root} business-container`}>
        <div className="decoration-line" />
        <h1 className={`${classes.mainTitle} business-main-title`}>{t(thisPage.section1.title)}</h1>
        <Typography className={`${classes.mainContent} business-main-content`}>{t(thisPage.section1.subtitle)}</Typography>
        <Button
          title={t(thisPage.section1.btnTitle)}
          bgcolor={data.general.colorPalle.repairButtonCol}
          borderR={themeType === "marnics" ? "0" : "20px"}
          width="200px"
          height="60px"
          margin="auto"
          onClick={() => setOpenModal(true)}
        />
        <div className={`${classes.cardContainer} business-card-container`}>
          <Card className={`${classes.card} business-card`} backgroundImage={`url("${thisPage.section2.bgImg}")`}>
            <div className="business-card-bg" />
            <Typography className={`${classes.subTitle} business-card-subtitle`}>{t(thisPage.section2.title)}</Typography>
            <Grid container spacing={5}>
              {services.map((item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {item.visible ? (
                      <Grid item xs={12} md={6}>
                        <div className={`${classes.item} business-item-card`}>
                          <div className={`${classes.SVGContainer} business-svgcontainer`}>
                            {item.type === "freeShipping" ? (
                              <div style={{ padding: "0 20px" }}>
                                {themeType === "marnics" ? <img src={item.img} /> : <FreeShipping color={data.general.colorPalle.repairButtonCol} />}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.type === "pay" ? (
                              <div style={{ padding: "0 24px" }}>
                                {themeType === "marnics" ? <img src={item.img} /> : <Pay color={data.general.colorPalle.repairButtonCol} />}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.type === "shippingLabel" ? (
                              <div style={{ padding: "0 25px" }}>
                                {themeType === "marnics" ? <img src={item.img} /> : <ShippingLabel color={data.general.colorPalle.repairButtonCol} />}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.type === "soldering" ? (
                              <div style={{ padding: "0 22px" }}>
                                {themeType === "marnics" ? <img src={item.img} /> : <Soldering color={data.general.colorPalle.repairButtonCol} />}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.type === "customerService" ? (
                              <div style={{ padding: "0 22px" }}>
                                {themeType === "marnics" ? <img src={item.img} /> : <CustomerService color={data.general.colorPalle.repairButtonCol} />}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.type === "quickTurnaround" ? (
                              <div style={{ padding: "0 20px" }}>
                                {themeType === "marnics" ? <img src={item.img} /> : <QuickTurnaround color={data.general.colorPalle.repairButtonCol} />}
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className={`${classes.textContainer} business-card-text`}>
                            <Typography className={`${classes.itemText} business-card-item-text`}>{t(item.content)}</Typography>
                          </div>
                        </div>
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                )
              })}
            </Grid>
          </Card>
          <ContactModal openModal={openModal} handleModal={setOpenModal} />
        </div>
      </div>
    </div>
  )
}

export default Business

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "1440px",
      padding: "250px 30px 140px",
      margin: "auto !important",
      display: "block",
      textAlign: "center",
      ["@media (max-width:1200px)"]: {
        paddingTop: "210px",
      },
      ["@media (max-width:500px)"]: {
        padding: "180px 30px 50px",
      },
      ["@media (max-width:425px)"]: {
        padding: "200px 30px 100px",
      },
    },
    cardContainer: {
      margin: "100px auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ["@media (max-width:600px)"]: {
        margin: "50px auto -20px",
      },
    },
    card: {
      padding: "50px 30px",
      height: "auto",
      maxWidth: "1200px",
      ["@media (max-width:600px)"]: {
        padding: "40px 20px",
      },
    },
    mainTitle: {
      color: "black",
      fontSize: "60px",
      marginBottom: "40px",
      fontFamily: "Poppins Bold",
      fontWeight: "bold",
      justifyContent: "center",
      letterSpacing: "2px",
      ["@media (max-width:1400px)"]: {
        fontSize: "4vw",
        marginBottom: "3vw",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "5vw",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "5.5vw",
        width: "100%",
      },
    },
    mainContent: {
      color: "black",
      fontSize: "40px",
      marginBottom: "40px",
      justifyContent: "center",
      width: "80%",
      margin: "auto",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw",
        width: "100%",
      },
    },
    subTitle: {
      fontSize: "40px",
      textAlign: "center",
      color: "black",
      fontFamily: "Poppins Bold !important",
      fontWeight: "bold",
      letterSpacing: "1px",
      marginBottom: "50px",
      ["@media (max-width:1400px)"]: {
        fontSize: "3vw",
        marginBottom: "3vw",
      },
      ["@media (max-width:960px)"]: {
        marginBottom: "50px",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3.5vw",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "4vw",
        width: "100%",
      },
    },
    item: {
      display: "flex",
      ["@media (max-width:500px)"]: {
        padding: "8px !important",
      },
    },
    SVGContainer: {
      width: "90px",
      height: "90px",
      boxShadow: "-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.4)",
      borderRadius: "90px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      height: "90px",
      width: "100%",
      marginLeft: "20px",
      border: "1px solid #BDBFC3",
      borderRadius: "20px",
      textAlign: "left",
      alignItems: "center",
      display: "flex",
      ["@media (max-width:500px)"]: {
        marginLeft: "10px",
      },
    },
    itemText: {
      fontSize: "18px",
      padding: "0 20px",
      ["@media (max-width:1400px)"]: {
        fontSize: "16px",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3vw",
        width: "100%",
        padding: "0 10px",
      },
    },
  })
)
