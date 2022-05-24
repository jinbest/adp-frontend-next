import React from "react"
import Button from "../../components/Button"
import Link from "next/link"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next"
import { storesDetails, repairWidgetStore } from "../../store"
import { isExternal } from "../../services/helper"
import _ from "lodash"
import { makeStyles } from "@material-ui/core/styles"

interface Props {
  handleStatus: (status: boolean) => void
}

const Section1 = ({ handleStatus }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.tradePage.section1
  const buttons = _.sortBy(thisPage.buttons, (o) => o.order)
  const [t] = useTranslation()
  const classes = useStyles()

  const handleRepairWidget = () => {
    repairWidgetStore.init()
    handleStatus(false)
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className="decoration-bar" style={{ backgroundColor: thisPage.themeCol }} />
        <div className={classes.mainTitle} style={{ color: thisPage.themeCol }}>{t(thisPage.title)}</div>
        <div className={classes.subtitle} style={{ color: thisPage.themeCol }}>{t(thisPage.subtitle)}</div>
        <div className={classes.buttons}>
          {buttons.map((i: any) => (
            i.visible ? (
              isExternal(i.link) ? (
                <a
                  href={i.link}
                  style={{ textDecoration: "none" }}
                  target="_blank"
                  rel="noreferrer"
                  key={i.title}
                >
                  <div className={classes.button}>
                    <Button
                      title={t(i.title)}
                      bgcolor="#fff"
                      txcolor="#DC7700"
                      width="100%"
                      borderR="0"
                    />
                  </div>
                </a>
              ) : (
                <Link
                  href={i.link}
                  key={i.title}
                  passHref
                >
                  <a className={classes.button} onClick={handleRepairWidget}>
                    <Button
                      title={t(i.title)}
                      bgcolor="#fff"
                      width="100%"
                      txcolor="#DC7700"
                      borderR="0"
                    />
                  </a>
                </Link>
              )
            ) : null
          ))}
        </div>
        <img src={thisPage.decorationImg} className={classes.decoration} alt="decoration" />
        <div className={classes.mobileDecoration}>
          <img src={thisPage.decorationImg} alt="decoration" />
        </div>
      </div>
      <img src={thisPage.sectionImg} className={classes.phone} alt="phone" />
      <div className={classes.mobilePhone} style={{backgroundImage: `url("${thisPage.sectionImg}")`}}>
        {/* <img src={thisPage.sectionImg} alt="phone" /> */}
      </div>
    </div>
  )
}

export default observer(Section1)

const useStyles = makeStyles({
  root: {
    backgroundColor: "#143663",
    position: "relative",
    marginTop: 120,
    "&:after": {
      content: "''",
      width: "100%",
      height: "100%",
      position: "absolute",
      backgroundColor: "inherit",
      zIndex: -1,
      bottom: 0,
      transformOrigin: "left bottom",
      transform: "skewY(5deg)",
      boxShadow: "0 12px 12px rgba(35, 91, 137, 0.25)"
    }
  },
  container: {
    maxWidth: 1440,
    width: "100%",
    margin: "auto",
    paddingTop: 90,
    paddingBottom: 90,
    position: "relative",
    boxSizing: "border-box",
  },
  mainTitle: {
    fontSize: 64,
    fontFamily: "Helvetica Neue Bold !important",
    color: "white",
    maxWidth: 900,
    lineHeight: "120%",
    position: "relative",
    zIndex: 1
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Helvetica Neue Regular !important",
    lineHeight: "150%",
    margin: "19px 0",
    maxWidth: 550,
    position: "relative",
    zIndex: 1
  },
  buttons: {
    display: "flex"
  },
  button: {
    width: 127,
    textDecoration: "none"
  },
  decoration: {
    position: "absolute",
    top: 90,
    right: 0,
    width: 470
  },
  phone: {
    position: "absolute",
    top: 67,
    right: 0
  },
  mobileDecoration: {
    display: "none"
  },
  mobilePhone: {
    display: "none",
    position: "absolute",
    width: "100%"
  },
  "@media (max-width: 1440px)": {
    container: {
      paddingLeft: "48px",
      paddingRight: "48px"
    },
    decoration: {
      right: 48,
      width: 385
    },
    phone: {
      maxWidth: 700,
      top: 200
    },
    mainTitle: {
      fontSize: 48
    }
  },
  "@media (max-width: 1024px)": {
    mainTitle: {
      fontSize: 36
    },
    phone: {
      width: 430,
      top: 220
    }
  },
  "@media (max-width: 768px)": {
    phone: {
      top: 260
    },
    root: {
      marginTop: 55
    }
  },
  "@media (max-width: 600px)": {
    container: {
      padding: "26px 20px 0"
    },
    decoration: {
      display: "none"
    },
    mobileDecoration: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 32
    },
    root: {
      marginTop: 115
    },
    mainTitle: {
      fontSize: 28,
      paddingTop: 9
    },
    subtitle: {
      fontSize: 16,
      marginTop: 8
    },
    phone: {
      display: "none"
    },
    mobilePhone: {
      display: "flex",
      justifyContent: "center",
      height: 520,
      backgroundPosition: "center",
      backgroundSize: "cover",
      top: 255,
      minHeight: 430
    },
  }
})