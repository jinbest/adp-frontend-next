import React, { useState, useEffect } from "react"
import Head from "next/head"
import { MetaParams } from "../../model/meta-params"
import { SpecificConfigParams, SpecificConfigArray } from "../../model/specific-config-param"
import { isEmpty, findIndex } from "lodash"
import Shape from "./Shape"
import SpecSection1 from "./Section1"
import SpecSection2 from "./Section2"
import { ToastMsgParams } from "../../components/toast/toast-msg-params"
import Toast from "../../components/toast/toast"
import { storesDetails } from "../../store"
import { observer } from "mobx-react"

type Props = {
  handleStatus: (status: boolean) => void
  locID: number
  storeID: number
}

const SpecificLocation = ({ handleStatus, locID }: Props) => {
  const specConfArray: SpecificConfigArray[] = storesDetails.specConfigArray
  const confIndex = findIndex(specConfArray, { id: locID })
  const specConfig: SpecificConfigParams = specConfArray[confIndex].config

  const [pageTitle, setPageTitle] = useState("Store")
  const [metaList, setMetaList] = useState<MetaParams[]>([])
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)

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

  const resetStatuses = () => {
    setToastParams({
      msg: "",
      isError: false,
      isWarning: false,
      isInfo: false,
      isSuccess: false,
    })
  }

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
        <>
          <SpecSection1 config={specConfig.section1} locID={locID} />
          {specConfig.section2.isVisible && <SpecSection2 config={specConfig.section2} />}
        </>
      )}
      <Toast params={toastParams} resetStatuses={resetStatuses} />
    </div>
  )
}

export default observer(SpecificLocation)
