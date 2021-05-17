import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { storesDetails } from "../../store/"
import Home from "../../views/home/Home"
import Business from "../../views/business/Business"
import Locations from "../../views/locations/Locations"
import Contact from "../../views/contact/Contact"
import Covid from "../../views/covid/Covid"
import Repair from "../../views/repair/Repair"
import RepairWidget from "../../views/repair/RepairWidget"
import PrivacyPolicy from "../../views/privacy-policy/PrivacyPolicy"
import { FeaturesParam } from "../../model/feature-toggle"
import SpecificLocation from "../../views/specific-location/SpecificLocation"
import { useRouter } from "next/router"
import { findIndex } from "lodash"
import { observer } from "mobx-react"
import GeneralPage from "../../views/general-page/GeneralPage"

type Props = {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

const Slug = ({ features, handleStatus }: Props) => {
  const data = storesDetails.storeCnts
  const routes = data.general.routes
  const router = useRouter()

  let isSpecLoc = false,
    isRightSlug = false
  const specLocs = data.locations
  if (router.asPath.split("/").length === 3 && router.asPath.split("/")[1] === "location") {
    isSpecLoc = true
    const slug = router.asPath.split("/")[2]
    if (findIndex(specLocs, { slug: slug }) > -1) {
      isRightSlug = true
    }
  } else {
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
      <Route
        path={routes.locationsPage}
        component={() => <Locations handleStatus={handleStatus} />}
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
      <Route path={routes.covidPage} component={() => <Covid handleStatus={handleStatus} />} />
      {data.hasOwnProperty("pages") &&
        data.pages.length &&
        data.pages.map((item: any, index: number) => {
          return (
            <Route
              path={`/${item.slug}`}
              key={index}
              component={() => (
                <GeneralPage handleStatus={handleStatus} slug={item.slug} type={item.type} />
              )}
            />
          )
        })}
      {data.homepage.footer.bottomLinks.privacyPolicy.externalLink && (
        <Route
          path={routes.privacyPolicy}
          component={() => <PrivacyPolicy handleStatus={handleStatus} />}
        />
      )}
      {isSpecLoc && !isRightSlug && <Redirect to={routes.locationsPage} />}
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

export default observer(Slug)
