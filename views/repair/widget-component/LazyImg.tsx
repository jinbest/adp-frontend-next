import React, { useEffect, useRef, useState } from "react"
import { storesDetails } from "../../../store"

type Props = {
  src: string
  style?: any
  alt?: string
}

const LazyImg = ({ src, style, alt }: Props) => {
  const imgRef = useRef<HTMLImageElement>({} as HTMLImageElement)
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    imgRef.current.style.visibility = "hidden"
  }, [])

  useEffect(() => {
    if (imgRef.current.style.visibility === "hidden") {
      setLoader(true)
    } else {
      setLoader(false)
    }
  }, [imgRef])

  const VisibleImg = () => {
    imgRef.current.style.visibility = "visible"
    setLoader(false)
  }

  return (
    <React.Fragment>
      <img src={src} style={style} alt={alt} ref={imgRef} onLoad={VisibleImg} />
      {loader && (
        <img
          src={storesDetails.commonCnts.loaderGif}
          style={{ opacity: 0.1, position: "absolute", top: "0%", maxWidth: "100%" }}
          alt="img-loader"
        />
      )}
    </React.Fragment>
  )
}

export default LazyImg
