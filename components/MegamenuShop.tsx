import React, { useState } from "react"
import { withStyles, createStyles, makeStyles } from "@material-ui/core/styles"
import Menu, { MenuProps } from "@material-ui/core/Menu"
import { useTranslation } from "react-i18next"
import { storesDetails } from "../store"

type Props = {
  text: string
  disableMenu: boolean
}

const MegamenuShop = ({ text, disableMenu }: Props) => {
  const data = storesDetails.storeCnts
  const megaShopData = data.homepage.header.megaMenu
  const textThemeCol = data.general.colorPalle.textThemeCol
  const [anchEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [t] = useTranslation()
  const classes = useStyles()

  const [shopSelect, setShopSelect] = useState(0)
  const [otherListSel, setOtherListSel] = useState(0)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disableMenu) return
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <div
        title={text}
        // aria-controls="megamenu-shop"
        aria-owns={anchEl ? "megamenu-shop" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        // onMouseOver={handleClick}
        className={"nav-link"}
        style={{ cursor: "pointer" }}
      >
        {t(text)}
      </div>
      <StyledMenu
        id="megamenu-shop"
        anchorEl={anchEl}
        keepMounted
        open={Boolean(anchEl)}
        onClose={handleClose}
        // MenuListProps={{ onMouseLeave: handleClose }}
      >
        <div className="triangle"></div>
        <div className={"menu-content-div"} style={{ height: "100%" }}>
          <div className={"left-content " + classes.megaMenuContainer}>
            <div className={"content-block"}>
              {megaShopData.mainList.map((item: any, index: number) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                    onClick={() => setShopSelect(index)}
                    key={index}
                  >
                    <p
                      className={"block-content"}
                      style={{
                        color: shopSelect === index ? textThemeCol : "",
                      }}
                    >
                      {item.type}
                    </p>
                    {shopSelect === index && (
                      <div style={{ padding: "5px 0" }}>
                        <svg
                          width="10"
                          height="13"
                          viewBox="0 0 7 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.57008 9.75947C1.39859 9.75979 1.2324 9.70318 1.10035 9.59947C1.02603 9.54107 0.9646 9.46935 0.919571 9.38841C0.874542 9.30747 0.846802 9.21891 0.837939 9.1278C0.829076 9.03668 0.839264 8.94481 0.867921 8.85743C0.896577 8.77005 0.943138 8.68889 1.00494 8.6186L4.29302 4.8899L1.12237 1.15425C1.0614 1.0831 1.01588 1.00122 0.988403 0.913332C0.96093 0.825443 0.952054 0.733275 0.962285 0.642125C0.972515 0.550975 1.00165 0.46264 1.04802 0.382197C1.09438 0.301754 1.15707 0.23079 1.23246 0.173383C1.3084 0.110053 1.39733 0.0622841 1.49367 0.0330743C1.59001 0.00386453 1.69168 -0.00615543 1.7923 0.00364275C1.89292 0.0134409 1.99031 0.042846 2.07837 0.0900125C2.16643 0.137179 2.24326 0.201088 2.30402 0.27773L5.84898 4.45164C5.95693 4.57612 6.01595 4.73225 6.01595 4.89338C6.01595 5.05451 5.95693 5.21065 5.84898 5.33512L2.17925 9.50903C2.10562 9.59322 2.01209 9.65977 1.90625 9.70328C1.80041 9.74679 1.68524 9.76604 1.57008 9.75947Z"
                            fill={textThemeCol}
                            fillOpacity="0.8"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className={"content-block"}>
              {megaShopData.otherList.map((item: any, index: number) => {
                return (
                  <p
                    className={"block-content"}
                    key={index}
                    style={{
                      color: otherListSel === index ? textThemeCol : "",
                    }}
                    onClick={() => setOtherListSel(index)}
                  >
                    {t(item)}
                  </p>
                )
              })}
            </div>
          </div>
          <div
            style={{
              borderLeft: "2px solid rgba(0,0,0,0.25)",
              margin: "30px 10px",
            }}
          ></div>
          <div className={"left-content"}>
            <div className={"content-block"}>
              {megaShopData.mainList[shopSelect].list.map((item: any, index: number) => {
                return (
                  index < Math.round(megaShopData.mainList[shopSelect].list.length / 2) && (
                    <p className={"block-content"} key={index}>
                      {item}
                    </p>
                  )
                )
              })}
            </div>
          </div>
          <div className={"left-content"}>
            <div className={"content-block"}>
              {megaShopData.mainList[shopSelect].list.map((item: any, index: number) => {
                return (
                  index >= Math.round(megaShopData.mainList[shopSelect].list.length / 2) && (
                    <p className={"block-content"} key={index}>
                      {item}
                    </p>
                  )
                )
              })}
            </div>
          </div>
        </div>
      </StyledMenu>
    </div>
  )
}

export default MegamenuShop

const StyledMenu = withStyles({
  paper: {
    borderRadius: "10px",
    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    overflow: "inherit",
    marginTop: "15px",
    width: "700px",
    paddingBottom: "15px",
    border: "1px solid #C4C4C4",
    height: "480px",
    zIndex: -1,
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))

const useStyles = makeStyles(() =>
  createStyles({
    megaMenuContainer: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      width: "180px !important",
    },
  })
)
