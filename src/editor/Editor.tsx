import {} from '@react-three/fiber'
import {} from '@react-three/drei'
import EditorScene from './EditorScene'
import EditorUI from './EditorUI'

export function Editor() {

    return (
        <>
            <EditorUI />
            <EditorScene />
        </>
    )
}



export default Editor