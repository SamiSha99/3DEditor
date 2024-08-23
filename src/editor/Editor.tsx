import EditorUI from './UI'
import EditorInspector from './Inspector'
import Canvas from './Canvas'
import { ActivePanels } from '@orb_UI/ActivePanels'

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