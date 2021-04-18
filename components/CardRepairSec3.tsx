import React from "react"

type Props = {
  img: string
  subtitle: string
  content: string
}

const CardRepairSec3 = ({ subtitle, img, content }: Props) => {
  return (
    <div className={"card-repair-sec3-container"}>
      <p className={"subtitle"}>{subtitle}</p>
      <img src={img} width="1" height="auto" alt={`repair-sec3-${subtitle}-img`} />
      <p className={"content"}>{content}</p>
    </div>
  )
}

CardRepairSec3.defaultProps = {
  subtitle: "NEW",
  content: "A brand new device with no signs of wear",
  img: "",
}

export default CardRepairSec3
