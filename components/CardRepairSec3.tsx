import React from "react"
import Image from "next/image"

type Props = {
  img: string
  subtitle: string
  content: string
}

const CardRepairSec3 = ({ subtitle, img, content }: Props) => {
  return (
    <div className="card-repair-sec3-container">
      <p className="subtitle">{subtitle}</p>
      <Image
        src={img}
        width="100"
        height="100"
        alt={`repair-sec3-${subtitle}-img`}
        layout="responsive"
      />
      <p className="content">{content}</p>
    </div>
  )
}

CardRepairSec3.defaultProps = {
  subtitle: "NEW",
  content: "A brand new device with no signs of wear",
  img: "",
}

export default CardRepairSec3
