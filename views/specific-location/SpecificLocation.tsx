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
import { ToastMsgParams } from "../../components/toast/toast-msg-params"
import Toast from "../../components/toast/toast"
import { storesDetails } from "../../store"
import { observer } from "mobx-react"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"

const apiClient = ApiClient.getInstance()

type Props = {
  handleStatus: (status: boolean) => void
  locID: number
}

const SpecificLocation = ({ handleStatus, locID }: Props) => {
  const [specConfig, setSpecConfig] = useState<SpecificConfigParams>({} as SpecificConfigParams)

  useEffect(() => {
    loadConfig()
    return () => {
      setSpecConfig({} as SpecificConfigParams)
    }
  }, [])

  const loadConfig = async () => {
    const conf = await apiClient.get<SpecificConfigParams>(
      `${Config.STORE_SERVICE_API_URL}dc/store/${storesDetails.storesDetails.settings.store_id}/location/${locID}/config`
    )
    setSpecConfig(conf)
  }

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
        <React.Fragment>
          {!specConfig.commingsoon.flag ? (
            <>
              <SpecSection1 config={specConfig.section1} locID={locID} />
              {specConfig.section2.isVisible && <SpecSection2 config={specConfig.section2} />}
              {specConfig.section3.isVisible && <SpecSection3 config={specConfig.section3} />}
              {specConfig.section4.isVisible && <SpecSection4 config={specConfig.section4} />}
              <SpecSection5 config={specConfig.section5} />
            </>
          ) : (
            <SpecCommingSoon config={specConfig.commingsoon} locID={locID} />
          )}
        </React.Fragment>
      )}
      <Toast params={toastParams} resetStatuses={resetStatuses} />
    </div>
  )
}

export default observer(SpecificLocation)
