import React from "react"
import { Route } from "react-router-dom"
import { storesDetails } from "../store/"
import Home from "../views/home/Home"
import Business from "../views/business/Business"
import Locations from "../views/locations/Locations"
import Contact from "../views/contact/Contact"
import Covid from "../views/covid/Covid"
import Repair from "../views/repair/Repair"
import RepairWidget from "../views/repair/RepairWidget"
import PrivacyPolicy from "../views/privacy-policy/PrivacyPolicy"
import { FeaturesParam } from "../model/feature-toggle"

type Props = {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

export default function DynamicPages({ features, handleStatus }: Props) {
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
    </>
  )
}
export function getStaticProps() {
  return {
    props: {},
  }
}
export const getStaticPaths = async () => {
  return {
    paths: [{ params: { index: [] } }],
    fallback: true,
  }
}
