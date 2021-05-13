import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
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
import SpecificLocation from "../views/specific-location/SpecificLocation"
import { useRouter } from "next/router"
import { findIndex } from "lodash"

type Props = {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

export default function DynamicPages({ features, handleStatus }: Props) {
  const data = storesDetails.storeCnts
  const routes = data.general.routes
  const router = useRouter()

  let isRoute = false,
    isSpecLoc = false,
    isRightSlug = false
  const routeKeys = Object.keys(routes),
    specLocs = data.locations
  if (router.asPath.split("/").length === 3 && router.asPath.split("/")[1] === "location") {
    isRoute = true
    isSpecLoc = true
    const slug = router.asPath.split("/")[2]
    if (findIndex(specLocs, { slug: slug }) > -1) {
      isRightSlug = true
    }
  } else if (router.asPath.split("/").length === 2) {
    for (let i = 0; i < routeKeys.length; i++) {
      if (routes[routeKeys[i]] === router.asPath) {
        isRoute = true
        break
      }
    }
  } else {
    isRoute = false
    isSpecLoc = false
    isRightSlug = false
  }

  return (
    <Switch>
      <Route
        path="/"
        exact
        component={() => <Home handleStatus={handleStatus} features={features} />}
      />
      {!isRoute && <Redirect to="/" />}
      <Route
        path={routes.locationsPage}
        component={() => <Locations handleStatus={handleStatus} />}
      />
      {isRoute && isSpecLoc && !isRightSlug && <Redirect to={routes.locationsPage} />}
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
                component={() => <SpecificLocation handleStatus={handleStatus} locID={item.id} />}
              />
            )}
          </React.Fragment>
        )
      })}
    </Switch>
  )
}
