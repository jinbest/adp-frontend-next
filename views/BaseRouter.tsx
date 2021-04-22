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
import { FeaturesParam } from "../model/feature-toggle"

type Props = {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
  privacyTemplate: string
}

export default function BaseRouter({ features, handleStatus, privacyTemplate }: Props) {
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
      {privacyTemplate && (
        <Route
          path={routes.privacyPolicy}
          component={() => (
            <PrivacyPolicy handleStatus={handleStatus} privacyTemplate={privacyTemplate} />
          )}
        />
      )}
    </>
  )
}
