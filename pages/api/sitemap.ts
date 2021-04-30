import { SitemapStream, streamToPromise } from "sitemap"
import { IncomingMessage, ServerResponse } from "http"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"
import { Store } from "../../model/store"
import { isEmpty } from "lodash"

export default async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "text/xml")

  try {
    const domainMatch = req.headers.host?.match(/[a-zA-Z0-9-]*\.[a-zA-Z0-9-]*$/g)
    const host = domainMatch ? domainMatch[0] : "dccmtx.com"

    const apiClient = ApiClient.getInstance()

    const store = await apiClient.get<Store>(
      `${Config.STORE_SERVICE_API_URL}dc/store/domain/${host}?include_children=false`
    )

    const storeConfig = await apiClient.get<Record<string, any>>(
      `${Config.STORE_SERVICE_API_URL}dc/store/${store.id}/config`
    )

    let storeSitemap = storeConfig.sitemap.custom

    if (isEmpty(storeSitemap)) {
      storeSitemap = await getDynamicSiteMap(host, storeConfig)
    }

    res.write(storeSitemap)
  } catch (error) {
    console.log(error)
    res.statusCode = 500
  } finally {
    res.end()
  }
}

//TODO: update this to get the slug and lastmodified date from the config
const getDynamicSiteMap = async (
  host: string,
  storeConfig: Record<string, any>
): Promise<string> => {
  const routes = storeConfig.general.routes
  const locations = storeConfig.locations

  const hostname = `https://${host}`
  const smStream = new SitemapStream({ hostname })

  smStream.write({
    url: `${hostname}/`,
  })

  smStream.write({
    url: routes.repairPage,
  })

  smStream.write({
    url: routes.contactPage,
  })

  smStream.write({
    url: routes.businessPage,
  })

  smStream.write({
    url: routes.locationsPage,
  })

  smStream.write({
    url: routes.covidPage,
  })

  if (!isEmpty(locations)) {
    locations.forEach((location: Record<string, any>) => {
      if (!isEmpty(location.slug)) {
        smStream.write({
          url: `location/${location.slug}`,
        })
      }
    })
  }

  smStream.end()
  const sitemap = await streamToPromise(smStream)

  return sitemap.toString()
}
