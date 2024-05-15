import {} from '@react-three/fiber'
import {} from '@react-three/drei'
import EditorCanvas from './EditorCanvas'
import EditorUI from './EditorUI'

export function Editor() {
    
    return (
        <div style={{
            display:"flex", 
            flexWrap: "wrap", 
            height:"100vh", 
            width:"100%"}}>
            <EditorUI />
            <EditorCanvas />
        </div>
    )
}



export default Editor