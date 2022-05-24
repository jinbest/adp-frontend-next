import React, { useState, useEffect } from "react"
import { AppProps } from "next/app"
import { Provider } from "mobx-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Badge from "../components/Badge"
import { storesDetails, repairWidgetStore, repairWidData } from "../store/"
import { FeaturesParam } from "../model/feature-toggle"
import { MetaParams } from "../model/meta-params"
import { ScriptParams } from "../model/script-params"
import Config from "../config/config"
import SubDomains from "../const/subDomains"
import { BrowserRouter as Router } from "react-router-dom"
import { TagParams } from "../model/tag-params"
import _, { isEmpty } from "lodash"
import { Helmet } from "react-helmet"
import { StoreToggle } from "../model/store-toggle"
import ApiClient from "../services/api-client"
import "../static/style/index.scss"
import "../static/style/theme.css"
import { GeneralData } from "../model/general-data"
import { enableStaticRendering } from "mobx-react"
import { GetDomain } from "../services/helper"

enableStaticRendering(typeof window === "undefined")

const apiClient = ApiClient.getInstance()

interface DataProps extends AppProps {
  storeData: any
  feats: FeaturesParam[]
  locations: any
  storeCnts: any
  commonCnts: any
  apexDomain: string
}

const App = ({
  Component,
  pageProps,
  storeData,
  feats,
  locations,
  storeCnts,
  commonCnts,
}: // apexDomain,
DataProps) => {
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
    const footer = document.getElementById("footer") as HTMLElement
    if (footer) {
      if (typeof window !== "undefined" && window.location.pathname === storeCnts.general.routes.contactPage) {
        footer.classList.add("new-contact-footer")
      } else {
        footer.classList.remove("new-contact-footer")
      }
    }
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

  const handleTabData = (mainData: any) => {
    const homepage = mainData.homepage,
      scripts: ScriptParams[] = []

    setPageTitle(homepage.headData.title)
    setMetaList(homepage.headData.metaList)
    setFavIcon(homepage.headData.fav.img)
    // setTheme(mainData.general.themes.minified)
    setTheme("https://prod.pcmtx.com/api/store-service/dc/store/21/theme/theme.min.css/asset")

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
      handleTabData(storeCnts)
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
          return (
            <script async={true} key={index}>
              {item.content}
            </script>
          )
        })}
      </Helmet>

      {loadStatus && (
        <React.Fragment>
          <Helmet>
            {storeCnts.general.condition.googleVerification.status &&
              !isEmpty(storeCnts.general.condition.googleVerification.metaData) && (
                <meta
                  name={storeCnts.general.condition.googleVerification.metaData.name}
                  content={storeCnts.general.condition.googleVerification.metaData.content}
                />
              )}
          </Helmet>
          <Router>
            <Header handleStatus={handleFooterStatus} features={features} />
            <Component {...pageProps} handleStatus={handleFooterStatus} features={features} />
            {(storeCnts.isDeviceListBadgeVisible ||
              !storeCnts.hasOwnProperty("isDeviceListBadgeVisible")) && <Badge />}
            {footerStatus && <Footer />}
          </Router>
        </React.Fragment>
      )}
    </Provider>
  )
}

App.getInitialProps = async ({ ctx }: Record<string, any>) => {
  /* Local Dev Mode */
  const siteNum = -1,
    subDomainID = -2

  /* Local Prod Mode */
  /* siteNum: [bana(0), geeb(1), mobi(2), nano(3), north(4), phon(5), black(6), repar(7), wireless(8), sourapple(11), devicelist(12), i-wave(13)] */
  // const siteNum = 3,
  //   subDomainID = SubDomains.DEVICE_ADP_LISTS[siteNum].storeID

  let apexDomain = ""
  if (subDomainID > -1) {
    apexDomain = SubDomains.DEVICE_ADP_LISTS[siteNum].domain
  } else {
    apexDomain = GetDomain(ctx.req?.headers?.host)
    // apexDomain = domainMatch ? domainMatch[0] : "mtlcmtx.com"
  }

  const {
    storeConfig,
    storeDetails,
    locations,
    featureToggles,
    commonConfig,
  } = await apiClient.get<GeneralData>(
    `${Config.STORE_SERVICE_API_URL}dc/store/general/${apexDomain}?toggleType=FRONTEND`
  )

  const features: FeaturesParam[] = [
    { flag: "ALWAYS_TRUE", isActive: true },
    { flag: "FRONTEND_INSURE", isActive: false },
  ]

  featureToggles.forEach((item: StoreToggle) => {
    features.push({
      flag: item.feature_id,
      isActive: item.is_enabled,
    })
  })

  if (isEmpty(storeDetails) || isEmpty(features) || isEmpty(locations) || isEmpty(storeConfig)) {
    return {
      notFound: true,
    }
  }

  return {
    storeData: storeDetails,
    feats: features,
    locations: locations,
    storeCnts: storeConfig,
    commonCnts: commonConfig,
    apexDomain: apexDomain,
  }
}

export default App
