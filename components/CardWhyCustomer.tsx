import React from "react"
import Rating from "@material-ui/lab/Rating"

type Props = {
  score: number
  days: string
  content: string
  reviewer: string
}

const CardWhyCustomer = ({ score, content, reviewer }: Props) => {
  return (
    <div className={"card-why-customer"}>
      <div className={"score-div"}>
        <div className={"rating"}>
          <Rating name="read-only" value={score} max={score} readOnly />
        </div>
        {/* <p>{days}</p> */}
      </div>
      <p className={"content"}>{content}</p>
      <p className={"reviewer"}>{reviewer}</p>
    </div>
  )
}

CardWhyCustomer.defaultProps = {
  score: 5,
  days: "3 days ago",
  content:
    "This was by far the easiest way to sell your old cell phone. Simple fast and got a very good price for my phone.",
  reviewer: "Philip Sizemore",
}

export default CardWhyCustomer
