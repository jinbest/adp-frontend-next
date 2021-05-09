import React from "react"
import { Box, InputBase } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

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
        <button className={classes.button} style={{ background: buttonCol, height: height }}>
          {t("Find stores")}
        </button>
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
    },
    searchInput: {
      width: "100%",
      marginLeft: "5px",
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
    },
  })
)
