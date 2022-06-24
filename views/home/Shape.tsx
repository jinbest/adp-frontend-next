import React from "react"
import { storesDetails } from "../../store"

const Shape = () => {
  const data = storesDetails.storeCnts
  if (!data.homepage.section1.bannerImg) return null
  return (
    <div style={{margin: "auto"}}>
      <div className="corner-shape">
        <img
          src={data.homepage.section1.bannerImg}
          alt="Home Page Banner"
          width="1"
          height="auto"
        />
      </div>
    </div>
  )
}

export default Shape
