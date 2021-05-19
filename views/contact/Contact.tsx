import React, { useEffect, useState } from "react"
import Head from "next/head"
import { observer } from "mobx-react"
import { useQuery } from "../../services/helper"
import { storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"
import { findIndex, isEmpty } from "lodash"
import dynamic from "next/dynamic"

const DynamicWholeMap = dynamic(() => import("./Whole-map"), { ssr: false })

type Props = {
  handleStatus: (status: boolean) => void
  features: any[]
}

const Contact = ({ handleStatus, features }: Props) => {
  const mainData = storesDetails.storeCnts
  const thisPage = mainData.contactPage
  const query = useQuery()

  const [selectLocation, setSelectLocation] = useState<any>({} as any)
  const [locationID, setLocationID] = useState(0)

  const [pageTitle, setPageTitle] = useState("Contact Us | ")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    handleStatus(false)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
    if (Number(query.get("location_id"))) {
      const locIndex = findIndex(storesDetails.allLocations, {
        id: Number(query.get("location_id")),
      })
      setSelectLocation(locIndex > -1 ? storesDetails.allLocations[locIndex] : ({} as any))
      setLocationID(locIndex > -1 ? storesDetails.allLocations[locIndex].id : -1)
    } else {
      const locMain = findIndex(storesDetails.allLocations, { is_main: true })
      setSelectLocation(locMain > -1 ? storesDetails.allLocations[locMain] : ({} as any))
      setLocationID(locMain > -1 ? storesDetails.allLocations[locMain].id : -1)
    }
  }, [])

  const handleLocationID = (id: number) => {
    setLocationID(id)
    const locIndex = findIndex(storesDetails.allLocations, { id: id })
    if (locIndex > -1) {
      setSelectLocation(storesDetails.allLocations[locIndex])
    }
  }

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
        <link rel="icon" id="favicon" href={mainData.homepage.headData.fav.img} />
        <link rel="apple-touch-icon" href={mainData.homepage.headData.fav.img} />
      </Head>
      {!isEmpty(selectLocation) && (
        <DynamicWholeMap
          selectedLocation={selectLocation}
          features={features}
          handleStatus={handleStatus}
          handleLocationID={handleLocationID}
          location_id={locationID}
        />
      )}
    </div>
  )
}
export default observer(Contact)
