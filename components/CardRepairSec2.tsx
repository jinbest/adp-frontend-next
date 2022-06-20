import React from "react"
import { GetDeviceUs, SelectRepair, ReceiveDevice } from "../views/repair/Sec2-SVG"
import { storesDetails } from "../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"

type Props = {
  subtitle: string
  content?: string
  type?: string
  children?: any
  img?: string
}

const CardRepairSec2 = ({ subtitle, content, type, img, children }: Props) => {
  const classes = useStyles()

  const data = storesDetails.storeCnts
  const sec2SvgCol = data.general.colorPalle.sec2SvgCol

  return (
    <div className={`${classes.container} repair-card`}>
      <div className={`${classes.imgContainer} repair-card-img`}>
        {type === "SelectRepair" && <SelectRepair color={sec2SvgCol} />}
        {type === "GetDeviceUs" && <GetDeviceUs color={sec2SvgCol} />}
        {type === "ReceiveDevice" && <ReceiveDevice color={sec2SvgCol} />}
        {type === "onlineQuiz" && <img src={img} />}
        {type === "shipPhone" && <img src={img} />}
        {type === "verifyPhone" && <img src={img} />}
      </div>
      <div className={`${classes.contentContainer} repair-content`}>
        <p className={`${classes.subTitle} repair-subtitle`}>{subtitle}</p>
        <p className={`${classes.content} repair-content`}>{children ? children : content}</p>
      </div>
    </div>
  )
}

CardRepairSec2.defaultProps = {
  subtitle: "Select a repair category",
  content: "Make an account with us and indicate what needs to be repaired.",
  img: "",
}

export default CardRepairSec2

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: "flex",
      ["@media (max-width:960px)"]: {
        textAlign: "left",
      },
    },
    imgContainer: {
      width: "150px",
      ["@media (max-width:960px)"]: {
        width: "13vw",
        minWidth: "80px",
        maxWidth: "100px",
      },
    },
    contentContainer: {
      ["@media (max-width:960px)"]: {
        width: "calc(100% - 13vw)",
      },
    },
    subTitle: {
      fontWeight: 700,
      fontSize: "25px",
      marginBottom: "10px",
      ["@media (max-width:1200px)"]: {
        fontSize: "20px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "3vw",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3.5vw",
      },
    },
    content: {
      fontSize: "20px",
      ["@media (max-width:1200px)"]: {
        fontSize: "18px",
      },
      ["@media (max-width:960px)"]: {
        fontSize: "2vw",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "2.5vw",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.2vw",
      },
    },
  })
)
