import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="/static/style/font.css" rel="preload stylesheet" as="style" />
          <link
            rel="preload stylesheet"
            href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
            as="style"
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
