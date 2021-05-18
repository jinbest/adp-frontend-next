import React, { useState, useEffect } from "react"
import Head from "next/head"
import { MetaParams } from "../../model/meta-params"
import { SpecificConfigParams } from "../../model/specific-config-param"
import { isEmpty } from "lodash"
import Shape from "./Shape"
import SpecSection1 from "./Section1"
import SpecSection2 from "./Section2"
import SpecSection3 from "./Section3"
import SpecSection4 from "./Section4"
import SpecSection5 from "./Section5"
import SpecCommingSoon from "./CommingSoon"

type Props = {
  handleStatus: (status: boolean) => void
  locID: number
  specConfig: SpecificConfigParams
}

const SpecificLocation = ({ handleStatus, locID, specConfig }: Props) => {
  const [pageTitle, setPageTitle] = useState("Store")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(specConfig)) {
      setPageTitle(specConfig.headData.title)
      setMetaList(specConfig.headData.metaList)
    }
  }, [specConfig])

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
      </Head>
      <Shape />
      {!isEmpty(specConfig) && (
        <React.Fragment>
          {!specConfig.commingsoon.flag ? (
            <>
              {locID && <SpecSection1 config={specConfig.section1} locID={locID} />}
              {specConfig.section2.isVisible && <SpecSection2 config={specConfig.section2} />}
              {specConfig.section3.isVisible && <SpecSection3 config={specConfig.section3} />}
              {specConfig.section4.isVisible && <SpecSection4 config={specConfig.section4} />}
              <SpecSection5 config={specConfig.section5} />
            </>
          ) : (
            <>{locID && <SpecCommingSoon config={specConfig.commingsoon} locID={locID} />}</>
          )}
        </React.Fragment>
      )}
    </div>
  )
}

export default SpecificLocation
