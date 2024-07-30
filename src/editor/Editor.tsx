import EditorUI from './EditorUI'
import EditorInspector from './EditorInspector'
import Canvas from './Canvas'

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
        </div>
    )
}

export default Editor