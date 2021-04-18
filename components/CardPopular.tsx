import React from "react"

type Props = {
  img: string
  title: string
  subtitle: string
  price: string
  priceCol?: string
}

const CardPopular = ({ title, img, price, subtitle, priceCol }: Props) => {
  return (
    <div className={"card-popular"}>
      <img src={img} width="1" height="auto" alt={`${title}-card-popular-img`} />
      <p className={"title"}>{title}</p>
      <div className={"price-div"}>
        <p className={"subtitle"}>{subtitle + " /"}</p>
        <p className={"price"} style={{ color: priceCol }}>
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
