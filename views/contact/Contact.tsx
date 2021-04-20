import React, { useEffect, useState } from "react"
import SectionMap from "./Section-map"
import ContactForm from "./ContactForm"
import Head from "next/head"
import { observer } from "mobx-react"
import { useQuery } from "../../services/helper"
import { storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"

type Props = {
  handleStatus: (status: boolean) => void
  features: any[]
}

const Contact = ({ handleStatus, features }: Props) => {
  const mainData = storesDetails.storeCnts
  const thisPage = mainData.contactPage
  const query = useQuery()

  const [locations, setLocations] = useState<any[]>([])
  const [locationID, setLocationID] = useState(0)

  const [pageTitle, setPageTitle] = useState("Contact Us | ")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    setLocations(storesDetails.allLocations)
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
    if (Number(query.get("location_id"))) {
      setLocationID(Number(query.get("location_id")))
    } else if (storesDetails.allLocations.length) {
      for (let i = 0; i < storesDetails.allLocations.length; i++) {
        if (storesDetails.allLocations[i].is_main) {
          setLocationID(storesDetails.allLocations[i].id)
          break
        }
      }
    }
  }, [])

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
      {locations.length && locationID && (
        <SectionMap
          locations={locations}
          handleStatus={handleStatus}
          location_id={locationID}
          handleLocationID={setLocationID}
          features={features}
        />
      )}
      {locations.length && locationID && (
        <ContactForm
          locations={locations}
          locationID={locationID}
          handleLocationID={setLocationID}
        />
      )}
    </div>
  )
}
export default observer(Contact)
