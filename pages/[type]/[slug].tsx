import React from "react"
import { Switch } from "react-router-dom"
import { storesDetails } from "../../store/"
import { FeaturesParam } from "../../model/feature-toggle"
import { observer } from "mobx-react"
import AppRoute from "../../routes/route"
import { pageRoutes } from "../../routes/index"
import { isEmpty } from "lodash"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"
import { SpecificConfigParams } from "../../model/specific-config-param"
import SubDomains from "../../const/subDomains"
import { Store } from "../../model/store"
import { appLoadAPI } from "../../services/"
import { findIndex } from "lodash"
import { Value } from "@react-page/editor"

const apiClient = ApiClient.getInstance()

interface SlugPageProps extends InferGetServerSidePropsType<typeof getServerSideProps> {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

const Slug = ({ features, handleStatus, data }: SlugPageProps) => {
  const { specConfig, pageData, specLocStatus } = data

  return (
    <Switch>
      {pageRoutes(storesDetails.storeCnts, specLocStatus).map((item: any, index: number) => {
        return (
          <AppRoute
            Component={item.component}
            path={item.path}
            features={features}
            handleStatus={handleStatus}
            locID={
              !isEmpty(item.special) && item.special.type === "Special Location"
                ? item.special.data.locID
                : null
            }
            specConfig={
              !isEmpty(item.special) && item.special.type === "Special Location"
                ? specConfig
                : ({} as SpecificConfigParams)
            }
            pageData={
              !isEmpty(item.special) && item.special.type === "General Page"
                ? pageData
                : ({} as Value)
            }
            slug={
              !isEmpty(item.special) && item.special.type === "General Page"
                ? item.special.data.slug
                : ""
            }
            key={index}
          />
        )
      })}
    </Switch>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const domainMatch = ctx.req.headers.host?.match(/[a-zA-Z0-9-]*\.[a-zA-Z0-9-]*$/g)
  const slug = ctx.params?.slug,
    type = ctx.params?.type

  /* Local Dev Mode */
  const siteNum = -1,
    subDomainID = -1

  /* Local Prod Mode */
  /* siteNum: [bana(0), geeb(1), mobi(2), nano(3), north(4), phon(5), prado(6), repar(7), wireless(8)] */
  // const siteNum = 2,
  //   subDomainID = SubDomains.DEVICE_ADP_LISTS[siteNum].storeID

  let apexDomain = ""
  if (subDomainID > 0) {
    apexDomain = SubDomains.DEVICE_ADP_LISTS[siteNum].domain
  } else {
    apexDomain = domainMatch ? domainMatch[0] : "dccmtx.com"
  }

  const storeData = await apiClient.get<Store>(
    `${Config.STORE_SERVICE_API_URL}dc/store/domain/${apexDomain}?include_children=false`
  )

  const contents = await appLoadAPI
    .getStoreConfig(storeData.settings.store_id)
    .then((res: any) => {
      return res
    })
    .catch((err) => {
      console.log("Error in get Store Config", err)
    })

  const specSlugIndex = findIndex(contents[0].data.locations, { slug: slug }),
    pageIndex = contents[0].data.pages
      ? findIndex(contents[0].data.pages, { type: type, slug: slug })
      : -1
  let specConfig = {} as SpecificConfigParams,
    pageData = {} as Value,
    specLocStatus = false

  if (type === "location") {
    if (specSlugIndex === -1) {
      console.log("Can't find matched slug for specific location: ", slug)
      return {
        redirect: {
          destination: contents[0].data.general.routes.locationsPage,
          permanent: false,
        },
      }
    } else {
      const locID = contents[0].data.locations[specSlugIndex].id
      specConfig = await apiClient.get<SpecificConfigParams>(
        `${Config.STORE_SERVICE_API_URL}dc/store/${storeData.settings.store_id}/location/${locID}/config`
      )
      specLocStatus = true
    }
  } else {
    if (pageIndex === -1) {
      console.log("Can't find matched type and slug for general page: ", type, slug)
      return {
        redirect: {
          destination: contents[0].data.general.routes.homePage,
          permanent: false,
        },
      }
    } else {
      pageData = await apiClient.get<Value>(
        `${Config.STORE_SERVICE_API_URL}dc/store/${storeData.settings.store_id}/template/${type}/asset?file_name=${slug}.json`
      )
    }
  }

  const data = {
    specConfig: specConfig,
    pageData: pageData,
    specLocStatus: specLocStatus,
  }
  return {
    props: {
      data,
    },
  }
}

export default observer(Slug)
