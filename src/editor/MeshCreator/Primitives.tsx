import * as THREE from 'three';
import { 
    Box as _Box, 
    Cylinder as _Cylinder, 
    Plane as _Plane, 
    Sphere as _Sphere, 
    useCursor } from '@react-three/drei';
import { useState } from 'react';
import { useStores } from '../../App';

export const Box = () => {
    const {setControlsTarget, pushPrimitive, sceneComponents} = useStores()
    const [hovered, setHovered] = useState(false)
    const createNewBox = () => {
        const newBox = <_Box 
            key={sceneComponents.length}
            material={new THREE.MeshStandardMaterial()}
            onClick={(e) => {
                e.stopPropagation()
                setControlsTarget(e.object)
            }}
            onPointerMissed={(e) => {
                e.stopPropagation()
            }}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
            />
        pushPrimitive(newBox)
    }
    
    // useCursor(hovered)
    
    return (<button onClick={createNewBox}>Cube</button>)
}

export const Sphere = () => {
    const {setControlsTarget, pushPrimitive, sceneComponents} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewSphere = () => {
        const newSphere = <_Sphere
            key={sceneComponents.length}
            material={new THREE.MeshStandardMaterial()}
            position={[0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation()
                setControlsTarget(e.object)
            }}
            onPointerMissed={(e) => {
                e.stopPropagation()
            }}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
            />   
        pushPrimitive(newSphere)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewSphere}>Sphere</button>)
}

export const Cylinder = () => {
    const {setControlsTarget, pushPrimitive, sceneComponents} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewCylinder = () => {
        const newCylinder = <_Cylinder
            key={sceneComponents.length}
            material={new THREE.MeshStandardMaterial()}
            position={[0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation()
                setControlsTarget(e.object)
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

export const Plane = () => {
    const {setControlsTarget, pushPrimitive, sceneComponents} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewPlane = () => {
        const newPlane = <_Plane 
            key={sceneComponents.length}
            material={new THREE.MeshStandardMaterial()}
            position={[0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation()
                setControlsTarget(e.object)
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