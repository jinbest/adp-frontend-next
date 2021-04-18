import React from "react"
import Button from "./Button"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { isExternal } from "../services/helper"

type Props = {
  title: string
  img: string
  btnTitle: string
  color?: string
  heart?: string
  heartCol?: string
  href: string
}

const CardMobile = ({ title, img, btnTitle, color, heart, heartCol, href }: Props) => {
  const [t] = useTranslation()

  return (
    <div className={"card-mobile"}>
      <p style={{ color: color }}>{title.toLocaleUpperCase()}</p>
      {heart && (
        <div className={"card-mobile-heart"} style={{ background: heartCol }}>
          <img src={heart} alt="heart" width="1" height="auto" />
        </div>
      )}
      <img src={img} alt="card-mobile-img" width="1" height="auto" />
      {isExternal(href) ? (
        <a href={href} style={{ textDecoration: "none" }} target="_blank" rel="noreferrer">
          <Button
            title={t(btnTitle)}
            bgcolor={color}
            borderR="10px"
            margin="auto"
            fontSize="16px"
          />
        </a>
      ) : (
        <Link to={href} style={{ textDecoration: "none" }}>
          <Button
            title={t(btnTitle)}
            bgcolor={color}
            borderR="10px"
            margin="auto"
            fontSize="16px"
          />
        </Link>
      )}
    </div>
  )
}

CardMobile.defaultProps = {
  title: "Trade",
  img: "",
  btnTitle: "Trade my Device",
  heart: "",
}

export default CardMobile
