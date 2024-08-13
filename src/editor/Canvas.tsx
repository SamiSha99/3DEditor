import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, Grid, Line, Sphere, TransformControls as TransformControlsDrei } from "@react-three/drei";
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
    if (!canvas) canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;

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
    const { isTransforming, controlsObject3D, controlsMode, controlsSpace, setIsTransforming, isGeometryMode } = useStores();
    const { camera, scene } = useThree();
    const [cameraStartDrag, setCameraStartDrag] = useState(false);
    const originDraggerRef = useRef<THREE.Group>(null);
    const originRef = useRef<THREE.Group>(null);

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

    // reset references position if we change selected target
    originDraggerRef.current && originDraggerRef.current.position.set(0, 0, 0);
    originRef.current && controlsObject3D && originRef.current.position.copy(controlsObject3D.position)

    return (
        <>
            <CameraControls makeDefault onStart={onStart} onEnd={onEnd} onChange={onChange} />
            {
                controlsObject3D && isGeometryMode &&
                <group visible={isGeometryMode} name="TRANSFORM_ORIGIN_GROUP" position={controlsObject3D?.position} renderOrder={-50}>
                    <group ref={originDraggerRef} name="TRANSFORM_ORIGIN_DRAGGER">
                        <Sphere scale={[0.05, 0.05, 0.05]} material={new THREE.MeshPhongMaterial({ emissive: "black" })} />
                        <Line color={0xFA8072} points={[[0, 0, 0], [10, 0, 0]]} lineWidth={5} />
                        <Line color={0x93E459} points={[[0, 0, 0], [0, 10, 0]]} lineWidth={5} />
                        <Line color={0x0080FF} points={[[0, 0, 0], [0, 0, 10]]} lineWidth={5} />
                        <Line dashed dashScale={10} color={0xFA8072} points={[[0, 0, 0], [-10, 0, 0]]} lineWidth={5} />
                        <Line dashed dashScale={10} color={0x93E459} points={[[0, 0, 0], [0, -10, 0]]} lineWidth={5} />
                        <Line dashed dashScale={10} color={0x0080FF} points={[[0, 0, 0], [0, 0, -10]]} lineWidth={5} />
                    </group>
                </group>
            }
            {
                controlsObject3D &&
                <TransformControlsDrei
                    name='TRANSFORM_HELPER'
                    object={isGeometryMode ? originDraggerRef : controlsObject3D}
                    mode={controlsMode}
                    space={controlsSpace}
                    camera={camera}
                    onMouseUp={() => {
                        if (!isTransforming) return;
                        setIsTransforming(false);
                        if (isGeometryMode) {
                            if (!originDraggerRef.current) {
                                return;
                            }
                            if (controlsObject3D instanceof THREE.Mesh && controlsObject3D.geometry instanceof THREE.BufferGeometry) {
                                const o = controlsObject3D;
                                const offset = originDraggerRef.current.position.clone();
                                originDraggerRef.current.position.set(0, 0, 0);
                                o.geometry.translate(-offset.x, -offset.y, -offset.z);
                                o.position.add(offset);
                                const origin = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                                origin?.position.copy(o.position);
                            }
                        }
                    }}
                    onMouseDown={(e) => {
                        if (isTransforming) return;
                        setIsTransforming(true);
                    }}
                />
            }
        </>
    );
})

export default Canvas;