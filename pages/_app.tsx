import React, { useState, useEffect } from "react"
import { AppProps } from "next/app"
import { Provider, observer } from "mobx-react"
import { Helmet } from "react-helmet"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Badge from "../components/Badge"
import { storesDetails, repairWidgetStore, repairWidData } from "../store/"
import { appLoadAPI, findLocationAPI } from "../services/"
import { FeaturesParam } from "../model/feature-toggle"
import { MetaParams } from "../model/meta-params"
import { ScriptParams } from "../model/script-params"
import Config from "../config/config"
import { BrowserRouter as Router } from "react-router-dom"
// import { TagParams } from "../model/tag-params";
import _, { isEmpty } from "lodash"
import "../index.css"
import "../assets/style/index.scss"
import "../assets/style/theme.css"

// const domainMatch = window.location.hostname.match(/[a-zA-Z0-9-]*\.[a-zA-Z0-9-]*$/g)
// const apexDomain = domainMatch ? domainMatch[0] : "dccmtx.com"
// const apexDomain = "dccmtx.com"
// const subDomainID = -1

interface DataProps extends AppProps {
  storeData: any
  feats: FeaturesParam[]
  locations: any
  storeCnts: any
  commonCnts: any
}

const App = ({
  Component,
  pageProps,
  storeData,
  feats,
  locations,
  storeCnts,
  commonCnts,
}: DataProps) => {
  const [footerStatus, setFooterStatus] = useState(false)
  const [features, setFeatures] = useState<FeaturesParam[]>([])
  const [pageTitle, setPageTitle] = useState("Store")
  const [favIcon, setFavIcon] = useState("")
  const [metaList, setMetaList] = useState<MetaParams[]>([])
  const [scriptList, setScriptList] = useState<ScriptParams[]>([])
  const [theme, setTheme] = useState("")
  const [loadStatus, setLoadStatus] = useState(false)
  // const parser = new DOMParser();

  const handleFooterStatus = (status: boolean) => {
    setFooterStatus(status)
  }

  // const loadBodyTag = (tag: string) => {
  //   if (tag != null) {
  //     const noScript = document.createElement("noscript");
  //     const htmlDoc = parser.parseFromString(tag, "text/html");
  //     const iframeNode = htmlDoc.getElementsByTagName("iframe")[0];
  //     if (iframeNode != null) {
  //       noScript.prepend(iframeNode);
  //       document.body.prepend(noScript);
  //     }
  //   }
  // };

  const handleTabData = (mainData: any, store_id: number) => {
    const homepage = mainData.homepage,
      scripts: ScriptParams[] = []

    setPageTitle(homepage.headData.title)
    setMetaList(homepage.headData.metaList)
    setFavIcon(homepage.headData.fav.img)
    setTheme(`${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/theme/theme.min.css/asset`)

    // homepage.bodyData.tags.forEach((item: TagParams) => {
    //   loadBodyTag(item.content);
    // });
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
      storesDetails.changeStoreID(storeData.settings.store_id)
      storesDetails.changeIsVoided(storeData.is_voided)
      storesDetails.changestoresDetails(storeData)
      storesDetails.changeStoreCnts(storeCnts)
      storesDetails.changeCommonCnts(commonCnts)
      storesDetails.changeAddLocations(locations)
      setFooterStatus(true)
      handleTabData(storeCnts, storeData.settings.store_id)
      if (storeCnts.general.condition.hasShopLink) {
        const cntFeats = _.cloneDeep(feats)
        cntFeats.push({ flag: "FRONTEND_BUY", isActive: true })
        ;[
          { flag: "ALWAYS_TRUE", isActive: true },
          { flag: "FRONTEND_INSURE", isActive: false },
        ].forEach((item) => {
          cntFeats.push(item)
        })
        setFeatures([...cntFeats])
      }
      setLoadStatus(true)
    }
  }, [])

  return (
    <Provider
      storesDetailsStore={storesDetails}
      repairWidgetStore={repairWidgetStore}
      repairWidDataStore={repairWidData}
    >
      {loadStatus && (
        <React.Fragment>
          <Helmet>
            <title>{pageTitle}</title>
            <link rel="icon" id="favicon" href={favIcon} />
            <link rel="apple-touch-icon" href={favIcon} />
            <link rel="stylesheet" href={theme} />
            {metaList.map((item: MetaParams, index: number) => {
              return <meta name={item.name} content={item.content} key={index} />
            })}
            {storeCnts.general.condition.googleVerification.status && (
              <meta
                name={storeCnts.general.condition.googleVerification.metaData.name}
                content={storeCnts.general.condition.googleVerification.metaData.content}
              />
            )}
            {scriptList.map((item: ScriptParams, index: number) => {
              return <script key={index}>{item.content}</script>
            })}
          </Helmet>
          <Router>
            <Header handleStatus={handleFooterStatus} features={features} />
            <Component {...pageProps} handleStatus={handleFooterStatus} features={features} />
            <Badge />
            {footerStatus && <Footer features={features} storesDetailsStore={storesDetails} />}
          </Router>
        </React.Fragment>
      )}
    </Provider>
  )
}

App.getInitialProps = async () => {
  const apexDomain = "dccmtx.com",
    subDomainID = -1

  const storeData = await appLoadAPI
    .getStoresDetail(apexDomain, false)
    .then((res: any) => {
      return res.data
    })
    .catch((error) => {
      console.log("Error in get Store Details", error)
    })

  const features = await appLoadAPI
    .getFeatures(storeData.settings.store_id)
    .then((res: any) => {
      const feats: FeaturesParam[] = [
        { flag: "ALWAYS_TRUE", isActive: true },
        { flag: "FRONTEND_INSURE", isActive: false },
      ]
      for (let i = 0; i < res.data.length; i++) {
        feats.push({
          flag: res.data[i].feature_id,
          isActive: res.data[i].is_enabled,
        })
      }
      return feats
    })
    .catch((error) => {
      console.log("Error in get Features", error)
    })

  const contents = await appLoadAPI
    .getStoreConfig(storeData.settings.store_id, subDomainID)
    .then((res: any) => {
      return res
    })
    .catch((err) => {
      console.log("Error in get Store Config", err)
    })

  const locations = await findLocationAPI
    .findAllLocation(storeData.settings.store_id)
    .then((res: any) => {
      return res.data
    })
    .catch((error) => {
      console.log("Error in get Features", error)
    })
  return {
    storeData: storeData,
    feats: features,
    locations: locations,
    storeCnts: contents[0].data,
    commonCnts: contents[1].data,
  }
}

export default observer(App)
