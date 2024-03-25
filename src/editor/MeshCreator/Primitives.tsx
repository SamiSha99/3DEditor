import * as THREE from 'three';
import { 
    Box as _Box, 
    Cylinder as _Cylinder, 
    Plane as _Plane, 
    Sphere as _Sphere, 
    useCursor } from '@react-three/drei';
import { ReactNode, useRef, useState } from 'react';
import { useStores } from '../../App';

export function GenerateBox(pushComponentToScene: (node: ReactNode) => void) {pushComponentToScene(<Box />)}
export function GenerateSphere(pushComponentToScene: (node: ReactNode) => void) {pushComponentToScene(<Sphere />)}
export function GenerateCylinder(pushComponentToScene: (node: ReactNode) => void) {pushComponentToScene(<Cylinder />)}
export function GeneratePlane(pushComponentToScene: (node: ReactNode) => void) {pushComponentToScene(<Plane />)}

const Box:React.FC<{}> = () => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    const ref = useRef<THREE.Mesh>(null!);
    useCursor(hovered)
    return(
        <_Box
            ref={ref}
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
