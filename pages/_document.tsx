import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="/static/style/font.css" rel="preload stylesheet" as="style" />
        </Head>

        <body>
          <Main />
        </body>

        <NextScript />
      </Html>
    )
  }
}
