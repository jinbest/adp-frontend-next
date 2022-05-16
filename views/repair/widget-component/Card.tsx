import React from "react"

type Props = {
  children?: any
  className?: string
  height?: string
  backgroundImage?: string
}

const Card = ({ children, className, height, backgroundImage }: Props) => {
  console.log(backgroundImage, "-----<")
  return (
    <div className={`service-widget-card ${className}`} style={{ height: height, backgroundImage }}>
      {children}
    </div>
  )
}

export default Card
