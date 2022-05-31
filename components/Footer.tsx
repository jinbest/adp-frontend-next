import React, { useState, useEffect } from "react"
import { Grid, Box, Typography, Popover } from "@material-ui/core"
import Logo from "./Logo"
import { useTranslation } from "react-i18next"
import { getAddress, phoneFormatString, getWidth, isOriginSameAsLocation } from "../services/helper"
import { observer } from "mobx-react"
import { storesDetails } from "../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { GridMDInterface } from "../model/grid-params"
import _ from "lodash"
import Link from "next/link"
import Badge from "./Badge"

type FooterLinksComponentProps = {
  data: any[]
  isMain: boolean
  initGridMD: GridMDInterface
}

const FooterLinksComponent = ({ data, isMain, initGridMD }: FooterLinksComponentProps) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const storeData = storesDetails.storeCnts
  const themeType = storeData.general.themeType
  const open = Boolean(anchorEl)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      {_.sortBy(data, (o) => o.display_order).map((item: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {item.is_main === isMain && (
              <Grid item xs={12} sm={6} md={themeType === "marnics" ? 6 : initGridMD} className="location-container">
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  className={`${classes.footerLocName} footer-loc-name`}
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
                <div className={`${classes.emailPhoneContainer} footer-email`}>
                  <a href={`tel:${item.phone}`} className={classes.hoverEffect}>
                    {`${phoneFormatString(item.phone, item.phoneFormat)} `}
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
                    className={`${classes.hoverEffect} footer-address`}
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
  const themeType = data.general.themeType
  const thisPage = data.homepage.footer
  const [t] = useTranslation()

  const footerCols = _.sortBy(thisPage.footerLinks, (o) => o.order)
  const footerImageData = thisPage.imageData
  const imageVisible = footerImageData.visible

  const [mobile, setMobile] = useState(false)
  const [colSM, setColSM] = useState<GridMDInterface>(3)

  useEffect(() => {
    handleResize()
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
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
      const cntSM = Math.min(Math.max(3, Math.round(12 / availCols)), 4) as GridMDInterface
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
      {thisPage.images &&
        <div className="footer-bg-container">
          <img src={mobile ? thisPage.images.mobile : thisPage.images.desktop} />
        </div>
      }
      <Typography className="footer-title" style={{ color: thisPage.title.color }}>
        {t(thisPage.title.text)}
      </Typography>
      <div className="footer-box">
        <div className="footer-bgCol">
          <Box className={classes.footerContainer}>
            <div className="footer-nav-items">
              <div className="footer-links">
                <div className="footer-desktop-logo">
                  <Logo
                    type="footer"
                    handleStatus={() => {
                      // EMPTY
                    }}
                  />
                </div>
                <Grid className="d-flex" container spacing={1}>
                  {themeType === "marnics" &&
                    thisPage.footerLinks.map((i: any) => (
                      <Grid item sm={3} key={i.order} className="footer-links-item">
                        <div className="footer-links-name">{i.name}</div>
                        {i.lists?.map((item: any) => (
                          <Link href={item.href ?? "/"} key={item.text}><div className="footer-link-text">{item.text}</div></Link>
                        ))}
                      </Grid>
                    ))
                  }
                </Grid>
                <div className="footer-mobile-logo">
                  <Badge />
                </div>
                <div className="footer-mobile-logo">
                  <div className={classes.footerImagesContainer}>
                    <div className={classes.footerBesideImages}>
                      {footerImageData.logoBeside.map((i: any, ind: number) => (
                        <div key={ind}>
                          <a
                            href={i.link}
                            style={{ cursor: i.link ? "pointer" : "inherit" }}
                          >
                            <img src={i.img_src} alt={`footer-logos-${ind + 1}`} />
                          </a>
                        </div>
                      ))}
                    </div>
                    <div className={classes.footerImages}>
                      {_.sortBy(footerImageData.others, (o) => o.order).map(
                        (item: any, index: number) => {
                          return (
                            <React.Fragment key={index}>
                              {item.visible ? (
                                <div className="footer-other-images" key={index}>
                                  <a
                                    href={item.link}
                                    style={{ cursor: item.link ? "pointer" : "inherit" }}
                                  >
                                    <img src={item.img_src} alt={`footer-logos-${index + 1}`} />
                                  </a>
                                </div>
                              ) : (
                                <></>
                              )}
                            </React.Fragment>
                          )
                        }
                      )}
                    </div>
                  </div>
                  <div>
                    <p
                      className="device-list-grid copyright desktop-copyright"
                      style={{ color: "grey", marginBottom: 0 }}
                    >
                      {t(thisPage.copyRight)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="footer-mobile-logo">
                  <Logo
                    type="footer"
                    handleStatus={() => {
                      // EMPTY
                    }}
                  />
                </div>
                <Grid container>
                  {[true, false].map((item: any, index: number) => {
                    return (
                      <FooterLinksComponent
                        key={index}
                        data={storesDetails.allLocations}
                        isMain={item}
                        initGridMD={themeType === "marnics" ? 3 : 4}
                      />
                    )
                  })}
                </Grid>
              </div>
              {themeType !== "marnics" &&
                <Grid container className={`${classes.footerlinks} footerlinksContainer`}>
                  {footerCols.map((item: any, index: number) => {
                    return (
                      <React.Fragment key={index}>
                        {item.visible ? (
                          <Grid item xs={12} sm={colSM}>
                            <ul>
                              <li className={`${classes.footerLocName} footer-loc-item`}>{t(item.name)}</li>
                              {_.sortBy(item.lists, (o) => o.order).map((it: any, idx: number) => (
                                <React.Fragment key={idx}>
                                  {it.visible ? (
                                    <li className={`${classes.footerLocAddress} footer-loc-address`}>
                                      {isOriginSameAsLocation(it.href) ? (
                                        <a href={it.href}>{t(it.text)}</a>
                                      ) : (
                                        <a href={it.href} target="_blank" rel="noreferrer">
                                          {t(it.text)}
                                        </a>
                                      )}
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
              }
            </div>
            {thisPage.info &&
              <div className="info-container">
                <div>
                  <div className="info-value">{thisPage.info.phone}</div>
                  <div className="info-value">{thisPage.info.mail}</div>
                </div>
                <div>
                  <div className="info-value">{thisPage.info.office}</div>
                  <div className="info-value">{thisPage.info.address}</div>
                </div>
              </div>
            }
            {imageVisible ? (
              <div className="footer-desktop-logo">
                <div className={classes.footerImagesContainer}>
                  <div className={classes.footerBesideImages}>
                    {footerImageData.logoBeside.map((i: any, ind: number) => (
                      <div key={ind}>
                        <a
                          href={i.link}
                          style={{ cursor: i.link ? "pointer" : "inherit" }}
                        >
                          <img src={i.img_src} alt={`footer-logos-${ind + 1}`} />
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className={classes.footerImages}>
                    {_.sortBy(footerImageData.others, (o) => o.order).map(
                      (item: any, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            {item.visible ? (
                              <div className="footer-other-images" key={index}>
                                <a
                                  href={item.link}
                                  style={{ cursor: item.link ? "pointer" : "inherit" }}
                                >
                                  <img src={item.img_src} alt={`footer-logos-${index + 1}`} />
                                </a>
                              </div>
                            ) : (
                              <></>
                            )}
                          </React.Fragment>
                        )
                      }
                    )}
                  </div>
                </div>
                <div>
                  <p
                    className="device-list-grid copyright desktop-copyright"
                    style={{ color: "grey", marginBottom: 0 }}
                  >
                    {t(thisPage.copyRight)}
                  </p>
                </div>
              </div>
            ) : (
              <p
                className="device-list-grid copyright"
                style={{ color: "grey", marginTop: "25px" }}
              >
                {t(thisPage.copyRight)}
              </p>
            )}

            {themeType !== "marnics" &&
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
            }
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
        display: "flex",
        flexDirection: "column"
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
      paddingRight: "10px",
      alignItems: "center",
      flexWrap: "wrap",
      "& > div": {
        display: "flex",
        alignItems: "flex-end",
        height: "100%"
      },
      ["@media (max-width:1280px)"]: {
        justifyContent: "center",
      },
      ["@media (max-width: 1024px)"]: {
        height: 35
      },
      ["@media (max-width:600px)"]: {
        "& > div": {
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
    footerBesideImages: {
      backgroundColor: "#0C6C7A",
      borderRadius: 5,
      height: 45,
      width: 170,
      display: "flex",
      padding: "9px 18px",
      boxSizing: "border-box",
      justifyContent: "space-between",
      marginRight: "24px",
      ["@media (max-width:1024px)"]: {
        height: 35,
        width: 135,
        padding: "7px 14px",
        "& img": {
          height: "100%"
        }
      },
    },
    footerImagesContainer: {
      marginTop: "25px",
      marginBottom: "20px",
      display: "flex",
      ["@media (max-width:600px)"]: {
        marginBottom: 160
      },
    }
  })
)
