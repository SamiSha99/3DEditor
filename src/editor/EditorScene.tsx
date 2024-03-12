import * as THREE from 'three';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, PivotControls, Plane, Select, Sphere, TransformControls, useCursor} from '@react-three/drei';
import React, { ReactNode, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';
import { JSX } from 'react/jsx-runtime';
import { AddBox, AddSphere } from './PrimitiveCreator/Primitives';
import { button, useControls } from 'leva';

let mode = 0;
let space = 0;

export const EditorScene = observer(() => {
    
    const [toggle, setToggle] = useState(true);
    useControls(
      {
        [toggle ? "activated" : "disabled"]: button(() => alert("hello"), {
          disabled: !toggle
        })
      },
      [toggle]
    );

    const {controlsTarget, controlsMode, controlsSpace, setControlsMode, setControlSpace, boxes, pushBox, setControlsTarget} = useStores()
    document.oncontextmenu = function (e) {
        setControlSpace(++space >= 2 ? (space = 0) : space)
    }

    document.body.onkeyup = function(e) {
        if(e.key == " "|| e.code == "Space" || e.keyCode == 32) 
            setControlsMode(++mode >= 3 ? (mode = 0) : mode)
    }


    return (
        <>
            <div style={{position:'absolute' ,zIndex:2}}>
            <button onClick={() => setToggle((f) => !f)}>Click me</button>
                <AddBox />
                <AddSphere />
            </div>
        <Canvas shadows camera={{position:[-2,2,0]}}>
            <Grid infiniteGrid />
            <hemisphereLight intensity={1.5} groundColor="red" />
            {boxes.map((value) => value)}
            {controlsTarget != -1 && <Controls targetID={controlsTarget} mode={controlsMode} space={controlsSpace} />}
            <CameraControls makeDefault />
            <Environment preset="city" />
        </Canvas>
        </>
    )
})

const Controls:React.FC<ITransformData> = (data) => {
    return <TransformControls object={useThree().scene.getObjectById(data.targetID)} mode={data.mode} space={data.space} />;
}

export default EditorScene