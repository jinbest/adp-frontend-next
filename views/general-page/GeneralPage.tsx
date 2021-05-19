import React, { useEffect, useState } from "react"
import { storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"
import Head from "next/head"
import { observer } from "mobx-react"
import { findIndex, isEmpty } from "lodash"
import ReactPageEditor from "./react-page-editor"
import { Value } from "@react-page/editor"
import { createStyles, makeStyles } from "@material-ui/core/styles"

type Props = {
  handleStatus: (status: boolean) => void
  slug: string
  pageData: Value
}

const GeneralPage = ({ handleStatus, slug, pageData }: Props) => {
  const classes = useStyles()

  const mainData = storesDetails.storeCnts.pages

  const [pageTitle, setPageTitle] = useState("General")
  const [meta, setMeta] = useState<MetaParams>({} as MetaParams)
  const [editorVisible, setEditorVisible] = useState(false)

  useEffect(() => {
    if (slug) {
      const pageIndex = findIndex(mainData, { slug: slug })
      if (pageIndex > -1) {
        setPageTitle(mainData[pageIndex].header.title)
        setMeta({ name: "description", content: mainData[pageIndex].header.meta_description })
      }
      handleStatus(mainData[pageIndex].include_footer)
      if (!mainData[pageIndex].include_header) {
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
      <div className={classes.root} id="react-page-editor-container">
        {editorVisible && <ReactPageEditor value={pageData} />}
      </div>
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
  })
)
