import * as THREE from 'three';
import { Box, Cylinder, Plane, Sphere, useCursor } from '@react-three/drei';
import { useState } from 'react';
import { useStores } from '../../App';


export const AddCube = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewBox = () => {
        const newBox = <Box 
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
    
    return (<button onClick={createNewBox}>Cube</button>)
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
    
    return (<button onClick={createNewBox}>Sphere</button>)
}

export const AddCylinder = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewCylinder = () => {
        const newCylinder =
                <Cylinder 
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
            
            pushPrimitive(newCylinder)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewCylinder}>Cylinder</button>)
}

export const AddPlane = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewPlane = () => {
        const newPlane =
                <Plane 
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
            
            pushPrimitive(newPlane)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewPlane}>Plane</button>)
}