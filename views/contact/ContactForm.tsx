import React, { useState, useEffect } from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography, IconButton } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { ToastMsgParams } from "../../components/toast/toast-msg-params"
import Toast from "../../components/toast/toast"
import Loading from "../../components/Loading"
import { InputComponent, Button, PhoneInput, CustomSelect } from "../../components"
import { ContactSubmitParams } from "../../model/contact-submit-param"
import { Card } from "../repair/widget-component"
import { contactAPI } from "../../services"
import { StoresDetails } from "../../store/StoresDetails"
import { makeLocations, ValidateEmail } from "../../services/helper"
import { Close } from "@material-ui/icons"

type OptionProps = {
  name: string
  code: number
}

type Props = {
  locations: any[]
  locationID: number
  handleLocationID: (id: number) => void
  storesDetailsStore: StoresDetails
}

const ContactForm = ({ locations, locationID, handleLocationID, storesDetailsStore }: Props) => {
  const mainData = storesDetailsStore.storeCnts
  const thisPage = mainData.contactPage.contactForm
  const [t] = useTranslation()
  const classes = useStyles()

  const [firstName, setFirstName] = useState("")
  const [fnErrTxt, setFnErrTxt] = useState("")
  const [lastName, setLastName] = useState("")
  const [lnErrTxt, setLnErrTxt] = useState("")
  const [email, setEmail] = useState("")
  const [emlErrTxt, setEmlErrTxt] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [phone, setPhone] = useState("")
  const [option, setOption] = useState<OptionProps[]>([{ name: "", code: 0 }])
  const [loc, setLoc] = useState<OptionProps>({ name: "", code: 0 })
  const [message, setMessage] = useState("")
  const [msgErrTxt, setMsgErrTxt] = useState("")
  const [toastParams, setToastParams] = useState<ToastMsgParams>({} as ToastMsgParams)
  const [isSubmit, setIsSubmit] = useState(false)
  const [disableStatus, setDisableStatus] = useState(true)
  const [contacted, setContacted] = useState(false)

  const handleChangeFirstName = (val: string) => {
    setFirstName(val)
  }

  const handleChangeLastName = (val: string) => {
    setLastName(val)
  }

  const handleChangeEmail = (val: string) => {
    setEmail(val)
  }

  const handleChangeCompanyName = (val: string) => {
    setCompanyName(val)
  }

  const handleStoreCntLoc = (index: number) => {
    if (!locations.length) return
    storesDetailsStore.changeCntUserLocation(makeLocations([locations[index]]))
    storesDetailsStore.changeLocationID(locations[index].id)
  }

  useEffect(() => {
    if (locations.length) {
      for (let i = 0; i < locations.length; i++) {
        if (locationID && locationID === locations[i].id) {
          setLoc({ name: locations[i].address_1, code: i })
          break
        }
      }
    }
  }, [locationID])

  useEffect(() => {
    const cntOptions: OptionProps[] = []
    if (locations.length) {
      for (let i = 0; i < locations.length; i++) {
        cntOptions.push({ name: locations[i].address_1, code: i })
      }
      setOption(cntOptions)
    }
  }, [locations])

  useEffect(() => {
    if (firstName && lastName && email && loc.name && message) {
      setDisableStatus(false)
    } else {
      setDisableStatus(true)
    }
  }, [firstName, lastName, email, loc, message])

  const SubmitAvailable = () => {
    if (firstName && lastName && email && ValidateEmail(email) && loc.name && message.length > 5) {
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
    if (!message) {
      setMsgErrTxt(t("Required."))
      setTimeout(() => {
        setMsgErrTxt("")
      }, 3000)
    } else if (message.length <= 5) {
      setMsgErrTxt(t("Text is too less."))
      setTimeout(() => {
        setMsgErrTxt("")
      }, 3000)
    }
    return false
  }

  const handleSubmit = () => {
    if (!SubmitAvailable()) {
      return
    }
    setDisableStatus(true)
    setIsSubmit(true)

    const params = {} as ContactSubmitParams
    params.store_id = locations[loc.code].store_id
    params.location_id = locations[loc.code].id
    params.customer_first_name = firstName
    params.customer_last_name = lastName
    params.customer_email = email
    params.customer_phone = phone
    params.customer_note = message
    params.is_read = false
    params.company_name = companyName

    contactAPI
      .postContactForm(params)
      .then(() => {
        // setToastParams({
        //   msg: "Request Sent Successfully",
        //   isSuccess: true,
        // })
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setLoc({ name: "", code: 0 })
        setMessage("")
        setIsSubmit(false)
        setCompanyName("")
        setContacted(true)
      })
      .catch(() => {
        setToastParams({
          msg: t("Something went wrong, please try again or contact us."),
          isError: true,
        })
        setIsSubmit(false)
        setDisableStatus(false)
      })
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

  const handleChangeSelect = (loc: any) => {
    if (storesDetailsStore.cntUserLocationSelected) {
      handleStoreCntLoc(loc.code)
    }
    handleLocationID(locations[loc.code].id)
  }

  return (
    <section className={"Container contact-form"}>
      <div className={classes.root}>
        {!contacted ? (
          <Card className={classes.card}>
            <Typography className={classes.title}>{t(thisPage.title)}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputComponent
                  value={firstName}
                  placeholder={t(thisPage.placeHolder.fName)}
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
                  placeholder={t(thisPage.placeHolder.lName)}
                  handleChange={(e) => {
                    handleChangeLastName(e.target.value)
                  }}
                  errorText={lnErrTxt}
                  border="rgba(0,0,0,0.1)"
                />
              </Grid>
              <Grid item xs={12}>
                <InputComponent
                  value={companyName}
                  placeholder={t(thisPage.placeHolder.companyName)}
                  handleChange={(e) => {
                    handleChangeCompanyName(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputComponent
                  value={email}
                  placeholder={t(thisPage.placeHolder.email)}
                  handleChange={(e) => {
                    handleChangeEmail(e.target.value)
                  }}
                  errorText={emlErrTxt}
                  border="rgba(0,0,0,0.1)"
                />
              </Grid>
              <Grid item xs={12}>
                <PhoneInput
                  handleSetPhone={setPhone}
                  val={phone}
                  placeholder={t(thisPage.placeHolder.phone)}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomSelect
                  value={loc}
                  handleSetValue={(loc) => {
                    handleChangeSelect(loc)
                  }}
                  options={option}
                />
              </Grid>
              <Grid item xs={12}>
                <div
                  className={classes.messageDiv}
                  style={{ border: msgErrTxt ? "1px solid red" : "1px solid rgba(0,0,0,0.1)" }}
                >
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                    }}
                    minLength={5}
                    maxLength={1000}
                    placeholder={`${t(thisPage.placeHolder.message)}*`}
                    className={classes.textArea}
                  />
                </div>
                {msgErrTxt && (
                  <span style={{ color: "red", fontSize: "13px", marginLeft: "20px" }}>
                    {msgErrTxt}
                  </span>
                )}
              </Grid>
            </Grid>
            <Button
              title={t(thisPage.button.submit)}
              bgcolor={mainData.general.colorPalle.nextButtonCol}
              borderR="20px"
              width="120px"
              height="30px"
              margin="20px 0 0"
              fontSize="17px"
              onClick={handleSubmit}
              disable={disableStatus}
            >
              {isSubmit && <Loading />}
            </Button>
          </Card>
        ) : (
          <Card className={classes.card}>
            <IconButton
              aria-label="close"
              className={classes.closeButtonDiv}
              onClick={() => {
                setContacted(false)
              }}
            >
              <Close />
            </IconButton>
            <Typography className={classes.title}>
              {`${t(thisPage.tracing.titlePrefix)} ${storesDetailsStore.storesDetails.name}`}
            </Typography>
            <Typography className={classes.content} id="contact-tracking-form">
              {t(thisPage.tracing.content)}
            </Typography>
          </Card>
        )}
        <Toast params={toastParams} resetStatuses={resetStatuses} />
      </div>
    </section>
  )
}

export default ContactForm

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ["@media (max-width:425px)"]: {
        marginBottom: "100px",
      },
    },
    card: {
      padding: "50px 30px",
      height: "auto",
      minHeight: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      ["@media (max-width:600px)"]: {
        padding: "40px 20px",
      },
    },
    closeButtonDiv: {
      position: "absolute",
      right: "15px",
      top: "15px",
    },
    title: {
      fontSize: "25px",
      fontWeight: "bold",
      textAlign: "center",
      paddingBottom: "20px",
      ["@media (max-width:400px)"]: {
        fontSize: "20px",
      },
    },
    content: {
      fontSize: "18px",
      textAlign: "center",
      marginTop: "20px",
      ["@media (max-width:400px)"]: {
        fontSize: "15px",
      },
    },
    messageDiv: {
      border: "1px solid rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      width: "100%",
      height: "300px",
      overflow: "hidden",
    },
    textArea: {
      border: "none",
      margin: "20px",
      fontSize: "15px",
      width: "87%",
      outline: "none",
      height: "250px",
      ["@media (max-width:600px)"]: {
        fontSize: "3vw",
      },
    },
    getQuote: {
      width: "170px",
      fontSize: "13px!important" as any,
      [theme.breakpoints.down("sm")]: {
        width: "120px",
        fontSize: "12px!important" as any,
      },
      [theme.breakpoints.down("xs")]: {
        width: "80px",
        fontSize: "10px!important" as any,
      },
    },
  })
)
