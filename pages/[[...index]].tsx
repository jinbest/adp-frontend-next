import React, { useState, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import { Provider, observer } from "mobx-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Badge from "../components/Badge"
import { storesDetails, repairWidgetStore, repairWidData } from "../store/"
import { appLoadAPI } from "../services/"
import { FeaturesParam } from "../model/feature-toggle"
import { MetaParams } from "../model/meta-params"
import { ScriptParams } from "../model/script-params"
import Config from "../config/config"
import { BrowserRouter as Router } from "react-router-dom"
import { TagParams } from "../model/tag-params"
import _, { isEmpty } from "lodash"
import { Helmet } from "react-helmet"
import { Store } from "../model/store"
import { StoreToggle } from "../model/store-toggle"
import { GetManyResponse } from "../model/get-many-response"
import ApiClient from "../services/api-client"
import BaseRouter from "../views/BaseRouter"

const apiClient = ApiClient.getInstance()

function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { storeData, feats, locations, storeCnts, commonCnts } = data

  const [theme, setTheme] = useState("")
  const [favIcon, setFavIcon] = useState("")
  const [pageTitle, setPageTitle] = useState("")
  const [metaList, setMetaList] = useState<MetaParams[]>([])
  const [features, setFeatures] = useState<FeaturesParam[]>([])
  const [scriptList, setScriptList] = useState<ScriptParams[]>([])
  const [loadStatus, setLoadStatus] = useState(false)
  const [footerStatus, setFooterStatus] = useState(false)

  const handleFooterStatus = (status: boolean) => {
    setFooterStatus(status)
  }

  const loadBodyTag = (tag: string) => {
    if (tag != null) {
      const parser = new DOMParser()
      const noScript = document.createElement("noscript")
      const htmlDoc = parser.parseFromString(tag, "text/html")
      const iframeNode = htmlDoc.getElementsByTagName("iframe")[0]
      if (iframeNode != null) {
        noScript.prepend(iframeNode)
        document.body.prepend(noScript)
      }
    }
  }

  const handleTabData = (mainData: any, store_id: number) => {
    const homepage = mainData.homepage,
      scripts: ScriptParams[] = []

    setPageTitle(homepage.headData.title)
    setMetaList(homepage.headData.metaList)
    setFavIcon(homepage.headData.fav.img)

    /* This is for local work */
    // const prodLink = "https://prod.pcmtx.com/api/store-service/"
    // if (subDomainID > 0) {
    //   setTheme(`${prodLink}dc/store/${subDomainID}/theme/theme.min.css/asset`)
    // } else {
    //   setTheme(`${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/theme/theme.min.css/asset`)
    // }

    /* This is for production */
    setTheme(`${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/theme/theme.min.css/asset`)

    homepage.bodyData.tags.forEach((item: TagParams) => {
      loadBodyTag(item.content)
    })

    homepage.headData.scripts.forEach((item: ScriptParams) => {
      if (item.type === "reamaze" && item.content) {
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.append(item.content)
        document.body.appendChild(script)
        const scriptReamaze = document.createElement("script")
        scriptReamaze.type = "text/javascript"
        scriptReamaze.src = "https://cdn.reamaze.com/assets/reamaze.js"
        scriptReamaze.async = true
        document.body.appendChild(scriptReamaze)
      } else if (item.type !== "reamaze") {
        scripts.push(item)
      }
    })
    setScriptList(scripts)
  }

  useEffect(() => {
    if (!isEmpty(storeData) && !isEmpty(storeCnts) && !isEmpty(commonCnts) && !isEmpty(locations)) {
      handleTabData(storeCnts, storeData.settings.store_id)
      storesDetails.changeStoreID(storeData.settings.store_id)
      storesDetails.changeIsVoided(storeData.is_voided)
      storesDetails.changestoresDetails(storeData)
      storesDetails.changeStoreCnts(storeCnts)
      storesDetails.changeCommonCnts(commonCnts)
      storesDetails.changeAddLocations(locations)
      setFooterStatus(true)
      const cntFeats = _.cloneDeep(feats)
      if (storeCnts.general.condition.hasShopLink) {
        cntFeats.push({ flag: "FRONTEND_BUY", isActive: true })
      }
      setFeatures([...cntFeats])
      setLoadStatus(true)
    }
  }, [])

  return (
    <Provider
      storesDetailsStore={storesDetails}
      repairWidgetStore={repairWidgetStore}
      repairWidDataStore={repairWidData}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="icon" id="favicon" href={favIcon} />
        <link rel="apple-touch-icon" href={favIcon} />
        <link rel="stylesheet" href={theme} />
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
        {scriptList.map((item: ScriptParams, index: number) => {
          return <script key={index}>{item.content}</script>
        })}
      </Helmet>
      {loadStatus && (
        <React.Fragment>
          <Helmet>
            {storeCnts.general.condition.googleVerification.status && (
              <meta
                name={storeCnts.general.condition.googleVerification.metaData.name}
                content={storeCnts.general.condition.googleVerification.metaData.content}
              />
            )}
          </Helmet>
          <Router>
            <Header handleStatus={handleFooterStatus} features={features} />
            <BaseRouter handleStatus={handleFooterStatus} features={features} />
            <Badge />
            {footerStatus && <Footer />}
          </Router>
        </React.Fragment>
      )}
    </Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const domainMatch = ctx.req.headers.host?.match(/[a-zA-Z0-9-]*\.[a-zA-Z0-9-]*$/g)
  // const apexDomain = domainMatch ? domainMatch[0] : "dccmtx.com"
  console.log(ctx)
  const apexDomain = "dccmtx.com"
  const subDomainID = -1

  // const devicelist = [
  //   { name: "bananaservices", domain: "bananaservices.ca", storeID: 1 },
  //   { name: "geebodevicerepair", domain: "geebodevicerepair.ca", storeID: 3 },
  //   { name: "mobiletechlab", domain: "mobiletechlab.ca", storeID: 4 },
  //   { name: "nanotechmobile", domain: "nanotechmobile.ca", storeID: 2 },
  //   { name: "northtechcellsolutions", domain: "northtechcellsolutions.ca", storeID: 5 },
  //   { name: "phonephix", domain: "phonephix.ca", storeID: 9 },
  //   { name: "pradowireless", domain: "pradowireless.com", storeID: 10 },
  //   { name: "reparationcellulairebsl", domain: "reparationcellulairebsl.ca", storeID: 7 },
  //   { name: "wirelessrevottawa", domain: "wirelessrevottawa.ca", storeID: 8 },
  //   { name: "dccmtx", domain: "https://dev.mtlcmtx.com/", storeID: 1 },
  //   { name: "mtlcmtx", domain: "https://dev.mtlcmtx.com/", storeID: 2 },
  // ]
  // const siteNum = 2,
  //   subDomainID = devicelist[siteNum].storeID

  const storeData = await apiClient.get<Store>(
    `${Config.STORE_SERVICE_API_URL}dc/store/domain/${apexDomain}?include_children=false`
  )

  const url = `${Config.ADMIN_SERVICE_API_URL}dc/store/${storeData.settings.store_id}/features/toggle?types=FRONTEND`
  const storeToggles = await apiClient.get<StoreToggle[]>(url)
  const features: FeaturesParam[] = [
    { flag: "ALWAYS_TRUE", isActive: true },
    { flag: "FRONTEND_INSURE", isActive: false },
  ]
  storeToggles.forEach((item: StoreToggle) => {
    features.push({
      flag: item.feature_id,
      isActive: item.is_enabled,
    })
  })

  const contents = await appLoadAPI
    .getStoreConfig(storeData.settings.store_id, subDomainID)
    .then((res: any) => {
      return res
    })
    .catch((err) => {
      console.log("Error in get Store Config", err)
    })

  const locURL = `${Config.STORE_SERVICE_API_URL}dc/store/${storeData.settings.store_id}/locations?page=1&per_page=10000&include_voided=false`
  const response = await apiClient.get<GetManyResponse>(locURL)
  const locations = response.data

  if (isEmpty(storeData) || isEmpty(features) || isEmpty(locations) || isEmpty(contents)) {
    return {
      notFound: true,
    }
  }

  const data = {
    storeData: storeData,
    feats: features,
    locations: locations,
    storeCnts: contents[0].data,
    commonCnts: contents[1].data,
    subDomainID: subDomainID,
  }

  return {
    props: {
      data,
    },
  }
}

export default observer(Page)
