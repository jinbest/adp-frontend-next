import React, { useEffect, useState } from "react"
import { storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"
import Head from "next/head"
import { observer } from "mobx-react"
import { findIndex, isEmpty } from "lodash"
import ReactPageEditor from "./react-page-editor"
import { Value } from "@react-page/editor"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import ReactToPrint from "react-to-print"
import { useTranslation } from "react-i18next"

type Props = {
  handleStatus: (status: boolean) => void
  slug: string
  pageData: Value
}

const GeneralPage = ({ handleStatus, slug, pageData }: Props) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const data = storesDetails.storeCnts
  const mainData = data.pages

  const [pageTitle, setPageTitle] = useState("General")
  const [meta, setMeta] = useState<MetaParams>({} as MetaParams)
  const [editorVisible, setEditorVisible] = useState(false)
  const [print, setPrint] = useState(false)

  useEffect(() => {
    if (slug) {
      const pageIndex = findIndex(mainData, { slug: slug })
      if (pageIndex > -1) {
        setPageTitle(mainData[pageIndex].header.title)
        setMeta({ name: "description", content: mainData[pageIndex].header.meta_description })
        setPrint(mainData[pageIndex].print ? true : false)
      }
      handleStatus(mainData[pageIndex].include_footer)
      if (pageIndex > -1 && !mainData[pageIndex].include_header) {
        const header = document.getElementsByClassName("header")[0] as HTMLElement,
          editorContainer = document.getElementById("react-page-editor-container") as HTMLDivElement
        header.style.display = "none"
        editorContainer.classList.add(classes.withoutHeader)
      }
      setEditorVisible(true)
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }
  }, [slug])

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {!isEmpty(meta) && <meta name={meta.name} content={meta.content} />}
      </Head>
      <div className={classes.root}>
        {editorVisible && (
          <div id="react-page-editor-container">
            <ReactPageEditor value={pageData} />
          </div>
        )}
      </div>
      {print && (
        <div className={classes.download}>
          <ReactToPrint
            trigger={() => (
              <p style={{ color: data.general.colorPalle.textThemeCol }}>{t("Print")}</p>
            )}
            content={() => document.getElementById("react-page-editor-container") as HTMLDivElement}
          />
        </div>
      )}
    </div>
  )
}

export default observer(GeneralPage)

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "1440px",
      padding: "170px 30px 50px !important",
      margin: "auto",
    },
    withoutHeader: {
      padding: "50px 30px !important",
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
