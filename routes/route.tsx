import React from "react"
import { Route } from "react-router-dom"
import { FeaturesParam } from "../model/feature-toggle"

type AppRouteProps = {
  Component: any
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
  path: string
  slug?: string
  type?: string
  locID?: number
}

const AppRoute = (props: AppRouteProps) => {
  const { Component, features, handleStatus, path, slug, type, locID } = props
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
        />
      )}
    />
  )
}

export default AppRoute
