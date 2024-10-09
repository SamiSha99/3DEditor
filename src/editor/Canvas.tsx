import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, GizmoHelper, GizmoViewport, Grid, Line, Sphere, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { isPanelActive, PANEL_ORIGIN_POINT, panelHasFlag } from "@orb_UI/panels/Panels";
import { translateOriginPoint } from "@orb_utils/Mesh";


const Canvas = observer(() => {
    const { scene } = useStores()
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState<boolean>();

    useEffect(() => {
        setLoaded(canvasRef.current != undefined);
    }, [canvasRef]);

    console.log(THREE.Object3D.name);

    return (
        <ReactThreeFiberCanvas id="main" ref={canvasRef} scene={scene} shadows style={{ bottom: 0, height: "calc(100vh - 32px)" }} camera={{ position: [2.5, 1.5, 2.5] }}>
            {
                loaded &&
                canvasRef.current &&
                <>
                    <Scene canvas={canvasRef.current} />
                    <EditorHelpers />
                </>
            }


        </ReactThreeFiberCanvas>
    )
})

interface CanvasInfo {
    canvas: HTMLCanvasElement
}

const Scene: React.FC<CanvasInfo> = observer(({ canvas }) => {

    const { environment, sceneObjects, sceneHelpers, controlsObject3D, isTransforming,
        removeObject, setControlsTarget } = useStores();
    const { camera, raycaster } = useThree();


    // the passed ref is null at load time! 
    if (!canvas) canvas = document.getElementById('main') as HTMLCanvasElement;

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
        if (hit.userData.object as THREE.Object3D) hit = hit.userData.object;
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
        <group renderOrder={1} ref={ref} name={"EDITOR_HELPER_DO_NOT_MODIFY_PLEASE"} userData={{ sceneHelpers: true }}>
            <Box name='CENTER_GRID_HELPER' material-color={"red"} scale={[0.25, 0.0005, 0.25]} position={[0, 0, 0]} />
            <Grid name='GRID_HELPER' cellColor={"#2080ff"} infiniteGrid side={THREE.DoubleSide} />
            <EditorControls />
        </group>
    )
}

const EditorControls = observer(() => {
    const { isTransforming, controlsObject3D, controlsMode, controlsSpace, setIsTransforming } = useStores();
    const { camera, scene } = useThree();
    const [cameraStartDrag, setCameraStartDrag] = useState(false);
    const [lastObjPlace, setLastObjectPlace] = useState<THREE.Vector3 | undefined>(undefined);
    const originDraggerRef = useRef<THREE.Group>(null);

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

    const isOriginPointMode = !!isPanelActive(PANEL_ORIGIN_POINT);
    let helper: THREE.BoxHelper | null = null;
    if (controlsObject3D) {
        helper = new THREE.BoxHelper(controlsObject3D, 0xFFFF00)
    }
    // reset references position if we change selected target
    if (originDraggerRef.current) {
        originDraggerRef.current.position.set(0, 0, 0);
        if (controlsObject3D) {
            originDraggerRef.current.parent?.position.copy(controlsObject3D.position)
            controlsSpace == "local" ? originDraggerRef.current.rotation.copy(controlsObject3D.rotation) : controlsObject3D && originDraggerRef.current.rotation.set(0, 0, 0);
        }
    }

    //to-do when launching origin point reset position of the origin point
    return (
        <>
            <CameraControls makeDefault onStart={onStart} onEnd={onEnd} onChange={onChange} />
            <GizmoHelper renderPriority={1} alignment="top-right" margin={[70, 70]}>
                <GizmoViewport labelColor="black" />
            </GizmoHelper>
            {
                controlsObject3D &&
                <group visible={isOriginPointMode} name="TRANSFORM_ORIGIN_WORLD_CENTER" renderOrder={-50}>
                    {helper && <primitive object={helper} />}
                    <group name="TRANSFORM_ORIGIN_GROUP" position={controlsObject3D?.position}>
                        <group ref={originDraggerRef} name="TRANSFORM_ORIGIN_DRAGGER">
                            <Sphere scale={[0.05, 0.05, 0.05]} material={new THREE.MeshPhongMaterial({ emissive: "black" })} />
                            <Line color={0xFF0000} points={[[0, 0, 0], [10, 0, 0]]} lineWidth={5} />
                            <Line color={0x00FF00} points={[[0, 0, 0], [0, 10, 0]]} lineWidth={5} />
                            <Line color={0x0000FF} points={[[0, 0, 0], [0, 0, 10]]} lineWidth={5} />
                            <Line dashed dashScale={10} color={0xFF0000} points={[[0, 0, 0], [-10, 0, 0]]} lineWidth={5} />
                            <Line dashed dashScale={10} color={0x00FF00} points={[[0, 0, 0], [0, -10, 0]]} lineWidth={5} />
                            <Line dashed dashScale={10} color={0x0000FF} points={[[0, 0, 0], [0, 0, -10]]} lineWidth={5} />
                        </group>
                    </group>
                </group>
            }
            {

                controlsObject3D &&
                <TransformControlsDrei
                    name='TRANSFORM_HELPER'
                    object={isOriginPointMode && !panelHasFlag(PANEL_ORIGIN_POINT, "drag_object") ? originDraggerRef : controlsObject3D}
                    mode={controlsMode}
                    space={controlsSpace}
                    camera={camera}
                    onMouseUp={() => {
                        if (!isTransforming) return;
                        setIsTransforming(false);
                        if (isOriginPointMode) {
                            if (controlsObject3D instanceof THREE.Mesh && controlsObject3D.geometry instanceof THREE.BufferGeometry) {
                                const o = controlsObject3D;
                                if (!panelHasFlag(PANEL_ORIGIN_POINT, "drag_object")) {
                                    if (!originDraggerRef.current) return;
                                    const draggerPos = originDraggerRef.current.position;
                                    translateOriginPoint(o, draggerPos);
                                    draggerPos.set(0, 0, 0);
                                }
                                else {
                                    if (!lastObjPlace) return;
                                    o.position.copy(lastObjPlace);
                                    const draggedTo = o.position.clone();
                                    translateOriginPoint(o, draggedTo, true);
                                }
                                // Reset helpers
                                const origin = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                                origin?.position.copy(o.position);
                                helper?.update();
                                helper?.position.copy(o.position);
                            }
                        }
                        setLastObjectPlace(undefined);
                    }}
                    onMouseDown={() => {
                        if (isTransforming) return;
                        setIsTransforming(true);
                        setLastObjectPlace(controlsObject3D.position.clone());
                    }}
                />
            }
        </>
    );
})

export default Canvas;