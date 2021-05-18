import React from "react"
import { Route } from "react-router-dom"
import { FeaturesParam } from "../model/feature-toggle"
import { SpecificConfigParams } from "../model/specific-config-param"
import { Value } from "@react-page/editor"

type AppRouteProps = {
  Component: any
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
  path: string
  slug?: string
  type?: string
  locID?: number
  specConfig?: SpecificConfigParams
  pageData?: Value
}

const AppRoute = (props: AppRouteProps) => {
  const { Component, features, handleStatus, path, slug, type, locID, specConfig, pageData } = props
  return (
    <Route
      path={path}
      exact={path === "/"}
      component={() => (
        <Component
          handleStatus={handleStatus}
          features={features}
          slug={slug}
          type={type}
          locID={locID}
          specConfig={specConfig}
          pageData={pageData}
        />
      )}
    />
  )
}

export default AppRoute
