import * as THREE from 'three';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, OrbitControls, PivotControls, Plane, Select, Shadow, Sphere, TransformControls, useCursor} from '@react-three/drei';
import React, { ReactNode, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';
import { JSX } from 'react/jsx-runtime';
import { AddCube, AddSphere, AddCylinder, AddPlane } from './PrimitiveCreator/Primitives';
import { button, useControls } from 'leva';

let mode = 0;
let space = 0;

export const EditorScene = observer(() => {
    const {controlsTarget, controlsMode, controlsSpace, setControlsMode, setControlSpace, boxes, pushBox, setControlsTarget} = useStores()

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
            </div>
        <Canvas shadows camera={{position:[-2,2,0]}}>
            {/* //<fog attach="fog" args={['#202020', 5, 20]} /> */}
            <Box material-color={"red"} scale={[0.1,0.01,0.1]} position={[0,0,0] } />
            <Grid infiniteGrid side={2}/>
            <hemisphereLight intensity={1.5} groundColor="red" />
            {boxes.map((value) => value)}
            {controlsTarget != -1 && <Controls targetID={controlsTarget} mode={controlsMode} space={controlsSpace} />}
            <OrbitControls makeDefault />
            <Environment preset="city" />
        </Canvas>
        </>
    )
})

const Controls:React.FC<ITransformData> = (data) => {
    return <TransformControls object={useThree().scene.getObjectById(data.targetID)} mode={data.mode} space={data.space} />;
}

export default EditorScene