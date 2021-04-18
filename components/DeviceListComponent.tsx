import React from "react"

type Props = {
  img: string
  title: string
  content: string
  children?: any
  contentVisible?: boolean
}

const DeviceListComponent = ({ img, content, children, contentVisible }: Props) => {
  return (
    <div className={"device-list-component"}>
      <img src={img} width="1" height="auto" alt="device-list-img" />
      <p className={"title"} style={{ fontWeight: "bold" }}>
        {children}
      </p>
      {contentVisible && <p className={"content"}>{content}</p>}
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
