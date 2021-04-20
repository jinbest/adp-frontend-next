import React, { useEffect, useState } from "react"
import Shape from "./Shape"
import Section1 from "./Section1"
import Section2 from "./Section2"
import SectionWave from "./SectionWave"
import Section6 from "./Section6"
import { storesDetails } from "../../store"
import Head from "next/head"
import { MetaParams } from "../../model/meta-params"

type Props = {
  features: any[]
  handleStatus: (status: boolean) => void
}

const Home = ({ features, handleStatus }: Props) => {
  const mainData = storesDetails.storeCnts.homepage

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
    <div>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" id="favicon" href={mainData.headData.fav.img} />
        <link rel="apple-touch-icon" href={mainData.headData.fav.img} />
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
      </Head>

      <Shape />
      <Section1 features={features} handleStatus={handleStatus} />
      <Section2 features={features} />
      <SectionWave handleStatus={handleStatus} />
      <Section6 />
    </div>
  )
}

export default Home
