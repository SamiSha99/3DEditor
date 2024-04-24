import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, Environment, Grid, TransformControls } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../App';
import { ITransformData } from '../store/interface';
import { AppSettings } from '../store/appSettings';
import { AppStore } from '../store/AppStore';
export const EditorScene = observer(() => {
    const {objects, scene, environment} = useStores()
    const [reload, setReload] = useState(false);
    return (
        <>
            <button id="requestUpdateEditor" style={{display:"none"}} onClick={()=>setReload(!reload)}> test </button>
            <Canvas scene={scene} shadows camera={{position:[-2.5,2.5,0]}}>
                <CameraControls makeDefault />
                <EditorHelpers />
                <ambientLight intensity={1} color={"white"} />
                {objects.map((value) => (value.render()))}
                {environment && <Environment preset={environment} />}
            </Canvas>
        </>
    )
})

const EditorHelpers = observer(() => {
    const {controlsTarget, controlsMode, controlsSpace, buildPaneObject} = useStores()
    const { scene } = useThree();
    
    useEffect(()=>{
        const o = scene.getObjectById(controlsTarget as number);
        if(o)
            buildPaneObject(o);
    },[controlsTarget])

    return (
        <group name={AppSettings.EDITOR_HELPERS_NAME}>
            <Box material-color={"red"} scale={[0.25,0.0005,0.25]} position={[0,0,0] } />
            <Grid cellColor={"#2080ff"} infiniteGrid side={2}/>
            {controlsTarget != -1 && <Controls targetID={controlsTarget as number} mode={controlsMode} space={controlsSpace} />}
        </group>
    )
})

const Controls:React.FC<ITransformData> = observer((data) => {
    const { scene } = useThree();
    const o = scene.getObjectById(data.targetID);
    
    return (<TransformControls object={o} mode={data.mode} space={data.space} onObjectChange={(e) => {
        const pane = AppStore.Instance.paneObject;
        // pane?.children.map((child) => {
            // console.log(child.element);
            // console.log(child.element.childNodes[0].textContent);
            // console.log(child, child.element.getElementsByTagName("input"));
            // child.element.getElementsByTagName("input").value = ;
        // })

        // switch(data.mode)
        // {
            // case "translate":
        // }
    }} />);
})

export default EditorScene