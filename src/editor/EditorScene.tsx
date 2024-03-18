import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, TransformControls } from '@react-three/drei';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';
import * as THREE from 'three';

export const EditorScene = observer(() => {
    const {controlsTarget, controlsObject3D, controlsMode, controlsSpace, sceneComponents} = useStores()
    return (
        <Canvas shadows camera={{position:[-2.5,2.5,0]}}>
            <Box material-color={"red"} scale={[0.1,0.01,0.1]} position={[0,0,0] } />
            <Grid cellColor={"#2080ff"} infiniteGrid side={2}/>
            {sceneComponents.map((value) => value)}
            {controlsTarget != -1 && <Controls targetID={controlsTarget} mode={controlsMode} space={controlsSpace} />}
            <CameraControls makeDefault />
            <Environment preset="city" />
            {/* <Gltf animations={[]} /> */}
        </Canvas>
    )
})


const Controls:React.FC<ITransformData> = (data) => {
    // console.log(useThree().scene.getObjectById(data.targetID));
    return <TransformControls object={useThree().scene.getObjectById(data.targetID)} mode={data.mode} space={data.space} />;
}

export default EditorScene