import React, { useEffect, useState } from "react"
import FormControl from "@material-ui/core/FormControl"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import NativeSelect from "@material-ui/core/NativeSelect"
import i18n from "../i18-next/i18n"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../store"

type Props = {
  color?: string
}

const LangDropdown = ({ color }: Props) => {
  const data = storesDetails.storeCnts
  const themeCol = data.general.colorPalle.themeColor
  const classes = useStyles()
  const [t] = useTranslation()

  const options = ["English", "French"]

  const [state, setState] = useState("English")

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const la = event.target.value
    let cntLang = "en"
    setState(la)
    cntLang = la === "English" ? "en" : "fr"
    i18n.changeLanguage(la === "English" ? "en" : "fr")
    if (typeof window !== "undefined") window.localStorage.setItem("cntLang", cntLang)
  }

  useEffect(() => {
    if (data.general.condition.defaultLang === "fr") {
      setState(options[1])
      i18n.changeLanguage("fr")
      if (typeof window !== "undefined") window.localStorage.setItem("cntLang", "fr")
      return
    }
    const cntLang =
      typeof window !== "undefined" ? window.localStorage.getItem("cntLang") || "en" : "en"
    cntLang === "en" ? setState(options[0]) : setState(options[1])
    i18n.changeLanguage(cntLang)
  }, [])

  return (
    <div>
      <FormControl
        className={
          color === "black" ? `${classes.formControl} ${classes.blackSVG}` : classes.formControl
        }
      >
        <NativeSelect value={state} onChange={handleChange} style={{ color: color }}>
          {options.map((item: any, index: number) => {
            return (
              <option
                value={item}
                className={classes.selectOption}
                style={{ color: themeCol }}
                key={index}
              >
                {t(item).toUpperCase()}
              </option>
            )
          })}
        </NativeSelect>
      </FormControl>
      <select className={classes.mobileSelector} value={state} onChange={handleChange}>
        {options.map((item: any, index: number) => {
          return (
            <option value={item} key={index}>
              {t(item)}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default LangDropdown

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      margin: "0 5px",
      ["@media (max-width:768px)"]: {
        display: "none",
      },
    },
    blackSVG: {
      "& .MuiSvgIcon-root": {
        fill: "black",
      },
    },
    selectOption: {
      color: "black",
      padding: "10px",
      marginLeft: "10px",
      fontSize: "14px",
    },
    mobileSelector: {
      outline: "none",
      border: "none",
      position: "absolute",
      bottom: "70px",
      right: "85px",
      margin: "auto",
      fontSize: "12px",
      display: "none",
      ["@media (max-width:768px)"]: {
        display: "block",
        color: "black",
      },
    },
  })
)
