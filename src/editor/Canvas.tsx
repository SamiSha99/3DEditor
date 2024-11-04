import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useEditor } from "@orb_Editor";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { GizmoHelper, GizmoViewport, Line, Sphere, StatsGl, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { useRef, useState } from "react";
import React from "react";
import { isPanelActive, PANEL_ORIGIN_POINT, panelHasFlag } from "@orb_UI/panels/Panels";
import { translateOriginPoint } from "@orb_utils/Mesh";
import { useViewport } from "src/store/Viewport";


const Canvas = observer(() => {
    const { scene, onLoad } = useEditor()
    const { fpsEnabled, camera } = useViewport();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    return (
        <ReactThreeFiberCanvas
            ref={canvasRef}
            id="main"
            style={{ bottom: 0, height: "calc(100vh - 32px)" }}
            scene={scene}
            camera={camera}
            shadows
            onCreated={(_s) => {
                onLoad(_s.gl.domElement, _s.gl)
                setLoaded(true);
            }}
        >
            {
                loaded && canvasRef.current &&
                <>
                    <Scene canvas={canvasRef.current} />
                    <EditorHelpers />
                </>
            }
            {fpsEnabled && <StatsGl className="fps" />}
        </ReactThreeFiberCanvas>
    )
})

interface CanvasInfo {
    canvas: HTMLCanvasElement
}

const Scene: React.FC<CanvasInfo> = observer(({ canvas }) => {
    const { sceneObjects, sceneHelpers, controlsTarget, removeObject, setTarget } = useEditor();
    // the passed ref is null at load time! 
    if (!canvas) canvas = document.getElementById('main') as HTMLCanvasElement;

    useHotkeys("backspace", () => controlsTarget instanceof THREE.Object3D && removeObject(controlsTarget))
    useHotkeys("esc", () => controlsTarget && setTarget(null))

    return (
        <>
            {sceneObjects && sceneObjects.map((child) => <primitive key={child.uuid} object={child} />)}
            {sceneHelpers && sceneHelpers.map((helper) => <primitive key={helper.uuid} object={helper} />)}
        </>
    )
})

const EditorHelpers = observer(() => {
    const ref = useRef<THREE.Group>(null!);
    const { gridEnabled, grid, viewHelperEnabled, controls } = useViewport();
    return (
        <group renderOrder={1} ref={ref} name={"EDITOR_HELPER_DO_NOT_MODIFY_PLEASE"} userData={{ sceneHelpers: true }}>
            {viewHelperEnabled && <GizmoHelper
                alignment="top-right"
                margin={[70, 70]}
                children={<GizmoViewport disabled />} />}
            <primitive object={controls.getHelper()} />
            {gridEnabled && <primitive object={grid} />}
        </group>
    )
})

const EditorControls = observer(() => {
    const { controlsTarget } = useEditor();
    const { transformControlsMode, transformControlsSpace } = useViewport();
    const { camera, scene } = useThree();
    const [lastObjPlace, setLastObjectPlace] = useState<THREE.Vector3 | undefined>(undefined);
    const originDraggerRef = useRef<THREE.Group>(null);

    const isOriginPointMode = !!isPanelActive(PANEL_ORIGIN_POINT);
    let helper: THREE.BoxHelper | null = null;
    if (controlsTarget) {
        helper = new THREE.BoxHelper(controlsTarget, 0xFFFF00)
    }
    // reset references position if we change selected target
    if (originDraggerRef.current) {
        originDraggerRef.current.position.set(0, 0, 0);
        if (controlsTarget) {
            originDraggerRef.current.parent?.position.copy(controlsTarget.position)
            transformControlsSpace == "local" ? originDraggerRef.current.rotation.copy(controlsTarget.rotation) : controlsTarget && originDraggerRef.current.rotation.set(0, 0, 0);
        }
    }

    //to-do when launching origin point reset position of the origin point
    return (
        <>
            <GizmoHelper renderPriority={1} alignment="top-right" margin={[70, 70]}>
                <GizmoViewport labelColor="black" />
            </GizmoHelper>
            {
                controlsTarget &&
                <group visible={isOriginPointMode} name="TRANSFORM_ORIGIN_WORLD_CENTER" renderOrder={-50}>
                    {helper && <primitive object={helper} />}
                    <group name="TRANSFORM_ORIGIN_GROUP" position={controlsTarget?.position}>
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

                controlsTarget &&
                <TransformControlsDrei
                    name='TRANSFORM_HELPER'
                    //@ts-ignore
                    object={isOriginPointMode && !panelHasFlag(PANEL_ORIGIN_POINT, "drag_object") ? originDraggerRef : controlsTarget}
                    mode={transformControlsMode}
                    space={transformControlsSpace}
                    camera={camera}
                    onMouseUp={() => {
                        if (isOriginPointMode) {
                            if (controlsTarget instanceof THREE.Mesh && controlsTarget.geometry instanceof THREE.BufferGeometry) {
                                const o = controlsTarget;
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
                        setLastObjectPlace(controlsTarget.position.clone());
                    }}
                />
            }
        </>
    );
})

export default Canvas;