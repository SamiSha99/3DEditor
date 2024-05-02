import { useRef, useState } from "react"
import { ThreeEvent } from "@react-three/fiber"
import { Billboard, Helper, Text } from "@react-three/drei";
import { EditorObject } from "./EditorObject";
import { VertexNormalsHelper } from "three/examples/jsm/Addons.js";
import { Mesh } from "three";

export class EditorObjectButton extends EditorObject {
    
    render() {
        return this.component && <EditorObjectNodeButton node={this} />;
    }
}

export const EditorObjectNodeButton:React.FC<{node: EditorObjectButton}> = ({node}) => {
    const [hovered, setHovered] = useState(false);
    const [selected, setSelect] = useState(false);
    const ref = useRef(null!);
    
    return (
        <>
            {
                node.component &&
                <primitive
                    ref={ref}
                    key={node.component?.id}
                    object={node.component}
                    onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), !selected && setSelect(true)}}
                    onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), selected && setSelect(false)}}
                    onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
                    onPointerOut={() => (setHovered(false))} 
                    children={
                        <></>
                        // <Helper type={VertexNormalsHelper} args={[0.01, 0x00ffff]} />
                    }
                />
            }
        </>
    )
}
