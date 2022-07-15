import React from "react"
import Button from "./Button"
import { storesDetails } from "../store"
import { Link } from "react-router-dom"
import { isExternal } from "../services/helper"

type ServiceCardType = {
  icon?: string
  title?: string
  btnTitle?: string
  link?: string
}

type WrapperType = {
  link?: string
  children?: React.ReactNode
}

const Wrapper: React.FC<WrapperType> = ({ link, children }) => {
  if (!link) return <React.Fragment>{children}</React.Fragment>
  else {
    if (isExternal(link)) {
      return (
        <a href={link} target="_blank" rel="noreferrer" style={{textDecoration: "none"}}>
          {children}
        </a>
      )
    } else {
      return (
        <Link to={link} style={{textDecoration: "none"}}>{children}</Link>
      )
    }
  }
}

const ServiceCard: React.FC<ServiceCardType> = (props) => {
  const { icon, title, btnTitle, link } = props
  const data = storesDetails.storeCnts
  const themeType = data.general.themeType

  return (
    <Wrapper link={link}>
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
              bgcolor={data.general.colorPalle.cardBtnColor}
            />
          }
        </div>
      </div>
    </Wrapper>
  )
}
export default ServiceCard
