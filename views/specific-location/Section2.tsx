import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { Section2 } from "../../model/specific-config-param"
import _ from "lodash"
import CardFix from "../../components/CardFix"

type Props = {
  config: Section2
}

const SpecSection2 = ({ config }: Props) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const categories = _.sortBy(config.categories, (o) => o.order)

  return (
    <div className="Container">
      <h1 className={`section-title ${classes.title}`}>{t(config.title)}</h1>
      <Typography className={classes.content}>{t(config.content)}</Typography>
      <div className="card-customized-container-desktop">
        {categories.map((item: any, index: number) => {
          return (
            <React.Fragment key={index}>
              {item.isVisible && (
                <div className="card-customized-item">
                  <CardFix title={t(item.title)} img={item.img} key={index} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
      <div className="card-customized-container-mobile">
        {categories.slice(0, 3).map((item: any, index: number) => {
          return (
            <React.Fragment key={index}>
              {item.isVisible && (
                <div className="card-customized-item">
                  <CardFix title={t(item.title)} img={item.img} key={index} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
      <div className="card-customized-container-mobile">
        {categories.slice(3, 5).map((item: any, index: number) => {
          return (
            <React.Fragment key={index}>
              {item.isVisible && (
                <div className="card-customized-item">
                  <CardFix title={t(item.title)} img={item.img} key={index} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default SpecSection2

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      textAlign: "left",
      ["@media (max-width:768px)"]: {
        textAlign: "center",
      },
    },
    content: {
      color: "black",
      fontSize: "30px !important",
      marginBottom: "30px !important",
      justifyContent: "center",
      margin: "auto",
      textAlign: "left",
      ["@media (max-width:1400px)"]: {
        fontSize: "2.5vw !important",
      },
      ["@media (max-width:768px)"]: {
        fontSize: "3vw !important",
        textAlign: "center",
      },
      ["@media (max-width:500px)"]: {
        fontSize: "3.5vw !important",
        width: "100%",
      },
    },
  })
)
