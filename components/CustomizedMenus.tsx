import React, { useState, useEffect } from "react";
import { withStyles, createStyles, makeStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";
// import { Button, InputComponent } from "./"
import Button from "./Button";
import InputComponent from "./InputComponent";
import { useTranslation } from "react-i18next";
import { repairWidgetStore } from "../store/";
import { findLocationAPI } from "../services/";
import Link from "next/link";
import { StoresDetails } from "../store/StoresDetails";
import { inject, observer } from "mobx-react";
import { ToastMsgParams } from "./toast/toast-msg-params";
import Toast from "./toast/toast";
import Loading from "./Loading";
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles";
import { makeLocations, getAddress, AddFormat12 } from "../services/helper";

const StyledMenu = withStyles({
  paper: {
    borderRadius: "15px",
    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    overflow: "inherit !important",
    marginTop: "5px",
    border: "1px solid #C4C4C4",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

const useStyles = makeStyles(() =>
  createStyles({
    nonHoverEffect: {
      textDecoration: "none !important",
      opacity: "1 !important",
      cursor: "default !important",
    },
  })
);

type StoreProps = {
  storesDetailsStore: StoresDetails;
};
interface Props extends StoreProps {
  btnTitle: string;
  width: string;
  features: any[];
}

const CustomizedMenus = inject("storesDetailsStore")(
  observer((props: Props) => {
    const { btnTitle, width, storesDetailsStore, features } = props;

    const data = storesDetailsStore.storeCnts;
    const themeColor = data.general.colorPalle.themeColor;
    const underLineCol = data.general.colorPalle.underLineCol;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [t] = useTranslation();
    const [pos, setPos] = useState({ latitude: "", longitude: "" });
    const [locSelStatus, setLocSelStatus] = useState(
      storesDetailsStore.cntUserLocationSelected
    );
    const [locations, setLocations] = useState<any[]>(
      storesDetailsStore.cntUserLocation
    );
    const [requireUserInfo, setRequireUserInfo] = useState(false);
    const [toastParams, setToastParams] = useState<ToastMsgParams>(
      {} as ToastMsgParams
    );
    const [postCode, setPostCode] = useState("");
    const [isRequest, setIsRequest] = useState(false);
    const [myStore, setMyStore] = useState("My Store");

    const classes = useStyles();

    const handleLocSelect = (index: number) => {
      const cntLocation: any = storesDetailsStore.cntUserLocation[index];
      setLocations([cntLocation]);
      storesDetailsStore.changeLocationID(cntLocation.location_id);
      setLocSelStatus(true);
    };

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const setCoords = (pos: any) => {
      setPos({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    };

    const resetStatuses = () => {
      setToastParams({
        msg: "",
        isError: false,
        isWarning: false,
        isInfo: false,
        isSuccess: false,
      });
    };

    // navigator.geolocation.getCurrentPosition(() => {})

    useEffect(() => {
      if (Boolean(anchorEl)) {
        if (storesDetailsStore.cntUserLocation.length) {
          return;
        }
        if (navigator.platform.includes("Mac")) {
          setRequireUserInfo(true);
          return;
        }
        navigator.permissions
          ? navigator.permissions
              .query({ name: "geolocation" })
              .then(function (PermissionStatus) {
                if (PermissionStatus.state == "granted") {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(setCoords);
                    setRequireUserInfo(false);
                  } else {
                    console.log(
                      "Geolocation is not supported by this browser."
                    );
                    setRequireUserInfo(true);
                  }
                } else if (PermissionStatus.state == "prompt") {
                  console.log("not yet grated or denied");
                  setRequireUserInfo(true);
                } else {
                  setRequireUserInfo(true);
                  setPos({ latitude: "", longitude: "" });
                }
              })
          : setRequireUserInfo(true);
      }
    }, [anchorEl]);

    useEffect(() => {
      if (!requireUserInfo && pos.latitude) {
        if (locations.length) return;
        findLocationAPI
          .findGeoLocation(storesDetailsStore.store_id, pos)
          .then((res: any) => {
            if (res.data.length) {
              storesDetailsStore.changeFindAddLocation(res.data);
              setLocations(
                makeLocations([storesDetailsStore.findAddLocation[0]])
              );
              storesDetailsStore.changeLocationID(
                storesDetailsStore.findAddLocation[0].id
              );
            } else {
              setToastParams({
                msg: "Response is an empty data, please input your infos.",
                isWarning: true,
              });
              setPos({ latitude: "", longitude: "" });
              setRequireUserInfo(true);
            }
          })
          .catch((error) => {
            console.log("Error to find location with GeoCode", error);
            setToastParams({
              msg: "Error to find location with GeoCode.",
              isError: true,
            });
            setPos({ latitude: "", longitude: "" });
            setRequireUserInfo(true);
          });
      }
    }, [pos, locations]);

    useEffect(() => {
      storesDetailsStore.changeCntUserLocationSelected(locSelStatus);
      if (locations.length <= 1) {
        setMyStore(t("Nearest Location"));
      } else {
        setMyStore(t("All Locations"));
      }
      if (locSelStatus) {
        setMyStore(t("Selected Location"));
      }
    }, [locSelStatus, locations]);

    useEffect(() => {
      storesDetailsStore.changeCntUserLocation(locations);
    }, [locations]);

    const viewMoreStores = () => {
      setLocations(makeLocations(storesDetailsStore.findAddLocation));
      setLocSelStatus(false);
    };

    const handleBookRepair = () => {
      repairWidgetStore.init();
    };

    const onKeyPress = (event: any) => {
      if (event.key === "Enter") {
        handleGetLocation(event.target.value);
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", onKeyPress, false);
      return () => {
        document.removeEventListener("keydown", onKeyPress, false);
      };
    }, []);

    useEffect(() => {
      if (
        storesDetailsStore.allLocations.length > 1 ||
        !storesDetailsStore.allLocations.length
      )
        return;
      storesDetailsStore.changeFindAddLocation(storesDetailsStore.allLocations);
      storesDetailsStore.changeCntUserLocationSelected(true);
      setLocations(makeLocations(storesDetailsStore.allLocations));
      setLocSelStatus(true);
      storesDetailsStore.changeLocationID(
        storesDetailsStore.allLocations[0].id
      );
    }, []);

    const handleGetLocation = (poscode: string) => {
      if (!poscode) return;
      const infoData: any = {
        city: "",
        state: "",
        postcode: poscode,
        country: "",
      };
      setIsRequest(true);
      findLocationAPI
        .findAddLocation(storesDetailsStore.store_id, infoData)
        .then((res: any) => {
          if (res.data.length) {
            storesDetailsStore.changeFindAddLocation(res.data);
            setLocations(
              makeLocations([storesDetailsStore.findAddLocation[0]])
            );
            storesDetailsStore.changeLocationID(
              storesDetailsStore.findAddLocation[0].id
            );
          } else {
            setToastParams({
              msg: "Response is an empty data, please check your infos.",
              isWarning: true,
            });
            setIsRequest(false);
          }
        })
        .catch((error) => {
          console.log("Error to find location with Address", error);
          setToastParams({
            msg:
              "Error to find location with Postal Code, please check your code.",
            isError: true,
          });
          setIsRequest(false);
        });
    };

    return (
      <div>
        <Button
          title={
            !locSelStatus
              ? t(btnTitle)
              : storesDetailsStore.cntUserLocation[0] &&
                AddFormat12(storesDetailsStore.cntUserLocation[0])
          }
          bgcolor={!locSelStatus ? themeColor : "transparent"}
          txcolor={!locSelStatus ? "white" : "black"}
          border={!locSelStatus ? "1px solid rgba(0,0,0,0.1)" : "none"}
          textDecorator={!locSelStatus ? "none" : "underline"}
          borderR="20px"
          aria-controls="customized-menu"
          aria-haspopup="true"
          onClick={handleOpen}
          icon={true}
          fontSize="17px"
          width={!locSelStatus ? width : "auto"}
          hover={!locSelStatus ? true : false}
        />
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div className="triangle" style={{ right: "65px" }}></div>
          <div className={"menu-content-div"}>
            <div
              className={"left-content"}
              style={{
                width: locSelStatus || !locations.length ? "215px" : "500px",
              }}
            >
              <div className={"content-block"}>
                {storesDetailsStore.cntUserLocation.length ||
                !requireUserInfo ? (
                  <p className={"block-title"}>{myStore}</p>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <InputComponent
                      value={postCode}
                      placeholder={t("Postal Code*")}
                      handleChange={(e) => {
                        setPostCode(e.target.value);
                      }}
                    />
                    <Button
                      title={t("Get Location")}
                      bgcolor={themeColor}
                      borderR="20px"
                      width="80%"
                      height="30px"
                      margin="10px auto"
                      fontSize="15px"
                      disable={isRequest}
                      onClick={() => handleGetLocation(postCode)}
                    >
                      {isRequest && <Loading />}
                    </Button>
                  </div>
                )}
                <div className="custom-menu-locations-container">
                  {storesDetailsStore.cntUserLocation.map(
                    (item: any, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <p
                            onClick={() => handleLocSelect(index)}
                            className={
                              "block-content" +
                              (locSelStatus ? ` ${classes.nonHoverEffect}` : "")
                            }
                          >
                            {item.distance
                              ? item.location_name +
                                ", " +
                                AddFormat12(item) +
                                " (" +
                                item.distance +
                                ")"
                              : item.location_name + ", " + AddFormat12(item)}
                          </p>
                        </React.Fragment>
                      );
                    }
                  )}
                </div>
              </div>
              <div className={"content-block"}>
                {locSelStatus && (
                  <a
                    className={"link"}
                    style={{ color: underLineCol }}
                    href={
                      storesDetailsStore.cntUserLocation[0] &&
                      storesDetailsStore.cntUserLocation[0].business_page_link
                        ? storesDetailsStore.cntUserLocation[0]
                            .business_page_link
                        : "https://www.google.com/business/"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("View Store Details")}
                  </a>
                )}
                {storesDetailsStore.findAddLocation.length > 1 &&
                  locations.length <
                    storesDetailsStore.findAddLocation.length && (
                    <a
                      className={"link"}
                      style={{ color: underLineCol }}
                      onClick={viewMoreStores}
                    >
                      {t("View More Stores")}
                    </a>
                  )}
                {locSelStatus && (
                  <a
                    className={"link"}
                    style={{ color: underLineCol }}
                    href={`${
                      storesDetailsStore.cntUserLocation[0] &&
                      storesDetailsStore.cntUserLocation[0]
                        .business_page_link != null
                        ? storesDetailsStore.cntUserLocation[0]
                            .business_page_link
                        : `https://www.google.com/maps/search/?api=1&query=${getAddress(
                            storesDetailsStore.cntUserLocation[0]
                          )
                            .split(" ")
                            .join("+")}`
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("Get Directions")}
                  </a>
                )}
              </div>
              {locSelStatus && (
                <FeatureToggles features={features}>
                  <Feature
                    name={"FRONTEND_REPAIR_APPOINTMENT"}
                    inactiveComponent={() => <></>}
                    activeComponent={() => (
                      <>
                        <style jsx>{`
                          a {
                            text-decoration: none;
                          }
                        `}</style>
                        <Link href={data.general.routes.repairWidgetPage}>
                          <div onClick={handleBookRepair}>
                            <Button
                              title={t("Book Appointment")}
                              bgcolor={themeColor}
                              borderR="20px"
                              width="175px"
                              height="30px"
                              margin="0"
                              fontSize="15px"
                            />
                          </div>
                        </Link>
                      </>
                    )}
                  />
                </FeatureToggles>
              )}
            </div>
            {locSelStatus && (
              <React.Fragment>
                <div
                  style={{
                    borderLeft: "2px solid rgba(0,0,0,0.25)",
                    margin: "30px 10px",
                  }}
                ></div>
                <div style={{ width: "390px" }}>
                  {storesDetailsStore.cntUserLocation.map(
                    (item: any, id: number) => {
                      return (
                        <div key={id}>
                          {item.days.map((it: any, index: number) => {
                            return (
                              <div key={index}>
                                <p className={"block-title"}>{t("Hours")}</p>
                                <div className={"hours-div"}>
                                  <div>
                                    {it.wkDys.map((itm: any, idx: number) => {
                                      return (
                                        <p
                                          className={"block-content"}
                                          style={{
                                            textDecoration: "none",
                                            opacity: 1,
                                            cursor: "default",
                                          }}
                                          key={idx}
                                        >
                                          {t(itm)}
                                        </p>
                                      );
                                    })}
                                  </div>
                                  <div>
                                    {item.hours[index].hrs.map(
                                      (itm: any, idx: number) => {
                                        return (
                                          <p
                                            className={"block-content"}
                                            style={{
                                              textDecoration: "none",
                                              opacity: 1,
                                              cursor: "default",
                                            }}
                                            key={idx}
                                          >
                                            {itm === "Closed" ? t(itm) : itm}
                                          </p>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
                </div>
              </React.Fragment>
            )}
          </div>
        </StyledMenu>
        <Toast params={toastParams} resetStatuses={resetStatuses} />
      </div>
    );
  })
);

export default CustomizedMenus;
