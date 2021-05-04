import React, { useState, useEffect } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { CommingSoon } from "../../model/specific-config-param"
import { observer } from "mobx-react"
import dynamic from "next/dynamic"
import { storesDetails } from "../../store"
import { findIndex, isEmpty } from "lodash"
import { StoreLocation } from "../../model/store-location"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"
import { GetManyResponse } from "../../model/get-many-response"

const DynamicCustomMap = dynamic(() => import("../../components/CustomMap"), { ssr: false })

type Props = {
  config: CommingSoon
  locID: number
}

const SpecCommingSoon = ({ config, locID }: Props) => {
  const classes = useStyles()
  const apiClient = ApiClient.getInstance()
  const [t] = useTranslation()

  const [location, setLocation] = useState<StoreLocation>({} as StoreLocation)

  useEffect(() => {
    const locIndex = findIndex(storesDetails.allLocations, { id: locID })
    if (locIndex > -1) {
      setLocation(storesDetails.allLocations[locIndex])
    } else {
      loadSpecLocation(locID)
    }
  }, [locID])

  const loadSpecLocation = async (id: number) => {
    const url = `${Config.STORE_SERVICE_API_URL}dc/store/${storesDetails.storesDetails.settings.store_id}/locations/ids[]=${id}`
    const response = await apiClient.get<GetManyResponse>(url)

    setLocation(response.data[0])
    return () => {
      setLocation({} as StoreLocation)
    }
  }

  return (
    <div className={classes.container}>
      <h1 className={`section-title ${classes.title}`}>{t(config.title)}</h1>
      <Typography className={classes.content}>{t(config.subtitle)}</Typography>
      <div className={classes.mapDetails}>
        {!isEmpty(location) && <DynamicCustomMap selectedLocation={location} isDetail={true} />}
      </div>
    </div>
  )
}

export default observer(SpecCommingSoon)

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      maxWidth: "1440px",
      padding: "220px 30px 50px !important",
      margin: "auto",
      display: "block",
      textAlign: "center",
      ["@media (max-width:1200px)"]: {
        paddingTop: "200px !important",
      },
      ["@media (max-width:768px)"]: {
        paddingTop: "150px !important",
      },
      ["@media (max-width:425px)"]: {
        padding: "180px 30px 50px !important",
      },
    },
    title: {
      textAlign: "center",
      ["@media (max-width:768px)"]: {
        textAlign: "center",
      },
    },
    content: {
      color: "black",
      fontSize: "30px !important",
      marginBottom: "30px !important",
      justifyContent: "center",
      margin: "auto",
      textAlign: "center",
      maxWidth: "500px",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw !important",
        width: "100%",
      },
    },
    mapDetails: {
      width: "100%",
      maxWidth: "700px !important",
      height: "100%",
      boxShadow: "-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.4)",
      borderRadius: "10px",
      margin: "auto",
      "& > div": {
        padding: "20px",
      },
      "& div": {
        maxHeight: "500px !important",
      },
      ["@media (max-width:500px)"]: {
        "& > div": {
          padding: "10px",
        },
      },
    },
  })
)
