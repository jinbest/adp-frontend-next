import React, { useState, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import { Provider, observer } from "mobx-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { storesDetails } from "../../store"
import { appLoadAPI } from "../../services"
import { FeaturesParam } from "../../model/feature-toggle"
import { SpecificConfigArray, SpecificConfigParams } from "../../model/specific-config-param"
import Config from "../../config/config"
import _, { isEmpty } from "lodash"
import { Helmet } from "react-helmet"
import { Store } from "../../model/store"
import { StoreToggle } from "../../model/store-toggle"
import { GetManyResponse } from "../../model/get-many-response"
import ApiClient from "../../services/api-client"
import { useRouter } from "next/router"
import { BrowserRouter as Router } from "react-router-dom"
import SpecificLocation from "../../views/specific-location/SpecificLocation"
import { findIndex } from "lodash"

const apiClient = ApiClient.getInstance()

function SlugPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { storeData, feats, locations, storeCnts, commonCnts, specConfArray } = data
  const router = useRouter()

  const [theme, setTheme] = useState("")
  const [favIcon, setFavIcon] = useState("")
  const [features, setFeatures] = useState<FeaturesParam[]>([])
  const [loadStatus, setLoadStatus] = useState(false)
  const [footerStatus, setFooterStatus] = useState(false)
  const [locID, setLocID] = useState(-1)

  const handleFooterStatus = (status: boolean) => {
    setFooterStatus(status)
  }

  const handleTabData = (mainData: any, store_id: number) => {
    const homepage = mainData.homepage
    setFavIcon(homepage.headData.fav.img)
    setTheme(`${Config.STORE_SERVICE_API_URL}dc/store/${store_id}/theme/theme.min.css/asset`)
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
    storesDetails.changeSpecConfArray(specConfArray)
  }, [])

  useEffect(() => {
    const slugIndex = findIndex(storeCnts.locations, { slug: router.query.slug })
    if (slugIndex > -1) {
      setLocID(storeCnts.locations[slugIndex].id)
    }
  }, [router])

  return (
    <Provider storesDetailsStore={storesDetails}>
      <Helmet>
        <link rel="stylesheet" href={theme} />
        <link rel="icon" id="favicon" href={favIcon} />
        <link rel="apple-touch-icon" href={favIcon} />
      </Helmet>
      {loadStatus && (
        <Router>
          <Header handleStatus={handleFooterStatus} features={features} />
          {locID > -1 && (
            <SpecificLocation
              handleStatus={handleFooterStatus}
              locID={locID}
              storeID={storeData.settings.store_id}
            />
          )}
          {footerStatus && <Footer />}
        </Router>
      )}
    </Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const domainMatch = ctx.req.headers.host?.match(/[a-zA-Z0-9-]*\.[a-zA-Z0-9-]*$/g)
  const apexDomain = domainMatch ? domainMatch[0] : "dccmtx.com"
  const subDomainID = -1
  const slug = ctx.params?.slug

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

  if (findIndex(contents[0].data.locations, { slug: slug }) === -1) {
    return {
      redirect: {
        destination: "/locations",
        permanent: false,
      },
    }
  }

  const locURL = `${Config.STORE_SERVICE_API_URL}dc/store/${storeData.settings.store_id}/locations?page=1&per_page=10000&include_voided=false`
  const response = await apiClient.get<GetManyResponse>(locURL)
  const locations = response.data

  if (isEmpty(storeData) || isEmpty(features) || isEmpty(locations) || isEmpty(contents)) {
    return {
      notFound: true,
    }
  }

  const specConfArray: SpecificConfigArray[] = []
  for (let i = 0; i < contents[0].data.locations.length; i++) {
    if (contents[0].data.locations[i].slug) {
      const conf = await apiClient.get<SpecificConfigParams>(
        `${Config.STORE_SERVICE_API_URL}dc/store/${storeData.settings.store_id}/location/${contents[0].data.locations[i].id}/config`
      )
      specConfArray.push({
        id: contents[0].data.locations[i].id,
        config: conf,
      })
    }
  }

  const data = {
    storeData: storeData,
    feats: features,
    locations: locations,
    storeCnts: contents[0].data,
    commonCnts: contents[1].data,
    subDomainID: subDomainID,
    specConfArray: specConfArray,
  }

  return {
    props: {
      data,
    },
  }
}

export default observer(SlugPage)
