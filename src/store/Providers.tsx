import { ReactNode } from "react"
import { Viewport, ViewportContext } from "./Viewport"
import { Editor, EditorContext } from "@orb_Editor"

type EditorComponent = { editor: Editor, children: ReactNode }
export const EditorProvider = ({ editor, children }: EditorComponent) => { return <EditorContext.Provider value={editor} children={children} /> }

type ViewportComponent = { viewport: Viewport, children: ReactNode }
export const ViewportProvider = ({ viewport, children }: ViewportComponent) => { return <ViewportContext.Provider value={viewport} children={children} /> }