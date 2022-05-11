import React from "react"

type Props = {
  img: string
  title: string
}

const CardFix = ({ title, img }: Props) => {
  return (
    <div className="card-fix">
      <img src={img} alt={`${title}-img`} width="1" height="auto" />
      <div className="card-fix-title">{title}</div>
    </div>
  )
}

CardFix.defaultProps = {
  title: "Cellphone",
  img: "",
}

export default CardFix
