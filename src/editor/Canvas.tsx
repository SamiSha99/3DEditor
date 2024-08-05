import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, Grid, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { ITransformData } from "src/store/interface";
import { TransformControls } from "three/examples/jsm/Addons";
import { HelperUserData } from "@orb_tools/create/Helpers";
import React from "react";


const Canvas = observer(() => {
    const { scene } = useStores()
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <ReactThreeFiberCanvas
            ref={canvasRef}
            scene={scene}
            shadows
            style={{ height: "95%", flex: "75%" }}
            camera={{ position: [-2.5, 2.5, 0] }}
        >
            <Scene canvas={canvasRef.current!} />
            <EditorHelpers />
        </ReactThreeFiberCanvas>
    )
})

interface CanvasInfo {
    canvas: HTMLCanvasElement,
    bounds?: DOMRect
}

const Scene: React.FC<CanvasInfo> = observer(({ canvas, bounds }) => {
    const { environment, sceneObjects, sceneHelpers, controlsObject3D, isTransforming, background,
        removeObject, setControlsTarget } = useStores();
    const { scene, camera, raycaster } = useThree();

    scene.background = background[1] ? background[0] : null;

    const selectObject = (e: MouseEvent) => {
        // Left Click only
        if (e.button != 0) return;
        if (isTransforming) return;
        // Bounds are used to calculate an offseted AND/OR resized canvas that doesn't take the entire screen due to inspector.
        if (!bounds) bounds = canvas.getBoundingClientRect();
        const pointer = new THREE.Vector2(((e.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1, -((e.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects([...sceneObjects, ...sceneHelpers], true);

        if (intersects.length <= 0) return;

        let hit = intersects[0].object;
        if ('object' in hit.userData) hit = hit.userData.object;
        setControlsTarget(hit);

    }
    canvas.onmouseup = selectObject;

    useHotkeys("delete", () => {
        if (controlsObject3D instanceof THREE.Object3D)
            removeObject(controlsObject3D);
    })

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
    const { isTransforming, controlsTarget, controlsMode, controlsSpace, setIsTransforming } = useStores();
    const { scene, camera } = useThree();
    const [cameraStartDrag, setCameraStartDrag] = useState(false);
    const o = scene.getObjectById(controlsTarget as number);

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
                controlsTarget != -1 &&
                <TransformControlsDrei
                    name='TRANSFORM_HELPER'
                    object={o}
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