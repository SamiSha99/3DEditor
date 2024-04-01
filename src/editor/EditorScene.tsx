import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Edges, Environment, Grid, TransformControls } from '@react-three/drei';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';

export const EditorScene = observer(() => {
    const {objects, scene, environment} = useStores()
    console.log(environment)
    return (
        <Canvas scene={scene} shadows camera={{position:[-2.5,2.5,0]}}>
            <CameraControls makeDefault />
            <EditorHelpers />
            {objects.map((value) => value.render())}
            {environment && <Environment preset={environment} />}
        </Canvas>
    )
})

const Controls:React.FC<ITransformData> = (data) => {
    const {scene} = useThree();
    return (<TransformControls object={scene.getObjectById(data.targetID)} mode={data.mode} space={data.space} />);
}

const EditorHelpers = observer(() => {
    const {controlsTarget, controlsMode, controlsSpace} = useStores()
    return (
        <group name='EDITOR_HELPER_DO_NOT_MODIFY'>
            <Box material-color={"red"} scale={[0.5,0.01,0.5]} position={[0,0,0] } />
            <Grid cellColor={"#2080ff"} infiniteGrid side={2}/>
            {controlsTarget != -1 && <Controls targetID={controlsTarget} mode={controlsMode} space={controlsSpace} />}
        </group>
    )
})

export default EditorScene