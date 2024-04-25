import { useStores } from "../../App"
import * as THREE from 'three'
import { useRef, useState } from "react"
import { ThreeEvent } from "@react-three/fiber"
import { Pane } from 'tweakpane';
import { AppStore } from "../../store/AppStore";

export class EditorObject {
    component: THREE.Object3D | null = null;
    
    constructor(component?: THREE.Object3D, name?: string)
    {
        this.component = component ? component : null;
        if(name)
            this.component!.name = name;
    }
    
    // The renderer to directly modify the selected component, maybe super call?
    renderGUI() {
        return (
            <p style={{position:"absolute", right:"0"}}>{this.component?.id}</p>
        )
    }

    render() {
        return this.component && <EditorObjectNode node={this} />;
    }
}

export const EditorObjectNode:React.FC<{node: EditorObject}> = ({node}) => {
    const [hovered, setHovered] = useState(false);
    const {setControlsTarget} = useStores();
    const ref = useRef(null!);

    return (
        <>
            {
                node.component &&
                <primitive
                    ref={ref}
                    key={node.component?.id}
                    object={node.component}
                    onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation()}}
                    onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation()}}
                    onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
                    onPointerOut={() => (setHovered(false))} 
                />
            }
        </>
    )
}
