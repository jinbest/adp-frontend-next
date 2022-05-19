import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { storesDetails } from "../../store"
import Head from "next/head"
import { MetaParams } from "../../model/meta-params"

const useStyles = makeStyles({
  root: {

  }
})

const BuyPage = () => {
  const data = storesDetails.storeCnts
  const thisPage = data.buyPage
  const [pageTitle, setPageTitle] = useState("Quotes | ")
  const [metaList, setMetaList] = useState<MetaParams[]>([])
  const classes = useStyles()

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
      </Head>
    </>
  )
}
export default BuyPage
