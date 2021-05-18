import React from "react"
import { Switch } from "react-router-dom"
import { storesDetails } from "../../store/"
import { FeaturesParam } from "../../model/feature-toggle"
import { observer } from "mobx-react"
import AppRoute from "../../routes/route"
import { pageRoutes } from "../../routes/index"
import { isEmpty } from "lodash"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

interface SlugPageProps extends InferGetServerSidePropsType<typeof getServerSideProps> {
  features: FeaturesParam[]
  handleStatus: (status: boolean) => void
}

const Slug = ({ features, handleStatus, data }: SlugPageProps) => {
  const { slug } = data

  console.log("slug", slug)

  return (
    <Switch>
      {pageRoutes(storesDetails.storeCnts, true).map((item: any, index: number) => {
        return (
          <AppRoute
            Component={item.component}
            path={item.path}
            features={features}
            handleStatus={handleStatus}
            locID={
              !isEmpty(item.special) && item.special.type === "Special Location"
                ? item.special.data.locID
                : null
            }
            key={index}
          />
        )
      })}
    </Switch>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug

  const data = {
    slug: slug,
  }
  return {
    props: {
      data,
    },
  }
}

export default observer(Slug)
