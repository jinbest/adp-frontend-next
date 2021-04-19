import React, { useEffect, useState } from "react"
// import { SectionMap, ContactForm } from "."
import SectionMap from "./Section-map"
import ContactForm from "./ContactForm"
import { Helmet } from "react-helmet"
import { inject } from "mobx-react"
import { observer } from "mobx-react-lite"
import { StoresDetails } from "../../store/StoresDetails"
import { useQuery } from "../../services/helper"
import { Provider } from "mobx-react"
import { storesDetails } from "../../store"
import { MetaParams } from "../../model/meta-params"

type Props = {
  storesDetailsStore: StoresDetails
  handleStatus: (status: boolean) => void
  features: any[]
}

const Contact = ({ handleStatus, storesDetailsStore, features }: Props) => {
  const mainData = storesDetailsStore.storeCnts
  const thisPage = mainData.contactPage
  const query = useQuery()

  const [locations, setLocations] = useState<any[]>([])
  const [locationID, setLocationID] = useState(0)

  const [pageTitle, setPageTitle] = useState("Contact Us | ")
  const [metaList, setMetaList] = useState<MetaParams[]>([])

  useEffect(() => {
    setPageTitle(thisPage.headData.title)
    setMetaList(thisPage.headData.metaList)
    handleStatus(true)
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  useEffect(() => {
    setLocations([...storesDetailsStore.allLocations])
  }, [storesDetailsStore.allLocations])

  useEffect(() => {
    if (Number(query.get("location_id"))) {
      setLocationID(Number(query.get("location_id")))
    } else if (storesDetailsStore.allLocations.length) {
      for (let i = 0; i < storesDetailsStore.allLocations.length; i++) {
        if (storesDetailsStore.allLocations[i].is_main) {
          setLocationID(storesDetailsStore.allLocations[i].id)
        }
      }
    }
  }, [])

  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
        {metaList.map((item: MetaParams, index: number) => {
          return <meta name={item.name} content={item.content} key={index} />
        })}
        <link rel="icon" id="favicon" href={mainData.homepage.headData.fav.img} />
        <link rel="apple-touch-icon" href={mainData.homepage.headData.fav.img} />
      </Helmet>
      {locations.length && locationID && (
        <SectionMap
          storesDetailsStore={storesDetailsStore}
          locations={locations}
          handleStatus={handleStatus}
          location_id={locationID}
          handleLocationID={setLocationID}
          features={features}
        />
      )}
      {locations.length && locationID && (
        <Provider storesDetailsStore={storesDetails}>
          <ContactForm
            locations={locations}
            locationID={locationID}
            handleLocationID={setLocationID}
            storesDetailsStore={storesDetailsStore}
          />
        </Provider>
      )}
    </div>
  )
}
export default inject("storesDetailsStore")(observer(Contact))
