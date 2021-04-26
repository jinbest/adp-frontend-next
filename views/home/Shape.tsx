import React from "react"
import { storesDetails } from "../../store"
import Image from "next/image"

const Shape = () => {
  const data = storesDetails.storeCnts

  return (
    <div>
      <div className="corner-shape">
        <Image
          src={data.homepage.section1.bannerImg}
          alt="Home Page Banner"
          width="2000"
          height="1200"
          layout="responsive"
        />
      </div>
    </div>
  )
}

export default Shape
