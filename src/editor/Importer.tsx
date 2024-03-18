import { ThreeEvent, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF, GLTFLoader, USDZLoader } from "three/examples/jsm/Addons.js";
import { useStores } from "../App";
import { useAnimations } from "@react-three/drei";
import { useEffect, useState } from "react";

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export const Importer = () => {
    const {pushPrimitive} = useStores();

    const handleEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files as FileList;
        const buffer = files[0].arrayBuffer().then((value) => {
            const type = files[0].name.match(EXTENSION_REGEX)?.[0];
            new GLTFLoader().parse(value, "", (gltf) => {
                console.log(gltf);
                pushPrimitive(<ModelGLTF gltf={gltf} />)
            })
        
            switch(type) {
                default: console.log("how are you doing?");    
            }
        }).catch((error) => {
            console.error("Whoops, array buffer did an oopsy! Error:", error)
        })
        console.log(buffer);
    }

    return <input type="file" accept=".gltf, .glb, .usdz" onChange={e=> handleEvent(e) } />
}


// to-do: the selector works like a charm in passing the control target but what if someone wants to control the group instead?
// to-do: select either children or group option!
const ModelGLTF:React.FC<{gltf: GLTF}> = ({gltf}) => {
    const [hovered, setHovered] = useState(false)
    const {setControlsTarget} = useStores()
    
    // const {actions, names} = useAnimations(gltf.animations)
    // console.log(actions, names);
    // useEffect(() => {
        // actions[names[0]]?.play();
    // }, [actions, names])
    return (
        <primitive 
            object={gltf.scene}
            onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), setControlsTarget((e.object as THREE.Object3D).parent)}}
            onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation()}}
            onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))} 
        />
    )
}
