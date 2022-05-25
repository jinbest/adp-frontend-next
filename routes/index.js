import dynamic from "next/dynamic"
import Business from "../views/business/Business"
import Locations from "../views/locations/Locations"
import Contact from "../views/contact/Contact"
import Covid from "../views/covid/Covid"
import Repair from "../views/repair/Repair"
import RepairWidget from "../views/repair/RepairWidget"
import GeneralPage from "../views/general-page/GeneralPage"
import SpecificLocation from "../views/specific-location/SpecificLocation"
import Trade from "../views/trade/Trade"

import { Redirect } from "react-router-dom"

const Home = dynamic(() => import("../views/home/Home"))

const pageRoutes = (data, specLoc) => {
  const routes = data.general.routes

  const availableRoutes = [
    { path: routes.repairPage, component: Repair, special: {} },
    { path: routes.repairWidgetPage, component: RepairWidget, special: {} },
    { path: routes.contactPage, component: Contact, special: {} },
    { path: routes.businessPage, component: Business, special: {} },
    { path: routes.covidPage, component: Covid, special: {} },
  ]

  if (data.hasOwnProperty("pages") && data.pages.length) {
    data.pages.forEach((item) => {
      availableRoutes.push({
        path: `/${item.type}/${item.slug}`,
        component: GeneralPage,
        special: {
          type: "General Page",
          data: {
            slug: item.slug,
            type: item.type,
          },
        },
      })
    })
  }
  if (routes.tradePage) {
    availableRoutes.push({path: routes.tradePage, component: Trade, special: {}})
  }
  if (specLoc) {
    data.locations.forEach((item) => {
      availableRoutes.push({
        path: `/location/${item.slug}`,
        component: SpecificLocation,
        special: {
          type: "Special Location",
          data: {
            locID: item.id,
          },
        },
      })
    })
  }

  availableRoutes.push({
    path: routes.locationsPage,
    component: Locations,
    special: {},
  })

  availableRoutes.push({
    path: "/:others",
    component: () => <Redirect to="/" />,
    special: {},
  })

  availableRoutes.push({
    path: "/",
    component: Home,
    special: {},
  })

  return availableRoutes
}

export { pageRoutes }
