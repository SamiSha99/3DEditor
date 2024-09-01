import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, Grid, Helper, Line, Sphere, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { PANEL_ORIGIN_POINT } from "@orb_UI/panels/Panels";
import { quaternionFromNormal, quaternionToVector3 } from "@orb_utils/Math";


const Canvas = observer(() => {
    const { scene } = useStores()
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState<boolean>();

    useEffect(() => {
        console.log(canvasRef.current);
        setLoaded(canvasRef.current != undefined);
    }, [canvasRef]);

    return (
        <ReactThreeFiberCanvas
            id="main"
            ref={canvasRef}
            scene={scene}
            shadows
            style={{ height: "96.5%", flex: "80%" }}
            camera={{ position: [2.5, 1.5, 2.5] }}
        >
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

    const { environment, sceneObjects, sceneHelpers, controlsObject3D, isTransforming, background,
        removeObject, setControlsTarget } = useStores();
    const { scene, camera, raycaster } = useThree();

    // the passed ref is null at load time! 
    if (!canvas) canvas = document.getElementById('main') as HTMLCanvasElement;

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
        <group renderOrder={-1} ref={ref} name={"EDITOR_HELPER_DO_NOT_MODIFY_PLEASE"} userData={{ "sceneHelpers": true }}>
            <Box name='CENTER_GRID_HELPER' material-color={"red"} scale={[0.25, 0.0005, 0.25]} position={[0, 0, 0]} />
            <Grid name='GRID_HELPER' cellColor={"#2080ff"} infiniteGrid side={THREE.DoubleSide} />
            <EditorControls />
        </group>
    )
}

const EditorControls = observer(() => {
    const { isTransforming, controlsObject3D, controlsMode, controlsSpace, setIsTransforming, activePanels } = useStores();
    const { camera, scene } = useThree();
    const [cameraStartDrag, setCameraStartDrag] = useState(false);
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

    const isOriginPointMode = !!activePanels.find(x => x.id == PANEL_ORIGIN_POINT.id);
    let helper: THREE.BoxHelper | null = null;
    if (controlsObject3D) {
        helper = new THREE.BoxHelper(controlsObject3D, 0xFFFF00)
    }
    // reset references position if we change selected target
    originDraggerRef.current && originDraggerRef.current.position.set(0, 0, 0);
    // originDraggerRef.current && controlsObject3D && originDraggerRef.current.rotation.copy(controlsObject3D.rotation);

    const DEBUGGING = true;


    return (
        <>
            <CameraControls makeDefault onStart={onStart} onEnd={onEnd} onChange={onChange} />
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

                <TransformControlsDrei
                    name='TRANSFORM_HELPER'
                    object={isOriginPointMode ? originDraggerRef : controlsObject3D}
                    mode={controlsMode}
                    space={controlsSpace}
                    camera={camera}
                    onMouseUp={() => {
                        if (!isTransforming) return;
                        setIsTransforming(false);
                        if (isOriginPointMode) {
                            if (!originDraggerRef.current) {
                                return;
                            }

                            if (controlsObject3D instanceof THREE.Mesh && controlsObject3D.geometry instanceof THREE.BufferGeometry) {
                                const o = controlsObject3D;
                                const offset = originDraggerRef.current.position.clone();

                                // to-do VERY CLOSE just some math mismatch
                                const quat = new THREE.Quaternion().setFromEuler(o.rotation);

                                // Rotation offset
                                const distance = offset.distanceTo({ x: 0, y: 0, z: 0 });
                                const dir = quaternionFromNormal(offset.normalize());
                                const newQuatDir = new THREE.Quaternion().multiplyQuaternions(quat, dir);
                                const dirNew = quaternionToVector3(newQuatDir);
                                // dragging direction yellow
                                if (DEBUGGING) {
                                    const ah = scene.getObjectByName("DEBUGGING_ARROW_HELPER_1");
                                    ah && scene.remove(ah);
                                    const a1 = new THREE.ArrowHelper(dirNew, o.position, 2, 0xFFFF00);
                                    a1.name = "DEBUGGING_ARROW_HELPER_1";
                                    scene.add(a1);
                                }
                                const translate = dirNew.multiplyScalar(distance);
                                translate.divide(o.scale);

                                // Adjust translation and position of obj
                                o.geometry.translate(-translate.x, -translate.y, -translate.z);

                                // Geomtery translation direction cyan
                                if(DEBUGGING) {
                                    const ah = scene.getObjectByName("DEBUGGING_ARROW_HELPER_2");
                                    ah && scene.remove(ah);
                                    const a1 = new THREE.ArrowHelper(translate.normalize().negate(), o.position, 2, 0x00FFFF);
                                    a1.name = "DEBUGGING_ARROW_HELPER_2";
                                    scene.add(a1);
                                }

                                const rotationDirectionQuat = new THREE.Quaternion().multiplyQuaternions(dir, new THREE.Quaternion().setFromEuler(o.rotation));
                                const rotationDirection = quaternionToVector3(rotationDirectionQuat);
                                
                                // moving direction offset purple
                                if (DEBUGGING) {
                                    const ah = scene.getObjectByName("DEBUGGING_ARROW_HELPER_3");
                                    ah && scene.remove(ah);
                                    const a1 = new THREE.ArrowHelper(rotationDirection, o.position, 2.5, 0xFF00FF);
                                    a1.name = "DEBUGGING_ARROW_HELPER_3";
                                    scene.add(a1);
                                }
                                o.position.add(rotationDirection.multiplyScalar(distance).multiply(o.scale));
                                // Reset helpers
                                originDraggerRef.current.position.set(0, 0, 0);
                                const origin = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                                origin?.position.copy(o.position);
                                helper?.update();
                                helper?.position.copy(o.position)
                            }
                        }
                    }}
                    onMouseDown={() => {
                        if (isTransforming) return;
                        setIsTransforming(true);
                    }}
                />
            }
        </>
    );
})

export default Canvas;