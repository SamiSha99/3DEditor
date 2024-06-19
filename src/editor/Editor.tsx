import {} from '@react-three/fiber'
import {} from '@react-three/drei'
import EditorCanvas from './EditorCanvas'
import EditorUI from './EditorUI'
import EditorInspector from './EditorInspector'

export function Editor() {
    
    return (
        <div style={{
            display:"flex", 
            flexWrap: "wrap", 
            height:"100%", 
            width:"100%"}}>
            <EditorUI />
            <EditorCanvas />
            <EditorInspector />
        </div>
    )
}

export default Editor