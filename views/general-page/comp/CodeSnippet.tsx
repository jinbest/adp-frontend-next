// lazy load this file to keep initial bundle small

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus as style } from "react-syntax-highlighter/dist/cjs/styles/prism"
import React from "react"

type Props = {
  code: string
  language: string
}

const CodeSnippet = ({ code, language }: Props) => (
  <SyntaxHighlighter wrapLongLines language={language} style={style}>
    {code}
  </SyntaxHighlighter>
)

export default CodeSnippet
