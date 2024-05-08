// import { useStores } from "../../App"
// import * as THREE from 'three'
// import { useRef, useState } from "react"
// import { ThreeEvent } from "@react-three/fiber"

// export class EditorObject {
//     component: THREE.Object3D | null = null;
    
//     constructor(component?: THREE.Object3D, name?: string)
//     {
//         this.component = component ? component : null;
//         if(name)
//             this.component!.name = name;
//     }

//     render() {
//         return this.component && <EditorObjectNode node={this} />;
//     }
// }

// export const EditorObjectNode:React.FC<{node: EditorObject}> = ({node}) => {
//     const [hovered, setHovered] = useState(false);
//     const [selected, setSelect] = useState(false);
//     const ref = useRef(null!);

//     return (
//         <>
//             {
//                 node.component &&
//                 <primitive
//                     ref={ref}
//                     key={node.component?.id}
//                     object={node.component}
//                     onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), !selected && setSelect(true)}}
//                     onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), selected && setSelect(false)}}
//                     onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
//                     onPointerOut={() => (setHovered(false))} 
//                 />
//             }
//         </>
//     )
// }
