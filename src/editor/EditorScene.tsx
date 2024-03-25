import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, TransformControls } from '@react-three/drei';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';

export const EditorScene = observer(() => {
    const {sceneComponents, scene, controlsTarget, controlsMode, controlsSpace} = useStores()

    return (
        <Canvas scene={scene} shadows camera={{position:[-2.5,2.5,0]}}>
            <group name='EDITOR_HELPER_DO_NOT_MODIFY'>
                <Box material-color={"red"} scale={[0.1,0.01,0.1]} position={[0,0,0] } />
                <Grid cellColor={"#2080ff"} infiniteGrid side={2}/>
                {controlsTarget != -1 && <Controls targetID={controlsTarget} mode={controlsMode} space={controlsSpace} />}
            </group>
            <CameraControls makeDefault />
            {sceneComponents.map((value) => value)}
            <Environment preset="city" />
        </Canvas>
    )
})

const Controls:React.FC<ITransformData> = (data) => {
    // console.log(useThree().scene.getObjectById(data.targetID));
    console.log("Control:",data);
    return <TransformControls object={useThree().scene.getObjectById(data.targetID)} mode={data.mode} space={data.space} />;
}

export default EditorScene