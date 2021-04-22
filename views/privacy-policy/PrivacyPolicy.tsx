import React, { useEffect, useState } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import ReactToPrint from "react-to-print"

type Props = {
  handleStatus: (status: boolean) => void
  privacyTemplate: string
}

const PrivacyPolicy = ({ handleStatus, privacyTemplate }: Props) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const data = storesDetails.storeCnts

  const [pageTitle, setPageTitle] = useState("Privacy Statement")

  useEffect(() => {
    handleStatus(true)
    setPageTitle(`${storesDetails.storesDetails.name} Privacy Statement`)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  useEffect(() => {
    if (privacyTemplate) {
      const contents = document.getElementsByClassName("content"),
        fillDots = document.getElementsByClassName("fill-dot")
      for (let i = 0; i < contents.length; i++) {
        const content = contents[i] as HTMLElement
        content.style.margin = "20px 0"
      }
      for (let i = 0; i < fillDots.length; i++) {
        const fillDot = fillDots[i] as HTMLSpanElement
        fillDot.style.marginBottom = "-40px"
      }
    }
  }, [privacyTemplate])

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className={`${classes.root} privacy-policy`}>
        {privacyTemplate && (
          <React.Fragment>
            <div
              style={{ scrollBehavior: "smooth" }}
              dangerouslySetInnerHTML={{ __html: privacyTemplate }}
            ></div>
            <div className={classes.download}>
              <ReactToPrint
                trigger={() => (
                  <p style={{ color: data.general.colorPalle.textThemeCol }}>{t("Print")}</p>
                )}
                content={() => document.getElementById("privacy-container") as HTMLDivElement}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default PrivacyPolicy

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "1440px",
      display: "block",
      textAlign: "left",
    },
    download: {
      textAlign: "right",
      padding: "0 50px",
      "& p": {
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        width: "fit-content",
        marginLeft: "auto",
        "&:hover": {
          opacity: 0.7,
        },
      },
      ["@media (max-width:500px)"]: {
        padding: "0 30px",
      },
      ["@media (max-width:425px)"]: {
        padding: "0 20px",
      },
    },
  })
)
