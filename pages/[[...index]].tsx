import React from "react"
import { Switch } from "react-router-dom"
import { storesDetails } from "../store/"
import { FeaturesParam } from "../model/feature-toggle"
import { observer } from "mobx-react"
import AppRoute from "../routes/route"
import { pageRoutes } from "../routes/index"
import { isEmpty } from "lodash"

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
            slug={
              !isEmpty(item.special) && item.special.type === "General Page"
                ? item.special.data.slug
                : ""
            }
            type={
              !isEmpty(item.special) && item.special.type === "General Page"
                ? item.special.data.type
                : ""
            }
            key={index}
          />
        )
      })}
    </Switch>
  )
}

export default observer(DynamicPages)
