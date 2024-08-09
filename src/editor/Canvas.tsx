import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, Grid, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { useRef, useState } from "react";
import React from "react";


const Canvas = observer(() => {
    const { scene } = useStores()
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <ReactThreeFiberCanvas
            ref={canvasRef}
            scene={scene}
            shadows
            style={{ height: "96.5%", flex: "80%" }}
            camera={{ position: [2.5, 1.5, 2.5] }}
        >
            <Scene canvas={canvasRef.current!} />
            <EditorHelpers />
        </ReactThreeFiberCanvas>
    )
})

interface CanvasInfo {
    canvas: HTMLCanvasElement
}

const Scene: React.FC<CanvasInfo> = observer(({ canvas }) => {
    const { environment, sceneObjects, sceneHelpers, controlsObject3D, isTransforming, background,
        removeObject, setControlsTarget } = useStores();
    const { scene, camera, raycaster } = useThree();

    // the passed ref is null at load time! 
    if(!canvas) canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
    
    scene.background = background;

    const selectObject = (e: MouseEvent) => {
        // Left Click only
        if (e.button != 0) return;
        if (isTransforming) return;
        // Bounds are used to calculate an offseted AND/OR resized canvas that doesn't take the entire screen due to inspector.
        const bounds = canvas.getBoundingClientRect();
        const pointer = new THREE.Vector2(((e.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1, -((e.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects([...sceneObjects, ...sceneHelpers], true);

        if (intersects.length <= 0) return;

        let hit = intersects[0].object;
        if ('object' in hit.userData) hit = hit.userData.object;
        setControlsTarget(hit);

    }
    canvas.onmouseup = selectObject;

    useHotkeys("delete", () => controlsObject3D instanceof THREE.Object3D && removeObject(controlsObject3D))
    useHotkeys("esc", () => controlsObject3D && setControlsTarget(null))

    return (
        <>
            {sceneObjects && sceneObjects.map((child) => <EditorObject3D object={child} />)}
            {sceneHelpers && sceneHelpers.map((helper) => <EditorSceneHelpers helper={helper} />)}
            {environment && <Environment key={"environment"} preset={environment} />}
        </>
    )
})

const EditorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    return <primitive key={object.uuid} object={object} />
})

const EditorSceneHelpers: React.FC<{ helper: THREE.Object3D }> = observer(({ helper }) => {
    useFrame(() => {
        if (helper instanceof THREE.SpotLightHelper) helper.update();
    })
    return (<primitive key={helper.uuid} object={helper} />)
})

const EditorHelpers = () => {
    const ref = useRef<THREE.Group>(null!);

    return (
        <group ref={ref} name={"EDITOR_HELPER_DO_NOT_MODIFY_PLEASE"} userData={{ "sceneHelpers": true }}>
            <Box name='CENTER_GRID_HELPER' material-color={"red"} scale={[0.25, 0.0005, 0.25]} position={[0, 0, 0]} />
            <Grid name='GRID_HELPER' cellColor={"#2080ff"} infiniteGrid side={THREE.DoubleSide} />
            <EditorControls />
        </group>
    )
}

const EditorControls = observer(() => {
    const { isTransforming, controlsObject3D, controlsMode, controlsSpace, setIsTransforming } = useStores();
    const { camera } = useThree();
    const [cameraStartDrag, setCameraStartDrag] = useState(false);
    // const o = scene.getObjectById(controlsTarget as number);

    const onStart = () => {
        !cameraStartDrag && setCameraStartDrag(true);
    }
    const onEnd = () => {
        setCameraStartDrag(false);
        isTransforming && setIsTransforming(false);
    }
    // rather of a hack for onChange running after onEnd multiple times due to dragging smoothness from draggingSmoothTime
    const onChange = () => {
        cameraStartDrag && !isTransforming && setIsTransforming(true);
        !cameraStartDrag && isTransforming && setIsTransforming(false);
    }

    return (
        <>
            <CameraControls makeDefault onStart={onStart} onEnd={onEnd} onChange={onChange} />
            {
                controlsObject3D &&
                <TransformControlsDrei
                    name='TRANSFORM_HELPER'
                    object={controlsObject3D}
                    mode={controlsMode}
                    space={controlsSpace}
                    camera={camera}
                    onMouseUp={() => { isTransforming && setIsTransforming(false) }}
                    onMouseDown={() => { !isTransforming && setIsTransforming(true) }}
                />
            }
        </>
    );
})

export default Canvas;