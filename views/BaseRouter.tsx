import React from "react"
import { Route } from "react-router-dom"
import { storesDetails } from "../store/"
import Home from "./home/Home"
import Business from "./business/Business"
import Locations from "./locations/Locations"
import Contact from "./contact/Contact"
import Covid from "./covid/Covid"
import Repair from "./repair/Repair"
import RepairWidget from "./repair/RepairWidget"
import PrivacyPolicy from "./privacy-policy/PrivacyPolicy"
import SpecificLocation from "./specific-location/SpecificLocation"
import { FeaturesParam } from "../model/feature-toggle"

type Props = {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

export default function BaseRouter({ features, handleStatus }: Props) {
  const data = storesDetails.storeCnts
  const routes = data.general.routes

  return (
    <>
      <Route
        path="/"
        exact
        component={() => <Home handleStatus={handleStatus} features={features} />}
      />
      <Route
        path={routes.repairPage}
        component={() => <Repair handleStatus={handleStatus} features={features} />}
      />
      <Route
        path={routes.contactPage}
        component={() => <Contact handleStatus={handleStatus} features={features} />}
      />
      <Route
        path={routes.repairWidgetPage}
        component={() => <RepairWidget handleStatus={handleStatus} features={features} />}
      />
      <Route
        path={routes.businessPage}
        component={() => <Business handleStatus={handleStatus} />}
      />
      <Route
        path={routes.locationsPage}
        component={() => <Locations handleStatus={handleStatus} />}
      />
      <Route path={routes.covidPage} component={() => <Covid handleStatus={handleStatus} />} />
      {data.homepage.footer.bottomLinks.privacyPolicy.externalLink && (
        <Route
          path={routes.privacyPolicy}
          component={() => <PrivacyPolicy handleStatus={handleStatus} />}
        />
      )}
      {storesDetails.storeCnts.locations.map((item: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {item.slug && (
              <Route
                path={`/location/${item.slug}`}
                component={() => (
                  <SpecificLocation
                    handleStatus={handleStatus}
                    storeID={storesDetails.store_id}
                    locID={item.id}
                  />
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}
