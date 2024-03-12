import * as THREE from 'three';
import { Box, Sphere, useCursor } from '@react-three/drei';
import { useState } from 'react';
import { useStores } from '../../App';


export const AddBox = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewBox = () => {
        const newBox =
                <Box 
                material={new THREE.MeshStandardMaterial()}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation()
                    setControlsTarget(e.object.id)
                }}
                onPointerMissed={(e) => {
                    e.stopPropagation()
                }}
                onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))}
                />
            
            pushPrimitive(newBox)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewBox}>Add Box</button>)
}

export const AddSphere = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewBox = () => {
        const newBox =
                <Sphere 
                material={new THREE.MeshStandardMaterial()}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation()
                    setControlsTarget(e.object.id)
                }}
                onPointerMissed={(e) => {
                    e.stopPropagation()
                }}
                onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))}
                />
            
            pushPrimitive(newBox)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewBox}>Add Sphere</button>)
}