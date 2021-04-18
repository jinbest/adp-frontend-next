import React, { useEffect, useState } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../../store"
import axios from "axios"
import ReactToPrint from "react-to-print"

type Props = {
  handleStatus: (status: boolean) => void
}

const PrivacyPolicy = ({ handleStatus }: Props) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const data = storesDetails.storeCnts
  const htmlLink = data.homepage.footer.bottomLinks.privacyPolicy.externalLink

  const [pageTitle, setPageTitle] = useState("Privacy Statement")
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState("")

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
    axios
      .get(htmlLink)
      .then((res) => {
        setTemplate(res.data)
        setLoading(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (loading) {
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
  }, [loading])

  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className={`${classes.root} privacy-policy`}>
        {loading && (
          <React.Fragment>
            <div
              style={{ scrollBehavior: "smooth" }}
              dangerouslySetInnerHTML={{ __html: template }}
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
