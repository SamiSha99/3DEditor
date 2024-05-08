import {} from '@react-three/fiber'
import {} from '@react-three/drei'
import EditorCanvas from './EditorCanvas'
import EditorUI from './EditorUI'

export function Editor() {
    
    return (
        <>
            <EditorUI />
            <EditorCanvas />
        </>
    )
}



export default Editor