import React from "react"
import { Link } from "react-router-dom"
import { storesDetails } from "../store"
import { createStyles, makeStyles } from "@material-ui/core/styles"

type Props = {
  type?: string
  handleStatus: (status: boolean) => void
}

const Logo = ({ type, handleStatus }: Props) => {
  const classes = useStyles()

  const mainData = storesDetails.storeCnts
  const logoData = mainData.logoData

  const handleLogoClick = () => {
    handleStatus(true)
  }

  return type === "header" ? (
    <Link to="/" onClick={handleLogoClick} className="logo-header">
      <img className="logo-header" src={logoData.logoHeaderImg} alt="header-logo" />
    </Link>
  ) : (
    <Link to="/" onClick={handleLogoClick} className={`${classes.logoFooterContainer} footer-logo-container`}>
      <img className="logo-footer" src={logoData.logoFooterImg} alt="footer-logo" />
    </Link>
  )
}

Logo.defaultProps = {
  type: "header",
}

export default Logo

const useStyles = makeStyles(() =>
  createStyles({
    logoFooterContainer: {
      ["@media (max-width:600px)"]: {
        margin: "auto",
      },
    },
  })
)
