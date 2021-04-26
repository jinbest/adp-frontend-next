import React from "react"
import Image from "next/image"

type Props = {
  img: string
  title: string
  content: string
  children?: any
  contentVisible?: boolean
}

const DeviceListComponent = ({ img, content, children, contentVisible }: Props) => {
  return (
    <div className="device-list-component">
      <Image src={img} width="100" height="100" alt="device-list-img" layout="responsive" />
      <p className="title" style={{ fontWeight: "bold" }}>
        {children}
      </p>
      {contentVisible && <p className="content">{content}</p>}
    </div>
  )
}

DeviceListComponent.defaultProps = {
  img: "",
  title: "Competitive Pricing",
  content:
    "We’re proud to offer the largest selection of fully tested and graded pre-owned devices in Winnipeg. All backed by a one year warranty and lifetime IMEI guarantee",
}

export default DeviceListComponent
