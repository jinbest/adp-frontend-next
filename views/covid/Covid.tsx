import React, { useEffect, useState } from "react"
import { storesDetails } from "../../store"
import Shape from "./Shape"
import Section1 from "./Section1"
import Section2 from "./Section2"
import { MetaParams } from "../../model/meta-params"
import Head from "next/head"

type Props = {
  handleStatus: (status: boolean) => void
}

const Covid = ({ handleStatus }: Props) => {
  const mainData = storesDetails.storeCnts.covidPage

  const [pageTitle, setPageTitle] = useState("Store")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    const storeTabData = mainData.headData
    setPageTitle(storeTabData.title)
    setMetaList(storeTabData.metaList)
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  return (
    <div className="covid-page-container">
      <Head>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
      </Head>
      <Shape />
      <Section1 handleStatus={handleStatus} />
      <Section2 />
    </div>
  )
}

export default Covid
