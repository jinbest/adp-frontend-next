import React from "react"
import { AppProps } from "next/app"
import "../static/style/index.scss"
import "../static/style/theme.css"

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default App
