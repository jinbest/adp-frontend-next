import React, { useState, useEffect, useCallback } from "react"
import { Grid, Typography } from "@material-ui/core"
import Card from "./Card"
import RepairSummary from "./RepairSummary"
import InputComponent from "../../../components/InputComponent"
import Button from "../../../components/Button"
import PhoneInput from "../../../components/PhoneInput"
import CustomSelect from "../../../components/CustomSelect"
import Loading from "../../../components/Loading"
import { useTranslation } from "react-i18next"
import { FeatureToggles, Feature } from "@paralleldrive/react-feature-toggles"
import { repairWidgetStore, storesDetails } from "../../../store"
import { repairWidgetAPI, findLocationAPI } from "../../../services"
import { AppointmentParams } from "../../../model/post-appointment-params"
import { countriesData } from "../../../const"
import { makeLocations } from "../../../services/helper"
import { ToastMsgParams } from "../../../model/toast-msg-param"
import Toast from "../../../components/toast/toast"
import moment from "moment"
import { ValidateEmail, ValidatePhoneNumber } from "../../../services/helper"
import {
  deliveryMethodCode,
  contactMethodCode,
  appointmentQuoteType,
  featureToggleKeys,
} from "../../../const/_variables"

type Props = {
  data: any
  step: number
  handleStep: (step: number) => void
  handleChangeChooseData: (step: number, chooseData: any) => void
  repairWidgetData: any
  code: string
  features: any[]
}

