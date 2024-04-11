import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, TransformControls, Ambien } from '@react-three/drei';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';
import { AppSettings } from '../store/appSettings';

export const EditorScene = observer(() => {
    const {objects, scene, environment} = useStores()
    
    return (
        <Canvas scene={scene} shadows camera={{position:[-2.5,2.5,0]}}>
            <CameraControls makeDefault />
            <EditorHelpers />
            <ambientLight intensity={0} color={"red"} />
            {objects.map((value) => (value.render()))}
            {environment && <Environment preset={environment} />}
        </Canvas>
    )
})

const EditorHelpers = observer(() => {
    const {controlsTarget, controlsMode, controlsSpace} = useStores()
    
    return (
        <group name={AppSettings.EDITOR_HELPERS_NAME}>
            <Box material-color={"red"} scale={[0.25,0.0005,0.25]} position={[0,0,0] } />
            <Grid cellColor={"#2080ff"} infiniteGrid side={2}/>
            {/* to-do: support mutli selection!!! */}
            {controlsTarget != -1 && <Controls targetID={controlsTarget as number} mode={controlsMode} space={controlsSpace} />}
        </group>
    )
})

const Controls:React.FC<ITransformData> = (data) => {
    const { scene } = useThree();
    const o = scene.getObjectById(data.targetID);

    return (<TransformControls object={o} mode={data.mode} space={data.space} />);
}

export default EditorScene