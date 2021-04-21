import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="../index.css?family=Poppins+Bold" rel="preload stylesheet" as="style" />
          <link href="../index.css?family=Poppins+Regular" rel="preload stylesheet" as="style" />
        </Head>

        <body>
          <Main />
        </body>

        <NextScript />
      </Html>
    )
  }
}
