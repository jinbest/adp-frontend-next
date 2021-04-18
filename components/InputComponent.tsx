import React from "react"
import { InputBase } from "@material-ui/core"

type Props = {
  color?: string
  bgcolor?: string
  border?: string
  height?: string
  placeholder?: string
  value?: string
  handleChange: (event: React.ChangeEvent<{ value: string }>) => void
  errorText?: string
}

const InputComponent = ({
  color,
  bgcolor,
  border,
  height,
  placeholder,
  value,
  handleChange,
  errorText,
}: Props) => {
  return (
    <React.Fragment>
      <InputBase
        className={"input-component"}
        style={{
          color: color,
          background: bgcolor,
          border: errorText ? "1px solid red" : `1px solid ${border}`,
          height: height,
        }}
        placeholder={placeholder || ""}
        value={value ?? ""}
        onChange={handleChange}
      />
      {errorText && (
        <span style={{ color: "red", fontSize: "13px", marginLeft: "20px" }}>{errorText}</span>
      )}
    </React.Fragment>
  )
}

export default InputComponent
