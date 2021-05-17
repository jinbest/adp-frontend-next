import React, { useEffect, useState } from "react"
import { storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"
import Head from "next/head"
import { observer } from "mobx-react"
import { findIndex, isEmpty } from "lodash"
import { loadPage } from "./page-service"
import ReactPageEditor from "./react-page-editor"
import { Value } from "@react-page/editor"
import { createStyles, makeStyles } from "@material-ui/core/styles"

type Props = {
  handleStatus: (status: boolean) => void
  slug?: string
  type?: string
}

const GeneralPage = ({ handleStatus, slug, type }: Props) => {
  const classes = useStyles()

  const mainData = storesDetails.storeCnts.pages
  const storeID = storesDetails.storesDetails.settings.store_id

  const [pageTitle, setPageTitle] = useState("General")
  const [meta, setMeta] = useState<MetaParams>({} as MetaParams)
  const [pageData, setPageData] = useState<Value>({} as Value)
  const [editorVisible, setEditorVisible] = useState(false)

  useEffect(() => {
    const pageIndex = findIndex(mainData, { slug: slug })
    if (pageIndex > -1) {
      setPageTitle(mainData[pageIndex].header.title)
      setMeta({ name: "description", content: mainData[pageIndex].header.meta_description })
    }
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
    if (slug) {
      loadData(slug)
    }
    return () => {
      setPageData({} as Value)
      setEditorVisible(false)
    }
  }, [slug])

  const loadData = async (slg: string) => {
    if (type) {
      const cntPageData = await loadPage(storeID, type, `${slg}.json`)
      setPageData(cntPageData)
      setEditorVisible(true)
    }
  }

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {!isEmpty(meta) && <meta name={meta.name} content={meta.content} />}
      </Head>
      <div className={classes.root}>{editorVisible && <ReactPageEditor value={pageData} />}</div>
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
  })
)
