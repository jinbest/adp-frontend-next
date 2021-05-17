import React from "react"
import Editor, { Value } from "@react-page/editor"
import { cellPlugins } from "./plugins/cellPlugins"
// import "./react-page-editor.scss"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface ReactPageEditorProps {
  value: Value
}

const ReactPageEditor = ({ value }: ReactPageEditorProps) => {
  return (
    <div className="react-editor-container custom-scroll-bar">
      <DndProvider backend={HTML5Backend}>
        <Editor cellPlugins={cellPlugins} value={value} readOnly={true} />
      </DndProvider>
    </div>
  )
}

export default ReactPageEditor
