import { useStores } from "../../App"
import * as THREE from 'three'
import React, { useRef } from 'react'
import { useState } from "react"
import { ThreeEvent } from "@react-three/fiber"

export const Model:React.FC<{scene: THREE.Group<THREE.Object3DEventMap>}> = ({scene}) => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    const ref = useRef<THREE.Scene>(null!);
    
    return (
        <primitive 
            ref={ref}
            object={scene}
            onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), setControlsTarget(e.object)}}
            onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation()}}
            onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))} 
        />
    )
}