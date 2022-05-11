import React, { useEffect, useState } from "react"
import { Shape, Section1, Section2, Section3, SectionWave, SectionDecoration, Section6, SectionService, Section5 } from "."
import { storesDetails } from "../../store"
import Head from "next/head"
import { MetaParams } from "../../model/meta-params"

type Props = {
  features: any[]
  handleStatus: (status: boolean) => void
}

const Home = ({ features, handleStatus }: Props) => {
  const mainData = storesDetails.storeCnts.homepage
  const themeType = storesDetails.storeCnts.general.themeType

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
      <SectionDecoration />
      <Section1 features={features} handleStatus={handleStatus} />
      {themeType === "marnics" &&
        <div className="mobile-decoration">
          <Shape />
          <div className="decoration-circle-right">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div className="d-flex mb-48 flex-end" key={`right${i}`}>
                {new Array(i).fill(1).map((_, index) => (
                  <div key={index} className="decoration-circle" style={{ marginRight: 0, marginLeft: 48 }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      }
      <SectionService />
      <Section2 features={features} />
      <Section3 features={features} />
      <SectionWave handleStatus={handleStatus} />
      <Section5 />
      <Section6 />
    </div>
  )
}

export default Home
