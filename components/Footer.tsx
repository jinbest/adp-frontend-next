import React, { useState, useEffect } from "react"
import { Grid, Box, Typography, Popover } from "@material-ui/core"
import Logo from "./Logo"
import { useTranslation } from "react-i18next"
import { getAddress, phoneFormatString, getWidth } from "../services/helper"
import { observer } from "mobx-react"
import { storesDetails } from "../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"
// import { Link } from "react-router-dom"
import { GridMDInterface } from "../model/grid-params"
import _ from "lodash"

type FooterLinksComponentProps = {
  data: any[]
  isMain: boolean
  initGridMD: GridMDInterface
}

const FooterLinksComponent = ({ data, isMain, initGridMD }: FooterLinksComponentProps) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      {data.map((item: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {item.is_main === isMain && (
              <Grid item xs={12} sm={initGridMD}>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  className={classes.footerLocName}
                >
                  <a
                    href={
                      item.business_page_link ||
                      `https://www.google.com/maps/search/?api=1&query=${getAddress(item)
                        .split(" ")
                        .join("+")}`
                    }
                    className={classes.hoverEffect}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.location_name}
                  </a>
                </Typography>
                <div className={classes.emailPhoneContainer}>
                  <a href={`tel:${item.phone}`} className={classes.hoverEffect}>
                    {`${phoneFormatString(item.phone)} `}
                  </a>
                  &nbsp;
                  <a href={`mailto:${item.email}`} className={classes.hoverEffect}>
                    {item.email}
                  </a>
                </div>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  className={classes.footerLocAddress}
                >
                  <a
                    href={
                      item.business_page_link ||
                      `https://www.google.com/maps/search/?api=1&query=${getAddress(item)
                        .split(" ")
                        .join("+")}`
                    }
                    className={classes.hoverEffect}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {getAddress(item)}
                  </a>
                </Typography>
                <Popover
                  id="mouse-over-popover"
                  className={classes.popover}
                  classes={{
                    paper: classes.paper,
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: -5,
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Typography className={classes.popovertext}>
                    Find address on Google maps.
                  </Typography>
                </Popover>
              </Grid>
            )}
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

const Footer = () => {
  const classes = useStyles()
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.footer
  const commonData = storesDetails.commonCnts
  const [t] = useTranslation()

  const footerCols = _.sortBy(thisPage.footerLinks, (o) => o.order)

  const [mobile, setMobile] = useState(false)
  const [colSM, setColSM] = useState<GridMDInterface>(3)

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    let availCols = 0
    for (let i = 0; i < footerCols.length; i++) {
      if (footerCols[i].visible) {
        availCols += 1
      }
    }
    if (availCols) {
      const cntSM = Math.max(3, Math.round(12 / availCols)) as GridMDInterface
      setColSM(cntSM)
    }
  }, [footerCols])

  const handleResize = () => {
    if (getWidth() < 960) {
      setMobile(true)
    } else {
      setMobile(false)
    }
  }

  return (
    <footer id="footer">
      <div className="footer-bg-container">
        <img src={mobile ? thisPage.images.mobile : thisPage.images.desktop} />
      </div>
      <Typography className="footer-title" style={{ color: thisPage.title.color }}>
        {t(thisPage.title.text)}
      </Typography>
      <div className="footer-box">
        <div className="footer-bgCol">
          <Box className={classes.footerContainer}>
            {thisPage.specImages && thisPage.specImages.length ? (
              <div className={classes.imgContainer}>
                <Logo
                  type="footer"
                  handleStatus={() => {
                    // EMPTY
                  }}
                />
                <div className={classes.specialImages}>
                  {thisPage.specImages.map((item: any, index: number) => {
                    return (
                      <a href={item.link} target="_blank" rel="noreferrer" key={index}>
                        <img src={item.img_src} alt={`${index}-spec-img`} />
                      </a>
                    )
                  })}
                </div>
              </div>
            ) : (
              <Logo
                type="footer"
                handleStatus={() => {
                  // EMPTY
                }}
              />
            )}
            <Grid container>
              {[true, false].map((item: any, index: number) => {
                return (
                  <FooterLinksComponent
                    key={index}
                    data={storesDetails.allLocations}
                    isMain={item}
                    initGridMD={4}
                  />
                )
              })}
            </Grid>
            <Grid container className={classes.footerlinks}>
              {footerCols.map((item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {item.visible ? (
                      <Grid item xs={12} sm={colSM}>
                        <ul>
                          <li className={classes.footerLocName}>{t(item.name)}</li>
                          {_.sortBy(item.lists, (o) => o.order).map((it: any, idx: number) => (
                            <React.Fragment key={idx}>
                              {it.visible ? (
                                <li className={classes.footerLocAddress}>
                                  <a href={it.href} target="_blank" rel="noreferrer">
                                    {t(it.text)}
                                  </a>
                                </li>
                              ) : (
                                <></>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                )
              })}
            </Grid>
            <Grid container>
              <Grid item xs={12} lg={4}>
                <p className="device-list-grid copyright" style={{ color: "grey" }}>
                  {t(thisPage.copyRight)}
                </p>
              </Grid>
              <Grid item xs={12} lg={8}>
                <div className={classes.footerImages}>
                  <div>
                    <img
                      src={commonData.footerImageData.deviceList}
                      className="footer-device-response"
                    />
                    {commonData.footerImageData.bell && (
                      <img
                        src={commonData.footerImageData.bell}
                        className="footer-device-response"
                      />
                    )}
                  </div>
                  <div style={{ flexWrap: "wrap", marginLeft: "10px" }}>
                    <img src={commonData.footerImageData.buyNow} className="footer-buynow" />
                    {commonData.footerImageData.others.map((item: any, index: number) => {
                      return (
                        <div className="footer-others" key={index}>
                          <img src={item} key={index} />
                        </div>
                      )
                    })}
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={commonData.footerImageData.deviceList}
                        className="footer-device-list"
                      />
                      {commonData.footerImageData.bell && (
                        <img src={commonData.footerImageData.bell} className="footer-device-list" />
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            <div style={{ textAlign: "center" }}>
              {data.socials && data.socials.length ? (
                data.socials.map(
                  (
                    social: { link: string | undefined; img: string | undefined },
                    index: number
                  ) => (
                    <a key={index} href={social.link} target="_blank" rel="noreferrer">
                      <img src={social.img} width="32" height="32" />
                    </a>
                  )
                )
              ) : (
                <></>
              )}
            </div>
          </Box>
        </div>
      </div>
    </footer>
  )
}

export default observer(Footer)

const useStyles = makeStyles(() =>
  createStyles({
    hoverEffect: {
      "&:hover": {
        opacity: 0.5,
      },
    },
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: "5px 10px 3px",
      boxShadow: "none",
      color: "white",
      background: "#bdbdbd",
    },
    popovertext: {
      fontSize: "12px !important",
    },
    footerLocName: {
      width: "fit-content",
      fontWeight: "bold",
      margin: "20px 0 5px",
      ["@media (max-width:768px)"]: {
        fontSize: "14px",
      },
      ["@media (max-width:600px)"]: {
        margin: "20px auto 5px",
      },
      "& > a": {
        color: "black",
      },
    },
    footerLocAddress: {
      width: "fit-content",
      ["@media (max-width:768px)"]: {
        fontSize: "14px",
      },
      ["@media (max-width:600px)"]: {
        margin: "5px auto 0",
      },
      "& > a": {
        color: "black",
      },
    },
    emailPhoneContainer: {
      marginTop: "5px",
      flexWrap: "wrap",
      ["@media (max-width:768px)"]: {
        fontSize: "14px",
      },
      "& > a": {
        color: "black",
      },
    },
    bottomLink: {
      textAlign: "left",
      padding: "10px 0",
      marginLeft: "auto",
      fontWeight: "bold",
      "& a": {
        textDecoration: "none",
        color: "dimgray",
        fontSize: "15px",
        "&:hover": {
          opacity: 0.7,
        },
      },
      ["@media (max-width:1600px)"]: {
        paddingLeft: "60px",
      },
      ["@media (max-width:600px)"]: {
        textAlign: "center",
        paddingLeft: "0px",
      },
    },
    footerContainer: {
      maxWidth: "1440px",
      margin: "auto",
      ["@media (max-width:600px)"]: {
        textAlign: "center",
      },
    },
    imgContainer: {
      display: "flex",
      ["@media (max-width:600px)"]: {
        display: "block",
      },
    },
    specialImages: {
      margin: "auto 0 0 auto",
      height: "50px",
      "& a": {
        width: "fit-content",
        height: "fit-content",
        marginLeft: "10px",
      },
      "& img": {
        height: "100%",
      },
      ["@media (max-width:600px)"]: {
        margin: "20px auto",
        textAlign: "center",
      },
    },
    footerlinks: {
      margin: "10px 0",
      "& ul": {
        margin: 0,
        padding: 0,
        "& li": {
          listStyle: "none",
        },
        "& a": {
          textDecoration: "none",
          width: "fit-content",
        },
      },
    },
    footerImages: {
      display: "flex",
      justifyContent: "space-between",
      paddingRight: "10px",
      overflow: "hidden !important",
      "& > div": {
        display: "flex",
        alignItems: "flex-end",
      },
      ["@media (max-width:1280px)"]: {
        marginTop: "25px",
      },
      ["@media (max-width:600px)"]: {
        display: "block",
        "& > div": {
          alignItems: "center",
          justifyContent: "center",
          margin: "20px 0",
        },
      },
    },
  })
)
