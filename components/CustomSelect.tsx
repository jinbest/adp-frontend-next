import React, { useState, useEffect } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
  })
)

type Props = {
  options: any[]
  value: any
  handleSetValue: (val: any) => void
  variant?: "filled" | "outlined" | "standard" | undefined
}

const CustomSelect = ({ options, value, handleSetValue, variant }: Props) => {
  const classes = useStyles()

  const [state, setState] = useState<{ code: string; name: string }>({
    code: value.code,
    name: value.name,
  })

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state
    for (let i = 0; i < options.length; i++) {
      if (options[i].code === event.target.value) {
        handleSetValue({ name: options[i].name, code: options[i].code })
        break
      }
    }
    setState({
      ...state,
      [name]: event.target.value,
    })
  }

  useEffect(() => {
    setState({ code: value.code, name: value.name })
  }, [value])

  return (
    <div>
      <FormControl
        className={classes.root}
        variant={variant ?? "outlined"}
        disabled={options.length === 0}
      >
        <Select
          value={state.code}
          onChange={handleChange}
          inputProps={{
            name: "code",
          }}
          className={"custom-select"}
        >
          {options.map((item: any, index: number) => {
            return (
              <MenuItem className={"custom-select"} value={item.code} key={index}>
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </div>
  )
}

export default CustomSelect
