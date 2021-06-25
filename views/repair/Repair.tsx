import React, { useState, useEffect } from "react"
import Section1 from "./Section1"
import Section2 from "./Section2"
import Section4 from "./Section4"
import { Error } from "../error"
import { observer } from "mobx-react"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { storesDetails } from "../../store"
import Head from "next/head"
import { MetaParams } from "../../model/meta-params"
import { featureToggleKeys } from "../../const/_variables"

type Props = {
  handleStatus: (status: boolean) => void
  features: any[]
}

const Repair = ({ handleStatus, features }: Props) => {
  const data = storesDetails.storeCnts
  const thisPage = data.repairPage

  const [feats, setFeatures] = useState<any[]>([])
  const [pageTitle, setPageTitle] = useState("Quotes | ")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    const cntFeatures: any[] = []
    for (let i = 0; i < features.length; i++) {
      if (features[i].isActive) {
        cntFeatures.push(features[i].flag)
      }
    }
    setFeatures(cntFeatures)
  }, [features])

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    handleStatus(true)
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
      <FeatureToggles features={feats}>
        <Feature
          name={featureToggleKeys.FRONTEND_REPAIR}
          inactiveComponent={() => <Error />}
          activeComponent={() => (
            <div>
              <Section1 handleStatus={handleStatus} />
              <Section2 />
              <Section4 handleStatus={handleStatus} />
            </div>
          )}
        />
      </FeatureToggles>
    </>
  )
}

export default observer(Repair)
