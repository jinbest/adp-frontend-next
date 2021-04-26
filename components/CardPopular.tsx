import React from "react"
import Image from "next/image"

type Props = {
  img: string
  title: string
  subtitle: string
  price: string
  priceCol?: string
}

const CardPopular = ({ title, img, price, subtitle, priceCol }: Props) => {
  return (
    <div className="card-popular">
      <Image
        src={img}
        width="100"
        height="100"
        alt={`${title}-card-popular-img`}
        layout="responsive"
      />
      <p className="title">{title}</p>
      <div className="price-div">
        <p className="subtitle">{subtitle + " /"}</p>
        <p className="price" style={{ color: priceCol }}>
          {price}
        </p>
      </div>
    </div>
  )
}

CardPopular.defaultProps = {
  title: "iPhone 11 Pro",
  img: "",
  subtitle: "As low as",
  price: "$897",
}

export default CardPopular
