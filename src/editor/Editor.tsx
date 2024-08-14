import EditorUI from './EditorUI'
import EditorInspector from './EditorInspector'
import Canvas from './Canvas'
import { ActivePanels } from '@orb_UI/panels/ActivePanels'

export function Editor() {
    
    return (
        <div style={{
            display:"flex", 
            flexWrap: "wrap", 
            height:"100%", 
            width:"100%"}}>
            <EditorUI />
            <Canvas />
            <EditorInspector />
            <ActivePanels />
        </div>
    )
}

export default Editor