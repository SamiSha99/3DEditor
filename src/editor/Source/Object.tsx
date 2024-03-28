import { useStores } from "../../App"
import * as THREE from 'three'
import { useRef, useState } from "react"
import { ThreeEvent } from "@react-three/fiber"

export class EditorObject {
    component: THREE.Object3D | null = null;

    constructor(component?: THREE.Object3D)
    {
        this.component = component ? component : null;
    }

    render() {
        return this.component && <EditorObjectNode component={this.component} />;
    }
}

export const EditorObjectNode:React.FC<{component: THREE.Object3D}> = ({component}) => {
    const [hovered, setHovered] = useState(false);
    const {setControlsTarget} = useStores();
    const ref = useRef(null!);

    // [verify!] primitive seems rather dangerous considering its a manual dispose, better solution for this?
    // does it auto dispose? needs testing!
    return (
        <>
            <primitive
                ref={ref}
                key={component.id}
                object={component}
                onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), setControlsTarget(e.object)}}
                onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation()}}
                onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))} 
            />
        </>
    )
}
