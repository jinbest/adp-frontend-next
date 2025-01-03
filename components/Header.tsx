import React, { useState, useEffect, useCallback, useRef } from "react"
import Search from "./Search"
import CustomizedMenus from "./CustomizedMenus"
import Logo from "./Logo"
// import MegamenuShop from "./MegamenuShop"
import HeaderDrawer from "./HeaderDrawer"
import LangDropdown from "./LangDropdown"
import { Link, useHistory, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { storesDetails, repairWidgetStore, repairWidData } from "../store"
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined"
import {
  phoneFormatString,
  isExternal,
  getWidth,
  isOriginSameAsLocation,
  isSlugLink,
  validSearchItemData,
} from "../services/helper"
import _, { isEmpty } from "lodash"
import SearchService from "../services/api/search-service"
import { SearchParams } from "../model/search-params"
import useScrollBlock from "../services/useScrollBlock"
import { featureToggleKeys } from "../const/_variables"

const searchService = SearchService.getInstance()

type PropsNavItemLink = {
  item: any
  handleStatus: (status: boolean) => void
  feats: any[]
}

const NavItemLink = ({ item: { href, text }, handleStatus }: PropsNavItemLink) => {
  const [t] = useTranslation()
  const data = storesDetails.storeCnts

  const handle = () => {
    if (href === data.general.routes.repairWidgetPage) {
      handleStatus(false)
    } else {
      handleStatus(true)
    }
    return
  }

  return (
    <li className="nav-item" style={{ whiteSpace: "nowrap" }}>
      {isExternal(href) ? (
        <>
          {isOriginSameAsLocation(href) ? (
            <a className="nav-link" href={href}>
              {t(text)}
            </a>
          ) : (
            <a className="nav-link" href={href} target="_blank" rel="noreferrer">
              {t(text)}
            </a>
          )}
        </>
      ) : (
        <>
          {isSlugLink(href) ? (
            <a href={href} className="nav-link" onClick={handle}>
              {t(text)}
            </a>
          ) : (
            <Link to={href} className="nav-link" onClick={handle}>
              {t(text)}
            </Link>
          )}
        </>
      )}
    </li>
  )
}

type PropsBrand = {
  item: string
  color: string
  phoneNumber?: number
  href: string
}

const BrandItemLink = ({ item, color, phoneNumber, href }: PropsBrand) => {
  return (
    <li style={{ listStyle: "none" }}>
      {phoneNumber ? (
        <a
          style={{
            color: color,
          }}
          className="brand-nav-item"
          href={`tel:${item}`}
        >
          {phoneFormatString(item, phoneNumber).toLocaleUpperCase()}
        </a>
      ) : (
        <>
          {isExternal(href) ? (
            <>
              {isOriginSameAsLocation(href) ? (
                <a
                  style={{
                    color: color,
                  }}
                  className="brand-nav-item"
                  href={href}
                >
                  {item.toLocaleUpperCase()}
                </a>
              ) : (
                <a
                  style={{
                    color: color,
                  }}
                  className="brand-nav-item"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.toLocaleUpperCase()}
                </a>
              )}
            </>
          ) : (
            <Link
              to={href}
              style={{
                color: color,
              }}
              className="brand-nav-item"
            >
              {item.toLocaleUpperCase()}
            </Link>
          )}
        </>
      )}
    </li>
  )
}

type PropsHeader = {
  handleStatus: (status: boolean) => void
  features: any[]
}

