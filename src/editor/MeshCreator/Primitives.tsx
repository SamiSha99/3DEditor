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
            <GenerateSphere />
            <GenerateCylinder />
            <GeneratePlane />
        </>
    )
}

const GenerateBox = () => {
    const {pushComponentToScene} = useStores()
    const createNewBox = () => pushComponentToScene(<Box />)
    return (<button onClick={createNewBox}>Cube</button>)
}

const GenerateSphere = () => {
    const {pushComponentToScene} = useStores()
    const newSphere = () => pushComponentToScene(<Sphere />)
    return (<button onClick={newSphere}>Sphere</button>)
}

const GenerateCylinder = () => {
    const {pushComponentToScene} = useStores()
    const newCylinder = () => pushComponentToScene(<Cylinder />)
    return (<button onClick={newCylinder}>Cylinder</button>)
}

const GeneratePlane = () => {
    const {pushComponentToScene} = useStores()
    const newPlane = () => pushComponentToScene(<Plane />)
    return (<button onClick={newPlane}>Plane</button>)
}

const Box:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Box
            material={new THREE.MeshStandardMaterial()}
            onClick={(e) => {e.stopPropagation(), setControlsTarget(e.object)}}
            onPointerMissed={(e) => {e.stopPropagation()}}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
        />
    )
}

const Sphere:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    const ref = useRef(null!);
    useCursor(hovered)
    return(
        <_Sphere
            ref={ref}
            material={new THREE.MeshStandardMaterial()}
            onClick={(e) => {e.stopPropagation(), setControlsTarget(e.object)}}
            onPointerMissed={(e) => {e.stopPropagation()}}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
        />
    )
}

const Cylinder:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Cylinder
            material={new THREE.MeshStandardMaterial()}
            onClick={(e) => {e.stopPropagation(), setControlsTarget(e.object)}}
            onPointerMissed={(e) => {e.stopPropagation()}}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
        />
    )
}

const Plane:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    useCursor(hovered)
    return(
        <_Plane
            material={new THREE.MeshStandardMaterial()}
            onClick={(e) => {e.stopPropagation(), setControlsTarget(e.object)}}
            onPointerMissed={(e) => {e.stopPropagation()}}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
        />
    )
}
