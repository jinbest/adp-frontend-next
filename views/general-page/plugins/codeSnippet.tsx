import type { CellPlugin } from "@react-page/editor"
import React from "react"
import CodeSnippet from "../comp/CodeSnippet"
import { isEmpty } from "lodash"

const codeSnippet: CellPlugin<{
  code: string
  language: string
}> = {
  Renderer: ({ data }) => {
    return !isEmpty(data) && data.code && data.language ? (
      <CodeSnippet language={data.language} code={data.code} />
    ) : null
  },
  id: "code-snippet",
  title: "Code snippet",
  description: "A code snippet",
  version: 1,
  controls: {
    type: "autoform",
    schema: {
      properties: {
        language: {
          type: "string",
        },
        code: {
          type: "string",
          uniforms: {
            multiline: true,
          },
        },
      },
      required: ["code"],
    },
  },
}
export default codeSnippet