const ContactDetails = ({
  data,
  step,
  handleStep,
  handleChangeChooseData,
  features,
  code,
}: Props) => {
  const mainData = storesDetails.storeCnts
  const themeCol = mainData.general.colorPalle.themeColor
  const themeType = mainData.general.themeType
  const codeArray = [
    deliveryMethodCode.mailin,
    deliveryMethodCode.onsite,
    deliveryMethodCode.pickup,
  ]
  const [t] = useTranslation()

  const [firstName, setFirstName] = useState("")
  const [fnErrTxt, setFnErrTxt] = useState("")
  const [lastName, setLastName] = useState("")
  const [lnErrTxt, setLnErrTxt] = useState("")
  const [email, setEmail] = useState("")
  const [emlErrTxt, setEmlErrTxt] = useState("")
  const [phone, setPhone] = useState("")
  const [phErrTxt, setPhErrTxt] = useState("")
  const [address1, setStreetAddress1] = useState("")
  const [ad1ErrTxt, setAd1ErrTxt] = useState("")
  const [address2, setStreetAddress2] = useState("")
  const [country, setCountry] = useState({ code: "CA", name: "" })
  const [city, setCity] = useState("")
  const [ctErrTxt, setCtErrTxt] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [psErrTxt, setPsErrTxt] = useState("")
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)
  const [isSubmiting, setIsSubmiting] = useState<boolean[]>([false, false])
  const [disableStatus, setDisableStatus] = useState(true)

  const handleSubmit = (param: string) => {
    if (param === "appointment") {
      setIsSubmiting([true, false])
    } else {
      setIsSubmiting([false, true])
    }
    if (param !== "appointment") {
      const repairs: any[] = []

      for (let i = 0; i < repairWidgetStore.deviceCounter; i++) {
        if (repairWidgetStore.chooseRepair.length > i && repairWidgetStore.chooseRepair[i].length) {
          repairWidgetStore.chooseRepair[i].forEach((item: any) => {
            repairs.push({
              repair_id: item.id,
              product_id: repairWidgetStore.deviceModel[i].id,
              cost: item.cost,
              duration: item.estimate,
              product_name:
                repairWidgetStore.deviceBrand[i].name + " " + repairWidgetStore.deviceModel[i].name,
              repair_name: item.name,
              warranty: item.warranty,
              warranty_unit: item.warranty_unit,
            })
          })
        }
      }
      const params = {} as AppointmentParams
      params.store_id = storesDetails.store_id
      params.location_id = storesDetails.location_id
      params.customer_id = 1
      params.type = appointmentQuoteType.quote
      params.is_voided = storesDetails.is_voided
      params.delivery_method = repairWidgetStore.deliveryMethod.code
      params.customer_email = email
      params.customer_first_name = firstName
      params.customer_last_name = lastName
      params.customer_phone = phone
      params.customer_address_1 = address1
      params.customer_address_2 = address2
      params.customer_city = city
      params.customer_postcode = postalCode
      params.customer_country = country.code
      params.customer_note = null
      params.customer_contact_method = repairWidgetStore.receiveQuote.code
      params.customer_timezone = repairWidgetStore.timezone
      params.repairs = repairs
      params.selected_date = repairWidgetStore.repairWidgetInitialValue.selectDate
      params.selected_start_time = repairWidgetStore.repairWidgetInitialValue.selected_start_time
      params.selected_end_time = repairWidgetStore.repairWidgetInitialValue.selected_end_time
      params.booking_date = moment().format("YYYY-MM-DD")
      params.converted = repairWidgetStore.converted

      repairWidgetAPI
        .postAppointmentQuote(params)
        .then((res: any) => {
          handleChangeChooseData(6, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address1: { name: address1, code: "" },
            address2: { name: address2, code: "" },
            country: country,
            city: city,
            postalCode: postalCode,
          })
          repairWidgetStore.changeAppointResponse(res)
          handleStep(11)
        })
        .catch(() => {
          setToastParams({
            msg: t("Something went wrong, please try again or contact us."),
            isError: true,
          })
          setIsSubmiting([false, false])
        })
    } else {
      handleChangeChooseData(6, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address1: { name: address1, code: "" },
        address2: { name: address2, code: "" },
        country: country,
        city: city,
        postalCode: postalCode,
      })
      handleStep(step + 1)
    }
  }

  useEffect(() => {
    if (
      firstName &&
      lastName &&
      email &&
      ((repairWidgetStore.receiveQuote.code === contactMethodCode.phone && phone) ||
        repairWidgetStore.receiveQuote.code !== contactMethodCode.phone) &&
      ((storesDetails.location_id < 0 && postalCode) || storesDetails.location_id > 0) &&
      ((codeArray.includes(code) && address1 && city) || !codeArray.includes(code))
    ) {
      setDisableStatus(false)
    } else {
      setDisableStatus(true)
    }
  }, [firstName, lastName, email, phone, postalCode, address1, city])

  const SubmitAvailable = () => {
    if (
      firstName &&
      lastName &&
      email &&
      ValidateEmail(email) &&
      ((repairWidgetStore.receiveQuote.code === contactMethodCode.phone &&
        phone &&
        ValidatePhoneNumber(phone)) ||
        repairWidgetStore.receiveQuote.code !== contactMethodCode.phone) &&
      ((storesDetails.location_id < 0 && postalCode) || storesDetails.location_id > 0) &&
      ((codeArray.includes(code) && address1 && city) || !codeArray.includes(code))
    ) {
      return true
    }
    if (!firstName) {
      setFnErrTxt(t("Required."))
      setTimeout(() => {
        setFnErrTxt("")
      }, 3000)
    }
    if (!lastName) {
      setLnErrTxt(t("Required."))
      setTimeout(() => {
        setLnErrTxt("")
      }, 3000)
    }
    if (!email) {
      setEmlErrTxt(t("Required."))
      setTimeout(() => {
        setEmlErrTxt("")
      }, 3000)
    } else if (!ValidateEmail(email)) {
      setEmlErrTxt(t("Enter a valid email."))
      setTimeout(() => {
        setEmlErrTxt("")
      }, 3000)
    }
    if (repairWidgetStore.receiveQuote.code === contactMethodCode.phone) {
      if (!phone) {
        setPhErrTxt(t("Required."))
      } else if (!ValidatePhoneNumber(phone)) {
        setPhErrTxt(t("Enter a valid phone number."))
      }
      setTimeout(() => {
        setPhErrTxt("")
      }, 3000)
    }
    if (!address1) {
      setAd1ErrTxt(t("Required."))
      setTimeout(() => {
        setAd1ErrTxt("")
      }, 3000)
    }
    if (storesDetails.location_id < 0 && !postalCode) {
      setPsErrTxt(t("Required."))
      setTimeout(() => {
        setPsErrTxt("")
      }, 3000)
    }
    if (!city) {
      setCtErrTxt(t("Required."))
      setTimeout(() => {
        setCtErrTxt("")
      }, 3000)
    }
    return false
  }

  const handleButton = (param: string) => {
    if (!SubmitAvailable()) {
      return
    }
    setDisableStatus(true)
    if (param === "appointment") {
      setIsSubmiting([true, false])
    } else {
      setIsSubmiting([false, true])
    }
    if (storesDetails.location_id < 0) {
      findLocationAPI
        .findAddLocation(storesDetails.store_id, {
          city: city,
          state: "",
          postcode: postalCode,
          country: country.code,
        })
        .then((res: any) => {
          if (res.length && res[0].location_hours.length) {
            storesDetails.changeFindAddLocation(res)
            storesDetails.changeLocationID(res[0].id)
            storesDetails.changeCntUserLocation(makeLocations(res))
            handleSubmit(param)
          } else {
            setToastParams({
              msg: t("There is not available locations. Please input another Postal Code."),
              isWarning: true,
            })
            setIsSubmiting([false, false])
            setDisableStatus(false)
          }
        })
        .catch(() => {
          setToastParams({
            msg: t("Error to find location with Postal Code. Please input right Postal Code."),
            isError: true,
          })
          setIsSubmiting([false, false])
          setDisableStatus(false)
        })
      return
    } else {
      handleSubmit(param)
    }
  }

  const onKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && step === 6) {
        if (
          features.includes(featureToggleKeys.FRONTEND_REPAIR_APPOINTMENT) ||
          code === deliveryMethodCode.mailin
        ) {
          handleButton("appointment")
        } else if (features.includes(featureToggleKeys.FRONTEND_REPAIR_QUOTE)) {
          handleButton("quote")
        }
      }
    },
    [step, firstName, lastName, email, phone, address1, address2, country, city, postalCode]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false)
    return () => {
      document.removeEventListener("keydown", onKeyPress, false)
    }
  }, [step, firstName, lastName, email, phone, address1, address2, country, city, postalCode])

  const handleChangeFirstName = (val: string) => {
    setFirstName(val)
  }

  const handleChangeLastName = (val: string) => {
    setLastName(val)
  }

  const handleChangeEmail = (val: string) => {
    setEmail(val)
  }

  const handleChangeAddress1 = (val: string) => {
    setStreetAddress1(val)
  }

  const handleChangeAddress2 = (val: string) => {
    setStreetAddress2(val)
  }

  const handleChangeCity = (val: string) => {
    setCity(val)
  }

  const handleChangePostalCode = (val: string) => {
    setPostalCode(val)
  }

  const resetStatuses = () => {
    setToastParams({
      msg: "",
      isError: false,
      isWarning: false,
      isInfo: false,
      isSuccess: false,
    })
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography className="service-widget-title">{t(data.title)}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <div className="service-choose-device-container">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputComponent
                    value={firstName}
                    placeholder={t(data.placeholder.firstName)}
                    className="contact-detail-input"
                    handleChange={(e) => {
                      handleChangeFirstName(e.target.value)
                    }}
                    errorText={fnErrTxt}
                    border="rgba(0,0,0,0.1)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputComponent
                    value={lastName}
                    placeholder={t(data.placeholder.lastName)}
                    className="contact-detail-input"
                    handleChange={(e) => {
                      handleChangeLastName(e.target.value)
                    }}
                    errorText={lnErrTxt}
                    border="rgba(0,0,0,0.1)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputComponent
                    value={email}
                    placeholder={t(data.placeholder.emailAdd)}
                    className="contact-detail-input"
                    handleChange={(e) => {
                      handleChangeEmail(e.target.value)
                    }}
                    errorText={emlErrTxt}
                    border="rgba(0,0,0,0.1)"
                  />
                </Grid>
                <Grid item xs={storesDetails.location_id < 0 && !codeArray.includes(code) ? 6 : 12}>
                  <PhoneInput
                    handleSetPhone={setPhone}
                    className="contact-detail-input"
                    val={phone}
                    placeholder={t(data.placeholder.phoneNum)}
                    errorText={phErrTxt}
                  />
                </Grid>
                {storesDetails.location_id < 0 && !codeArray.includes(code) && (
                  <Grid item xs={6}>
                    <InputComponent
                      value={postalCode}
                      placeholder={t(data.placeholder.postalCode)}
                      className="contact-detail-input"
                      handleChange={(e) => {
                        handleChangePostalCode(e.target.value)
                      }}
                      errorText={psErrTxt}
                      border="rgba(0,0,0,0.1)"
                    />
                  </Grid>
                )}
              </Grid>
            </div>
            {codeArray.includes(code) && (
              <div className="service-choose-device-container">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputComponent
                      value={address1}
                      className="contact-detail-input"
                      placeholder={t(data.placeholder.address1)}
                      handleChange={(e) => {
                        handleChangeAddress1(e.target.value)
                      }}
                      errorText={ad1ErrTxt}
                      border="rgba(0,0,0,0.1)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputComponent
                      value={address2}
                      className="contact-detail-input"
                      placeholder={t(data.placeholder.address2)}
                      handleChange={(e) => {
                        handleChangeAddress2(e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomSelect
                      value={country}
                      handleSetValue={setCountry}
                      options={countriesData}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputComponent
                      value={city}
                      className="contact-detail-input"
                      placeholder={t(data.placeholder.city)}
                      handleChange={(e) => {
                        handleChangeCity(e.target.value)
                      }}
                      errorText={ctErrTxt}
                      border="rgba(0,0,0,0.1)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputComponent
                      value={postalCode}
                      className="contact-detail-input"
                      placeholder={t(data.placeholder.postalCode)}
                      handleChange={(e) => {
                        handleChangePostalCode(e.target.value)
                      }}
                      errorText={psErrTxt}
                      border="rgba(0,0,0,0.1)"
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            {!codeArray.includes(code) && (
              <div className="service-choose-device-container">
                <FeatureToggles features={features}>
                  <Feature
                    name={featureToggleKeys.FRONTEND_REPAIR_APPOINTMENT}
                    inactiveComponent={() => <></>}
                    activeComponent={() => (
                      <Button
                        title={t("Book Appointment")}
                        bgcolor={mainData.general.colorPalle.nextButtonCol}
                        borderR={themeType === "marnics" ? "0" : "20px"}
                        maxWidth="300px"
                        height="30px"
                        fontSize="17px"
                        margin="0 auto 10px"
                        onClick={() => handleButton("appointment")}
                        disable={disableStatus}
                      >
                        {isSubmiting[0] && <Loading />}
                      </Button>
                    )}
                  />
                </FeatureToggles>
                <FeatureToggles features={features}>
                  <Feature
                    name={featureToggleKeys.FRONTEND_REPAIR_QUOTE}
                    inactiveComponent={() => <></>}
                    activeComponent={() => (
                      <Button
                        title={t("Request a Quote")}
                        bgcolor={mainData.general.colorPalle.nextButtonCol}
                        borderR={themeType === "marnics" ? "0" : "20px"}
                        maxWidth="300px"
                        height="30px"
                        fontSize="17px"
                        margin="0 auto"
                        onClick={() => handleButton("quote")}
                        disable={disableStatus}
                      >
                        {isSubmiting[1] && <Loading />}
                      </Button>
                    )}
                  />
                </FeatureToggles>
              </div>
            )}
            {codeArray.includes(code) && (
              <div className="service-card-button">
                <Button
                  title={t("Next")}
                  bgcolor={mainData.general.colorPalle.nextButtonCol}
                  borderR="20px"
                  width="120px"
                  height="30px"
                  fontSize="17px"
                  onClick={() => handleButton("appointment")}
                  disable={disableStatus}
                />
                <p>{t("or press ENTER")}</p>
              </div>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="service-summary-card">
            <RepairSummary themeCol={themeCol} />
          </Card>
        </Grid>
      </Grid>
      <Toast params={toastParams} resetStatuses={resetStatuses} />
    </div>
  )
}

export default ContactDetails
