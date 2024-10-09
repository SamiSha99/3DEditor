import EditorInspector from './Inspector'
import { ActivePanels } from '@orb_UI/ActivePanels'
import { MenuBar } from '@orb_UI/Menubar'
export function Editor() {

    return (
        <div style={{ display: "flex", flexWrap: "wrap", height: "100vh", width: "100vw", overflow: "hidden" }}>
            <MenuBar />
            <EditorInspector />
            <ActivePanels />
        </div>
    )
}

export default Editor