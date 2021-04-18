import React from "react"

type Props = {
  title: string
  content: string
  themeCol?: string
}

const ContentFix = ({ title, content, themeCol }: Props) => {
  return (
    <div className={"content-fix"}>
      <p className={"title"}>{title}</p>
      <hr className={"horzon-line"} style={{ borderColor: themeCol }} />
      <p className={"content"}>{content}</p>
    </div>
  )
}

ContentFix.defaultProps = {
  title: "FREE DIAGNOSTICS",
  content:
    "We believe in a transparent repqir process. If you're not sure what's wrong with your device, we'll diagnose it for free.",
}

export default ContentFix
