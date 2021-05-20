import React from "react"
import { Box, InputBase } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import Loading from "../components/Loading"

type Props = {
  color?: string
  bgcolor?: string
  border?: string
  height?: string
  placeholder: string
  value?: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleButtonClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  buttonCol?: string
  isSubmit?: boolean
}

const FindStoreSearch = ({
  color,
  bgcolor,
  border,
  height,
  placeholder,
  value,
  handleChange,
  handleButtonClick,
  buttonCol,
  isSubmit,
}: Props) => {
  const tPlaceholder = placeholder || "Find your device"
  const classes = useStyles()
  const [t] = useTranslation()

  return (
    <Box
      className={classes.container}
      style={{ background: bgcolor, border: `1px solid ${border}`, height: height }}
    >
      <InputBase
        className={classes.searchInput}
        style={{ color: color }}
        placeholder={tPlaceholder}
        value={value ?? ""}
        onChange={handleChange}
      />
      <div onClick={handleButtonClick} className={classes.searchButtonDiv}>
        <div className={classes.button} style={{ background: buttonCol, height: height }}>
          {isSubmit ? <Loading /> : t("Find stores")}
        </div>
      </div>
    </Box>
  )
}

export default FindStoreSearch

const useStyles = makeStyles(() =>
  createStyles({
    searchButtonDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        opacity: 0.8,
      },
    },
    container: {
      borderRadius: "80px",
      position: "relative",
      height: "40px",
      paddingLeft: "20px",
      width: "100%",
      alignItems: "center",
      textAlign: "center",
      display: "flex",
      justifyContent: "space-between",
      "&:hover": {
        boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
      },
      maxWidth: "850px",
      ["@media (max-width:960px)"]: {
        width: "calc(100% - 24px)",
      },
    },
    searchInput: {
      width: "100%",
      marginLeft: "5px",
      ["@media (max-width:425px)"]: {
        fontSize: "13px",
      },
    },
    button: {
      borderRadius: "0 80px 80px 0",
      outline: "none",
      border: "none",
      color: "white",
      height: "40px",
      width: "150px",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ["@media (max-width:425px)"]: {
        width: "fit-content",
        fontSize: "13px",
        whiteSpace: "nowrap",
        padding: "0 10px",
      },
    },
  })
)
