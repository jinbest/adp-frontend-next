import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="https://storage.googleapis.com/adp_assets/fonts/Poppins-Bold.ttf?family=Poppins+Bold&display=swap"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://storage.googleapis.com/adp_assets/fonts/Poppins-Regular.ttf?family=Poppins+Regular&display=swap"
            as="font"
            crossOrigin="anonymous"
          />
        </Head>

        <body>
          <Main />
        </body>

        <NextScript />
      </Html>
    )
  }
}
