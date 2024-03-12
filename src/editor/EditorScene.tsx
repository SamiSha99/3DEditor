import * as THREE from 'three';
import { Camera, Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Grid, OrbitControls, PivotControls, Select, TransformControls } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useControls } from 'leva';
import { CreateBox } from './PrimitiveCreator/CreateBox';


// let boxes[] = undefined;

export const EditorScene = observer(() => {
    const [showControls, setShowControls] = useState<boolean>(false)
    const [selectedMeshID, selectMesh] = useState<number>(-1);
    // const {enableGrid} = useControls({enableGrid: true})
    return (
        <>
        {/* <button onClick={boxes.add(CreateBox)}><p>aaa </p></button> */}
        <Canvas camera={{position:[-2,2,0]}}>
            
            {/* {enableGrid && <Grid infiniteGrid />} */}
            <ambientLight intensity={1.0} />
            <directionalLight intensity={0.5} position={[0,2,0]} />
            <Select onChange={(selected) => console.log(selected)} onChangePointerUp={(selected) => console.log(selected)}>
                <RenderModel selectModel={(id) => {selectMesh(id)}} position={[1,0,1]}/>
                <RenderModel selectModel={(id) => {selectMesh(id)}} position={[1,0,-1]}/>
            </Select>
                {selectedMeshID != -1 && <Controls meshID={selectedMeshID} />}
            <CameraControls makeDefault />
        </Canvas>        
        </>
    )
})

const Controls = (meshID: number) => {
    const {scene} = useThree();
    const refTransformControls = useRef<any>();
    return (
        <>
            <TransformControls ref={refTransformControls} object={scene.getObjectById(meshID.meshID)} />
            {/* {console.log((refTransformControls.current))} */}
        </>
    );
}

const RenderModel:React.FC<{selectModel: (id: number)  => void, position:[number,number,number]}> =({selectModel, position}) => {
    const ref = useRef<THREE.Mesh>(null);
    return(
        <Box 
        ref={ref}
        position={position}
        onClick={(e) => {e.stopPropagation(), selectModel(ref.current.id)}}
        />
    )
}




export default EditorScene