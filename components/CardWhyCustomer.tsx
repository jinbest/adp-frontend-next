import React from "react"
import Rating from "@material-ui/lab/Rating"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { storesDetails } from "../store"

type Props = {
  score: number
  days: string
  content: string
  reviewer: string
  icon?: string
}

type RatingStyleProps = {
  color: string
}

const CardWhyCustomer = ({ score, content, days, reviewer, icon }: Props) => {
  const data = storesDetails.storeCnts
  const styleProps = { color: data.general.colorPalle.ratingCol } as RatingStyleProps
  const classes = useStyles(styleProps)

  return (
    <div className="card-why-customer">
      <div className="score-div">
        <div className="rating">
          <Rating
            name="read-only"
            value={Math.round(score)}
            max={5}
            className={`${classes.rating} why-card-rating`}
            readOnly
          />
        </div>
        <p>{days}</p>
      </div>
      <div className="review-content">
        <p className="content">{content}</p>
        <div className="space-between">
          <p className="reviewer">{reviewer}</p>
          {
            icon &&
            <div>
              <img src={icon} alt="google" />
            </div>
          }
        </div>
      </div>
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

const useStyles = makeStyles(() =>
  createStyles({
    rating: (props: RatingStyleProps) => ({
      color: `${props.color}`,
    }),
  })
)
