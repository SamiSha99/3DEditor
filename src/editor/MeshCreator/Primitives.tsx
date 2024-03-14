import * as THREE from 'three';
import { 
    Box as _Box, 
    Cylinder as _Cylinder, 
    Plane as _Plane, 
    Sphere as _Sphere, 
    useCursor } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useStores } from '../../App';



export const PrimitiveList = () => {
    return (
        <>
            <GenerateBox />
            <GenerateSphere/>
            <GenerateCylinder />
            <GeneratePlane />
        </>
    )
}

export const GenerateBox = () => {
    const {pushPrimitive} = useStores()
    const createNewBox = () => {
        const box = <Box />
        pushPrimitive(box)
    }
    return (<button onClick={createNewBox}>Cube</button>)
}

const Box:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Box
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
    )
}

export const GenerateSphere = () => {
    const {pushPrimitive} = useStores()
    const newSphere = () => {
        const sphere = <Sphere />
        pushPrimitive(sphere)
    }
    return (<button onClick={newSphere}>Sphere</button>)
}

const Sphere:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Sphere
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
    )
}

export const GenerateCylinder = () => {
    const {pushPrimitive} = useStores()
    const newCylinder = () => {
        const cylinder = <Cylinder />
        pushPrimitive(cylinder)
    }
    return (<button onClick={newCylinder}>Cylinder</button>)
}


const Cylinder:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Cylinder
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
    )
}

export const GeneratePlane = () => {
    const {pushPrimitive} = useStores()
    const newPlane = () => {
        const plane = <Plane />
        pushPrimitive(plane)
    }
    return (<button onClick={newPlane}>Plane</button>)
}

const Plane:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Plane
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
    )
}
