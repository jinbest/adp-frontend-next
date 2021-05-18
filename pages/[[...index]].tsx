import React from "react"
import { Switch } from "react-router-dom"
import { storesDetails } from "../store/"
import { FeaturesParam } from "../model/feature-toggle"
import { observer } from "mobx-react"
import AppRoute from "../routes/route"
import { pageRoutes } from "../routes/index"

type Props = {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

const DynamicPages = ({ features, handleStatus }: Props) => {
  const data = storesDetails.storeCnts

  return (
    <Switch>
      {pageRoutes(data, false).map((item: any, index: number) => {
        return (
          <AppRoute
            Component={item.component}
            path={item.path}
            features={features}
            handleStatus={handleStatus}
            key={index}
          />
        )
      })}
    </Switch>
  )
}

export default observer(DynamicPages)
