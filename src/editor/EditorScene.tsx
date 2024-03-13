import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, TransformControls } from '@react-three/drei';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';
import { AddCube, AddSphere, AddCylinder, AddPlane, Exporter } from './PrimitiveCreator/Primitives';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';
import { Object3D } from 'three';

let mode = 0;
let space = 0;

export const EditorScene = observer(() => {
    const {controlsTarget, controlsMode, controlsSpace, setControlsMode, setControlSpace, sceneComponents} = useStores()
    document.body.onkeyup = function(e) {
        if(e.key == " "|| e.code == "Space" || e.keyCode == 32) 
            setControlsMode(++mode >= 3 ? (mode = 0) : mode)
    }
    return (
        <>
            <div style={{position:'absolute' ,zIndex:2}}>
                <AddCube />
                <AddSphere />
                <AddCylinder />
                <AddPlane />
                <button onClick={() => setControlSpace(++space >= 2 ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
                <Exporter />
            </div>
        <Canvas shadows camera={{position:[-2,2,0]}}>
            <Box material-color={"red"} scale={[0.1,0.01,0.1]} position={[0,0,0] } />
            <Grid infiniteGrid side={2}/>
            {sceneComponents.map((value) => value)}
            {controlsTarget != -1 && <Controls targetID={controlsTarget} mode={controlsMode} space={controlsSpace} />}
            <CameraControls makeDefault />
            <Environment preset="city" />
        </Canvas>
        </>
    )
})


const Controls:React.FC<ITransformData> = (data) => {
    // console.log(useThree().scene.getObjectById(data.targetID));
    return <TransformControls object={useThree().scene.getObjectById(data.targetID)} mode={data.mode} space={data.space} />;
}

export default EditorScene