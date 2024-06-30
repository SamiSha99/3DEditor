import { Canvas, useThree } from '@react-three/fiber';
import { Box, CameraControls, CycleRaycast, Environment, Grid, TransformControls } from '@react-three/drei';
import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@orb_App';
import { ITransformData } from '../store/interface';
import { AppSettings } from '../store/appSettings';
import * as THREE from 'three';

export const EditorCanvas = observer(() => {
    const { environment, scene } = useStores()

    return (
        <>
            {/* <button id="requestUpdateEditor" onClick={()=>setReload(!reload)}> test </button> */}
            <Canvas scene={scene} style={{ height: "95%", flex:"85%" }} shadows camera={{ position: [-2.5, 2.5, 0] }}>
                <CameraControls makeDefault />
                <EditorScene />
                <EditorHelpers />
                {environment && <Environment preset={environment} />}
            </Canvas>
        </>
    )
})

// Currently instantiated objects in the scene that can be modified
const EditorScene = observer(() => {
    const { sceneObjects } = useStores();

    return (
        <>
            <ambientLight intensity={1.0} color={"white"} />
            {sceneObjects && sceneObjects.map((child) =>
                <primitive
                    onClick={(e: any) => { e.stopPropagation() }}
                    onPointerMissed={(e: any) => { e.stopPropagation() }}
                    onPointerOver={(e: any) => (e.stopPropagation())}
                    onPointerOut={(e: any) => (e.stopPropagation)}
                    object={child}
                />
            )}
        </>
    )
})

const EditorHelpers = observer(() => {
    const { controlsTarget, controlsMode, controlsSpace, setIntersectedTargets } = useStores()
    const { scene } = useThree();

    useEffect(() => {
        const o = scene.getObjectById(controlsTarget as number);

    }, [controlsTarget])

    return (
        <group name={AppSettings.EDITOR_HELPERS_NAME}>
            <CycleRaycast onChanged={(objects): any => {
                let res: THREE.Object3D[] = [];
                console.log(objects);
                objects.map(o => {
                    if (o.object)
                        res.push(o.object);
                })
                if (res)
                    setIntersectedTargets(res);
            }} />
            <Box name='CENTER_GRID_HELPER' material-color={"red"} scale={[0.25, 0.0005, 0.25]} position={[0, 0, 0]} />
            <Grid name='GRID_HELPER' cellColor={"#2080ff"} infiniteGrid side={2} />
            {controlsTarget != -1 && <Controls targetID={controlsTarget as number} mode={controlsMode} space={controlsSpace} />}
        </group>
    )
})

const Controls: React.FC<ITransformData> = observer((data) => {
    const { controlsObject3D } = useStores();
    const { scene } = useThree();
    const o = scene.getObjectById(data.targetID);

    // useControls(() => LEVATEST.LevaMesh(controlsObject3D as THREE.Object3D))

    return (
        <TransformControls name='TRANSFORM_HELPER' object={o} mode={data.mode} space={data.space} onMouseUp={(e) => {
            // if ((e?.target as TC).object) {
            //    
            // }
        }} />);
})

export default EditorCanvas