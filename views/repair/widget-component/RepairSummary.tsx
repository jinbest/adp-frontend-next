import React, { useState, useEffect } from "react"
import { Typography } from "@material-ui/core"
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined"
import { inject, observer } from "mobx-react"
import { RepairWidgetStore } from "../../../store/RepairWidgetStore"
import { useTranslation } from "react-i18next"
import { ConvertWarrantyUnit } from "../../../services/helper"

type StoreProps = {
  repairWidgetStore: RepairWidgetStore
}
interface Props extends StoreProps {
  step: number
  themeCol: string
  showInfo?: boolean
}

const RepairSummary = inject("repairWidgetStore")(
  observer((props: Props) => {
    const { themeCol, showInfo, repairWidgetStore } = props
    const code = repairWidgetStore.deliveryMethod.code
    const [t] = useTranslation()

    const [brand, setBrand] = useState<any[]>([])
    const [model, setModel] = useState<any[]>([])
    const [choose, setChoose] = useState<any[]>([])

    useEffect(() => {
      setBrand(repairWidgetStore.deviceBrand)
      setModel(repairWidgetStore.deviceModel)
      setChoose(repairWidgetStore.chooseRepair)
    }, [repairWidgetStore])

    const handleTrashSummary = (countNum: number, serviceNum: number) => {
      const cntDeviceBrand = repairWidgetStore.deviceBrand,
        cntDeviceModel = repairWidgetStore.deviceModel,
        cntChooseRepair = repairWidgetStore.chooseRepair
      let cntDeviceCounter = repairWidgetStore.deviceCounter
      cntChooseRepair[countNum].splice(serviceNum, 1)

      if (cntChooseRepair[countNum].length === 0) {
        cntChooseRepair.splice(countNum, 1)
        cntDeviceBrand.splice(countNum, 1)
        cntDeviceModel.splice(countNum, 1)
        cntDeviceCounter = cntDeviceCounter - 1
        repairWidgetStore.changeDeviceBrand(cntDeviceBrand)
        repairWidgetStore.changeDeviceModel(cntDeviceModel)
        repairWidgetStore.changeChooseRepair(cntChooseRepair)
        repairWidgetStore.changeDeviceCounter(cntDeviceCounter)

        setBrand(cntDeviceBrand)
        setModel(cntDeviceModel)
        setChoose(cntChooseRepair)
      } else {
        repairWidgetStore.changeChooseRepair(cntChooseRepair)
        setChoose(cntChooseRepair)
      }
    }

    return (
      <div className="service-choose-device-container">
        <Typography className="topic-title">{t("Service Summary")}</Typography>
        <div className="service-summary-content-div">
          {brand &&
            brand.map((item: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  {choose[index] &&
                    choose[index].map((chooseItem: any, chooseIndex: number) => (
                      <div key={chooseIndex} className="service-summary-div">
                        <DeleteOutlineOutlinedIcon
                          className="service-trash-icon"
                          style={{ color: themeCol }}
                          onClick={() => {
                            handleTrashSummary(index, chooseIndex)
                          }}
                        />
                        <div className="service-summary-img">
                          <img src={item.img} width="1" height="auto" alt={item.alt} />
                        </div>
                        <div>
                          <Typography className="service-summary-title">
                            {model[index]["name"]}
                          </Typography>
                          <p className="service-summary-service-child">{t(chooseItem.name)}</p>
                          <p className="service-summary-service-child">{t(chooseItem.estimate)}</p>
                          {chooseItem.warranty && chooseItem.warranty > 0 ? (
                            <p className="service-summary-service-child">
                              {`${t("Warranty")}: ${chooseItem.warranty} ${t(
                                ConvertWarrantyUnit(chooseItem.warranty_unit, chooseItem.warranty)
                              )}`}
                            </p>
                          ) : chooseItem.warranty && chooseItem.warranty === -1 ? (
                            <p className="service-summary-service-child">
                              {`${t("Warranty")}: ${t("Lifetime")}`}
                            </p>
                          ) : (
                            <p className="service-summary-service-child" style={{ color: "grey" }}>
                              <i>{`${t("No")} ${t("Warranty")}`}</i>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </React.Fragment>
              )
            })}
          {showInfo && (
            <div className="service-summary-div">
              <div>
                <Typography className="service-summary-title">
                  {t(repairWidgetStore.deliveryMethod.method)}
                </Typography>
                {code === "PICK_UP" && (
                  <Typography className="service-summary-service">{t("Pick Up From")}</Typography>
                )}
                {code === "MAIL_IN" && (
                  <Typography className="service-summary-service">{t("Send To")}</Typography>
                )}
                {code !== "MAIL_IN" && (
                  <p className="service-summary-service-child">
                    {t(repairWidgetStore.bookData[code].address.name)}
                  </p>
                )}
                {code === "MAIL_IN" && (
                  <p className="service-summary-service-child" style={{ marginBottom: "15px" }}>
                    {t(repairWidgetStore.bookData[code].sendTo)}
                  </p>
                )}
                {code === "MAIL_IN" && (
                  <Typography className="service-summary-service">{t("Return To")}</Typography>
                )}
                {code === "MAIL_IN" && (
                  <p className="service-summary-service-child">
                    {t(repairWidgetStore.contactDetails.address1.name)}
                  </p>
                )}
                {code !== "MAIL_IN" && (
                  <p className="service-summary-service-child">
                    {repairWidgetStore.bookData[code].week +
                      ", " +
                      repairWidgetStore.bookData[code].month +
                      " " +
                      repairWidgetStore.bookData[code].day +
                      ", " +
                      repairWidgetStore.bookData[code].year +
                      " at " +
                      repairWidgetStore.bookData[code].time}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  })
)

export default RepairSummary
