import React from "react"
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined"
import EllipsisText from "react-ellipsis-text"
import ReactTooltip from "react-tooltip"

type Props = {
  title: string
  bgcolor?: string
  txcolor?: string
  borderR?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  width?: string
  maxWidth?: string
  height?: string
  margin?: string
  fontSize?: string
  icon?: boolean
  disable?: boolean
  border?: string
  textDecorator?: string
  hover?: boolean
  children?: any
}

const Button = ({
  title,
  bgcolor,
  txcolor,
  borderR,
  onClick,
  width,
  maxWidth,
  hover,
  height,
  margin,
  fontSize,
  icon,
  disable,
  border,
  textDecorator,
  children,
}: Props) => {
  return (
    <>
      <button
        data-tip
        data-for={title}
        onClick={onClick}
        className={hover ? "button" : "button no-hover"}
        style={{
          backgroundColor: bgcolor,
          color: txcolor,
          borderRadius: borderR,
          width: width,
          border: border,
          textDecoration: textDecorator,
          height: height,
          margin: margin,
          fontSize: fontSize,
          maxWidth: maxWidth,
          opacity: disable ? 0.5 : 1,
          lineHeight: "10px",
        }}
        disabled={disable}
      >
        {icon && <RoomOutlinedIcon />}
        {title && title.length > 20 ? (
          <EllipsisText text={title} length={20} />
        ) : children ? (
          children
        ) : (
          title
        )}
      </button>
      {title && title.length > 20 && (
        <ReactTooltip id={title} place="top" effect="solid">
          {title}
        </ReactTooltip>
      )}
    </>
  )
}

Button.defaultProps = {
  title: "",
  bgcolor: "#F36B26",
  txcolor: "white",
  borderR: "10px",
  icon: false,
  disable: false,
  hover: true,
}

export default Button