const Header = ({ handleStatus, features }: PropsHeader) => {
  const data = storesDetails.storeCnts
  const thisPage = data.homepage.header
  const themeType = data.general.themeType
  const history = useHistory()
  const location = useLocation()

  const navItemsLink = _.sortBy(thisPage.navItems, (o) => o.order),
    brandItemLink = _.sortBy(thisPage.brandItems, (o) => o.order),
    brandData = thisPage.brandData,
    searchPlaceholder = data.homepage.section1.searchPlaceholder

  const [t] = useTranslation()
  const [blockScroll, allowScroll] = useScrollBlock()

  const [menuStatus, setMenuStatus] = useState(false)
  const [feats, setFeatures] = useState<any[]>([])
  const [mobile, setMobile] = useState(false)
  const [getQuteStatus, setGetQuoteStatus] = useState(false)
  const [searchKey, setSearchKey] = useState("")
  const [searchData, setSearchData] = useState<any[]>([] as any[])
  const [searchEnd, setSearchEnd] = useState(false)
  const [from, setFrom] = useState(0)
  const [total, setTotal] = useState(0)
  const [selectList, setSelectList] = useState(0)
  const [hover, setHover] = useState(false)
  const [viewFilterList, setViewFilterList] = useState(false)
  const [searching, setSearching] = useState(false)

  const customRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const customRefMobile = useRef<HTMLDivElement>({} as HTMLDivElement)
  useOutsideHit()

  function useOutsideHit() {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (
          customRef.current &&
          !customRef.current.contains(event.target) &&
          customRefMobile.current &&
          !customRefMobile.current.contains(event.target)
        ) {
          setViewFilterList(false)
          setSelectList(0)
          setHover(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [customRef, customRefMobile])
  }

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchKey(e.target.value)
  }

  useEffect(() => {
    if (searchData.length && viewFilterList) {
      blockScroll()
    } else {
      allowScroll()
    }
  }, [searchData, viewFilterList])

  useEffect(() => {
    if (searchKey) {
      generalSearch(searchKey)
    }
    initSearchData()
    return () => {
      setSearchData([])
      setTotal(0)
    }
  }, [searchKey])

  useEffect(() => {
    setSearchKey("")
    initSearchData()
  }, [location])

  const initSearchData = () => {
    setSearchData([])
    setTotal(0)
    setFrom(0)
    setSearchEnd(false)
  }

  const handleScroll = async (e: any) => {
    if (searchEnd || total <= searchData.length) {
      return
    }
    const target = e.target
    if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 50 && !searching) {
      setSearching(true)
      const store_id = storesDetails.store_id
      const param: SearchParams = {
        q: `${searchKey} AND store_id:(${store_id})`,
        from: from + 10,
      }
      const val = await searchService.generalSearch(param)
      setSearching(false)
      if (!isEmpty(val) && !isEmpty(val.hits)) {
        const hits = _.reverse(_.sortBy(val.hits.hits, (o) => o._score))
        if (hits.length) {
          const cntSearchData = searchData
          hits.forEach((item: any) => {
            if (validSearchItemData(item)) {
              cntSearchData.push(item)
            }
          })
          setSearchData(_.uniq(cntSearchData))
          setFrom(from + 10)
          if (from + 10 >= total) {
            setSearchEnd(true)
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  })

  const onKeyPress = useCallback(
    (e) => {
      let index = 0,
        item = null,
        itemOffset = 0,
        itemHeight = 0,
        cntHeight = 0,
        scrlTop = 0
      const searchItems = document.getElementsByClassName("search-item")
      const searchContainer = document.getElementsByClassName(
        "search-data-viewer"
      )[0] as HTMLDivElement

      if (e.key === "ArrowDown") {
        index = Math.min(selectList + 1, searchData.length - 1)
        setSelectList(index)
        item = searchItems[index] as HTMLDivElement
        itemOffset = item.offsetTop
        itemHeight = item.clientHeight
        cntHeight = searchContainer.clientHeight
        scrlTop = searchContainer.scrollTop
        if (cntHeight + scrlTop < itemOffset + itemHeight) {
          searchContainer.scrollTo({
            behavior: "smooth",
            top: itemOffset + itemHeight - cntHeight + 10,
          })
        }
      } else if (e.key === "ArrowUp") {
        index = Math.max(selectList - 1, 0)
        setSelectList(index)
        item = searchItems[index] as HTMLDivElement
        itemOffset = item.offsetTop
        scrlTop = searchContainer.scrollTop
        if (itemOffset < scrlTop) {
          searchContainer.scrollTo({ behavior: "smooth", top: itemOffset - 40 })
        }
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (!searchData.length) {
          return
        }
        e.preventDefault()
        handleSearchItem(searchData[selectList])
        setSelectList(0)
        setHover(false)
      }
    },
    [selectList, searchData]
  )

  const generalSearch = async (text: string) => {
    const store_id = storesDetails.store_id
    const param: SearchParams = {
      q: `${text} AND store_id:(${store_id})`,
      from: from,
    }
    const val = await searchService.generalSearch(param)
    if (!isEmpty(val) && !isEmpty(val.hits)) {
      const preHits = _.reverse(_.sortBy(val.hits.hits, (o) => o._score)),
        hits = [] as any[]
      preHits.forEach((item: any) => {
        if (validSearchItemData(item)) {
          hits.push(item)
        }
      })
      setTotal(val.hits.total.value)
      setSearchData(_.uniq(hits))
    }
  }

  const handleSearchItem = (item: any) => {
    repairWidgetStore.init()
    handleStatus(false)
    if (item._source.type === "product") {
      repairWidgetStore.changeDeviceBrand([
        {
          name: item._source.brand.name,
          img: item._source.brand.img_src,
          id: item._source.brand.id,
          alt: item._source.brand.img_alt,
        },
      ])
      repairWidgetStore.changeCntStep(2)
      repairWidgetStore.changeDeviceModel([
        {
          name: item._source.name,
          img: item._source.img_src,
          id: item._source.id,
          alt: item._source.img_alt,
        },
      ])
      repairWidData.changeCntBrandID(item._source.brand_id)
      repairWidData.changeCntProductID(item._source.id)
      repairWidgetStore.changeDeviceCounter(1)
      history.push(data.general.routes.repairWidgetPage)
    } else if (item._source.type === "brand") {
      repairWidgetStore.changeCntStep(1)
      repairWidgetStore.changeDeviceBrand([
        {
          name: item._source.img_alt,
          img: item._source.img_src,
          id: item._source.id,
          alt: item._source.name,
        },
      ])
      repairWidData.changeCntBrandID(item._source.id)
      repairWidgetStore.changeDeviceCounter(1)
      history.push(data.general.routes.repairWidgetPage)
    } else if (
      item._source.type === "service" &&
      item._source.product &&
      !isEmpty(item._source.product)
    ) {
      repairWidgetStore.changeRepairBySearch({
        cost: item._source.cost,
        estimate: item._source.duration,
        id: item._source.id,
        name: item._source.title,
        warranty: item._source.warranty,
        warranty_unit: item._source.warranty_unit,
      })
      repairWidgetStore.changeDeviceBrand([
        {
          name: item._source.product.brand.name,
          img: item._source.product.brand.img_src,
          id: item._source.product.brand.id,
          alt: item._source.product.brand.img_alt,
        },
      ])
      repairWidgetStore.changeCntStep(2)
      repairWidgetStore.changeDeviceModel([
        {
          name: item._source.product.name,
          img: item._source.product.img_src,
          id: item._source.product.id,
          alt: item._source.product.img_alt,
        },
      ])
      repairWidData.changeCntBrandID(item._source.product.brand_id)
      repairWidData.changeCntProductID(item._source.product.id)
      repairWidgetStore.changeDeviceCounter(1)
      history.push(data.general.routes.repairWidgetPage)
    }
    setSearchKey("")
    initSearchData()
  }

  const handleResize = () => {
    if (getWidth() < 768) {
      setMobile(true)
    } else {
      setMobile(false)
    }
    if (getWidth() > 425 && getWidth() < 768) {
      setGetQuoteStatus(true)
    } else {
      setGetQuoteStatus(false)
    }
  }

  const handleRepairWidget = () => {
    repairWidgetStore.init()
    handleStatus(false)
  }

  useEffect(() => {
    handleResize()
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  useEffect(() => {
    const cntFeatures: any[] = []
    if (!isEmpty(features) && features.length) {
      features.forEach((item: any) => {
        if (item.isActive) {
          cntFeatures.push(item.flag)
        }
      })
    }
    setFeatures(cntFeatures)
  }, [data, features])

  function toggleMenuStatus() {
    setMenuStatus(!menuStatus)
  }

  return (
    <header className="header">
      <div className="header-brand" style={{ backgroundColor: brandData.brandThemeCol }}>
        <div className="brand-container">
          {!mobile && (
            <ul className="d-flex m-0 p-0">
              {brandItemLink.map((item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {item.visible ? (
                      <BrandItemLink
                        item={t(item.text)}
                        href={item.href}
                        color={brandData.brandCol}
                      />
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                )
              })}
            </ul>
          )}
          {mobile && (
            <Link
              to={data.general.routes.contactPage}
              className="brand-direction"
              style={{ color: brandData.brandCol }}
            >
              <RoomOutlinedIcon />
              {t("Directions")}
            </Link>
          )}
          <ul
            style={{
              paddingRight: mobile && getQuteStatus ? 0 : "40px",
            }}
            className="brand-list"
          >
            {thisPage.visibility.phone && (
              <BrandItemLink
                item={storesDetails.storesDetails.phone}
                color={brandData.brandCol}
                phoneNumber={storesDetails.storesDetails.phoneFormat}
                href="#"
              />
            )}
            {!mobile && thisPage.visibility.lang && <LangDropdown color={brandData.brandCol} />}
            {!mobile && thisPage.visibility.covidPage && (
              <BrandItemLink
                item={data.homepage.footer.bottomLinks.covidPage.text}
                color={brandData.brandCol}
                phoneNumber={storesDetails.storesDetails.phoneFormat}
                href={data.homepage.footer.bottomLinks.covidPage.link}
              />
            )}
            {!mobile && thisPage.visibility.loginPage && (
              <FeatureToggles features={feats}>
                <Feature
                  name={featureToggleKeys.FRONTEND_USER_ACCOUNT}
                  inactiveComponent={() => <></>}
                  activeComponent={() => (
                    <Feature
                      name={featureToggleKeys.FRONTEND_USER_LOGIN}
                      inactiveComponent={() => <></>}
                      activeComponent={() => (
                        <BrandItemLink item={t("LOG_IN")} color={brandData.brandCol} href="#" />
                      )}
                    />
                  )}
                />
              </FeatureToggles>
            )}
          </ul>
          {mobile && getQuteStatus && (
            <Link
              style={{
                background: data.general.colorPalle.repairButtonCol,
                color: "white",
              }}
              to={data.general.routes.repairWidgetPage}
              onClick={handleRepairWidget}
              className="mobile-brand-button"
            >
              {t("Get Quote")}
            </Link>
          )}
        </div>
        <div
          style={{
            background: data.general.colorPalle.repairButtonCol,
          }}
          className="brand-getquote-container"
        >
          <Link to={data.general.routes.repairWidgetPage}>{t("Get Quote")}</Link>
        </div>
      </div>
      <div
        className="container-header"
        style={{ marginTop: mobile && !getQuteStatus ? "65px" : "35px" }}
      >
        <div className="header-left">
          <Logo type="header" handleStatus={handleStatus} />

          {feats.includes(featureToggleKeys.FRONTEND_GLOBAL_SEARCH) && (
            <div
              className="search-div"
              id="header-search"
              ref={customRef}
              onFocus={() => {
                setViewFilterList(true)
              }}
            >
              <Search
                placeholder={searchPlaceholder}
                color={themeType === "marnics" ? "#235B89" : "rgba(0,0,0,0.8)"}
                bgcolor="white"
                border="rgba(0,0,0,0.2)"
                value={searchKey}
                iconPosition={themeType === "marnics" ? "left" : "right"}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeSearch(e)
                }}
                handleIconClick={() => {
                  // EMPTY
                }}
              />
              {viewFilterList && searchData.length ? (
                <div
                  className="search-data-viewer custom-scroll-bar"
                  onScroll={handleScroll}
                  onMouseOver={() => {
                    setHover(true)
                  }}
                  onMouseLeave={() => {
                    setHover(false)
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p className="search-type">{t("Services")}</p>
                    {searchData.map((item: any, index: number) => {
                      return (
                        <div
                          className="search-item"
                          key={index}
                          onClick={() => {
                            handleSearchItem(item)
                            setSelectList(0)
                            setHover(false)
                          }}
                          style={{
                            background: selectList === index && !hover ? "#f5f5f5" : "",
                          }}
                        >
                          {item._source.img_src && item._source.type !== "brand" && (
                            <img src={item._source.img_src} alt={`search-item-${index}`} />
                          )}
                          <p>
                            {item._source.name ||
                              `${item._source.product ? item._source.product.name : ""} ${item._source.title
                                }`.trim()}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>

        <div className="nav-div">
          <ul className="navlink-parent">
            {navItemsLink.map((item: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  {item.visible ? (
                    <NavItemLink item={item} handleStatus={handleStatus} feats={feats} />
                  ) : (
                    <></>
                  )}
                </React.Fragment>
              )
            })}
          </ul>
          <FeatureToggles features={feats}>
            <Feature
              name={featureToggleKeys.FRONTEND_FIND_A_STORE}
              inactiveComponent={() => <></>}
              activeComponent={() => (
                <CustomizedMenus
                  btnTitle={thisPage.button.title}
                  width={thisPage.button.width}
                  features={feats}
                />
              )}
            />
          </FeatureToggles>
          {/* <FeatureToggles features={feats}>
            <Feature
              name='FRONTEND_BUY'
              inactiveComponent={()=><></>}
              activeComponent={()=>
                <a href={thisPage.mobileNavData.avatarData.store.link} className={ 'navlink-avatar-store'} target='_blank' rel='noreferrer'>
                  <img src={thisPage.mobileNavData.avatarData.store.img} alt='shop-img' />
                </a>
              }
            />
          </FeatureToggles> */}
        </div>
        <div className="snap-search">
          <Search
            placeholder={searchPlaceholder}
            color="#143663"
            bgcolor="white"
            border="rgba(0,0,0,0.2)"
            iconPosition={"left"}
            value={searchKey}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChangeSearch(e)
            }}
            handleIconClick={() => {
              // EMPTY
            }}
          />
        </div>
        <div className="avatar-div">
          <HeaderDrawer
            toggleMenuStatus={toggleMenuStatus}
            handleStatus={handleStatus}
            features={feats}
            themeCol={data.general.colorPalle.repairButtonCol}
          >
            {!menuStatus ? (
              <img
                src={thisPage.mobileNavData.avatarData.menu}
                onClick={toggleMenuStatus}
                alt="menu-img"
              />
            ) : (
              <img
                src={thisPage.mobileNavData.avatarData.cancel}
                onClick={toggleMenuStatus}
                alt="cancel-img"
              />
            )}
          </HeaderDrawer>
          {/* <FeatureToggles features={feats}>
            <Feature
              name="FRONTEND_BUY"
              inactiveComponent={() => <></>}
              activeComponent={() => (
                <a
                  href={thisPage.mobileNavData.avatarData.store.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ height: "35px" }}
                >
                  <img src={thisPage.mobileNavData.avatarData.storeBlue} style={{ height: "35px" }} />
                </a>
              )}
            />
          </FeatureToggles> */}
        </div>
      </div>
      <div className="marnics-container-mobile">
        {feats.includes(featureToggleKeys.FRONTEND_GLOBAL_SEARCH) && (
          <div
            className="mobile-search-div marnics-search-div"
            id="header-search-mobile"
            ref={customRefMobile}
            onFocus={() => {
              setViewFilterList(true)
            }}
          >
            <div className="mobile-child-search">
              <Search
                placeholder={searchPlaceholder}
                color="#143663"
                bgcolor="white"
                border="rgba(0,0,0,0.2)"
                iconPosition={"left"}
                value={searchKey}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeSearch(e)
                }}
                handleIconClick={() => {
                  // EMPTY
                }}
              />
              {viewFilterList && searchData.length ? (
                <div
                  className="search-data-viewer custom-scroll-bar"
                  onScroll={handleScroll}
                  onMouseOver={() => {
                    setHover(true)
                  }}
                  onMouseLeave={() => {
                    setHover(false)
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p className="search-type">{t("Services")}</p>
                    {searchData.map((item: any, index: number) => {
                      return (
                        <div
                          className="search-item"
                          key={index}
                          onClick={() => {
                            handleSearchItem(item)
                            setSelectList(0)
                            setHover(false)
                          }}
                          style={{
                            background: selectList === index && !hover ? "#f5f5f5" : "",
                          }}
                        >
                          {item._source.img_src && item._source.type !== "brand" && (
                            <img src={item._source.img_src} alt={`search-item-${index}`} />
                          )}
                          <p>
                            {item._source.name ||
                              `${item._source.product ? item._source.product.name : ""} ${item._source.title
                                }`.trim()}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
      {themeType !== "marnics" &&
        <div className="container-mobile">
          {feats.includes(featureToggleKeys.FRONTEND_GLOBAL_SEARCH) && (
            <div
              className="mobile-search-div"
              id="header-search-mobile"
              ref={customRefMobile}
              onFocus={() => {
                setViewFilterList(true)
              }}
            >
              <div className="mobile-child-search">
                <Search
                  placeholder={searchPlaceholder}
                  color="rgba(0,0,0,0.8)"
                  bgcolor="white"
                  border="rgba(0,0,0,0.2)"
                  value={searchKey}
                  handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChangeSearch(e)
                  }}
                  handleIconClick={() => {
                    // EMPTY
                  }}
                />
                {viewFilterList && searchData.length ? (
                  <div
                    className="search-data-viewer custom-scroll-bar"
                    onScroll={handleScroll}
                    onMouseOver={() => {
                      setHover(true)
                    }}
                    onMouseLeave={() => {
                      setHover(false)
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p className="search-type">{t("Services")}</p>
                      {searchData.map((item: any, index: number) => {
                        return (
                          <div
                            className="search-item"
                            key={index}
                            onClick={() => {
                              handleSearchItem(item)
                              setSelectList(0)
                              setHover(false)
                            }}
                            style={{
                              background: selectList === index && !hover ? "#f5f5f5" : "",
                            }}
                          >
                            {item._source.img_src && item._source.type !== "brand" && (
                              <img src={item._source.img_src} alt={`search-item-${index}`} />
                            )}
                            <p>
                              {item._source.name ||
                                `${item._source.product ? item._source.product.name : ""} ${item._source.title
                                  }`.trim()}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </div>
      }
      {/* <div className={ "container-mobile"}>
        {userStatus && menuStatus ? (
          <FeatureToggles features={feats}>
            <Feature
              name={featureToggleKeys.FRONTEND_GLOBAL_SEARCH}
              inactiveComponent={() => <></>}
              activeComponent={() => (
                <div className={ "mobile-search-div"}>
                  <div className={ "mobile-child-search"}>
                    <Search
                      placeholder={searchPlaceholder}
                      color="rgba(0,0,0,0.8)"
                      bgcolor="white"
                      border="rgba(0,0,0,0.2)"
                      handleChange={() => {}}
                      handleIconClick={() => {}}
                    />
                  </div>
                </div>
              )}
            />
          </FeatureToggles>
        ) : (
          <div className={ "mobile-menu-navbar"}>
            {userStatus && (
              <div className={ "arrow"}>
                {mobileMenu === "right" && (
                  <img
                    className={ "arrow-right"}
                    src={commonData.arrowData.arrowLeft}
                    onClick={toggleMobileMenu}
                  />
                )}
              </div>
            )}
            {userStatus ? (
              <div>
                {mobileMenu === "left" ? (
                  <div>
                    {navItemsLink.map((item: any, index: number) => {
                      return (
                        <FeatureToggles features={feats} key={index}>
                          <Feature
                            name={item.flag}
                            inactiveComponent={() => <></>}
                            activeComponent={() => (
                              <div
                                className="flex-space-between"
                                onClick={() => {
                                  // item.text === 'SHOP' && setMobileMenu('right')
                                }}
                              >
                                {isExternal(item.href) ? (
                                  <a
                                    className={ "mobile-item"}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {t(item.text)}
                                  </a>
                                ) : item.href === "#" || !item.href ? (
                                  <></>
                                ) : (
                                  <Link className={ "mobile-item"} to={item.href}>
                                    {t(item.text)}
                                  </Link>
                                )}

                                {item.text === 'SHOP' && 
                                  <img style={{height: '18px'}} src={commonData.arrowData.arrowRight} />
                                }
                              </div>
                            )}
                          />
                        </FeatureToggles>
                      )
                    })}
                  </div>
                ) : (
                  <div>
                    {mobileShopType === 999 ? (
                      <p className={ "arrow-back"} onClick={toggleMobileMenu}>
                        {t("BACK")}
                      </p>
                    ) : (
                      <p
                        className={ "arrow-back"}
                        onClick={() => setMobileShopType(999)}
                      >
                        {thisPage.megaMenu.mainList[mobileShopType].type}
                      </p>
                    )}
                    <div className="mobile-scroll-nav-div">
                      {mobileShopType === 999
                        ? thisPage.megaMenu.mainList.map((item: any, index: number) => {
                            return (
                              <a
                                key={index}
                                className={ "mobile-item"}
                                href="#"
                                onClick={() => setMobileShopType(index)}
                              >
                                {item.type}
                              </a>
                            )
                          })
                        : thisPage.megaMenu.mainList[mobileShopType].list.map(
                            (item: any, index: number) => {
                              return (
                                <a key={index} className={ "mobile-item"} href="#">
                                  {item}
                                </a>
                              )
                            }
                          )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {thisPage.mobileNavData.userNavItems.map((item: any, index: number) => {
                  return (
                    <FeatureToggles features={feats} key={index}>
                      <Feature
                        name={item.flag}
                        inactiveComponent={() => <></>}
                        activeComponent={() => (
                          <a className={ "mobile-item"} href={item.href}>
                            {t(item.text)}
                          </a>
                        )}
                      />
                    </FeatureToggles>
                  )
                })}
                <FeatureToggles features={feats}>
                  <Feature
                    name={featureToggleKeys.FRONTEND_USER_ACCOUNT}
                    inactiveComponent={() => <></>}
                    activeComponent={() => (
                      <Feature
                        name="FRONTEND_USER_SIGNUP"
                        inactiveComponent={() => <></>}
                        activeComponent={() => (
                          <a href="#" style={{ color: data.general.colorPalle.textThemeCol }}>
                            {t("SIGN_OUT")}
                          </a>
                        )}
                      />
                    )}
                  />
                </FeatureToggles>
              </div>
            )}
          </div>
        )}
      </div> */}
    </header>
  )
}

export default Header
