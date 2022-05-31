/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react"
import Button from "./Button"
import { storesDetails } from "../store"
import { useRouter } from "next/router"

type ServiceCardType = {
  icon?: string
  title?: string
  btnTitle?: string
  link?: string
}

const ServiceCard: React.FC<ServiceCardType> = (props) => {
  const { icon, title, btnTitle, link } = props
  const data = storesDetails.storeCnts
  const themeType = data.general.themeType
  const router = useRouter()
  return (
    <div className="service-card">
      <img src={icon} alt="icon" />
      <div className="service-content">
        <div className="service-title">{title}</div>
        {btnTitle &&
          <Button
            margin="33px auto 0"
            borderR="0"
            fontSize="20px"
            height="48px"
            border="none"
            title={btnTitle}
            fontFamily={themeType === "marnics" ? "Helvetica Neue Bold" : "Poppins Regular"}
            onClick={() => router.push(link!)}
          />
        }
      </div>
    </div>
  )
}
export default ServiceCard
