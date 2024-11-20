import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useThree } from '@react-three/fiber';
import { useEditor } from "@orb_Editor";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { GizmoHelper, GizmoViewport, Line, Sphere, StatsGl, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { useRef, useState } from "react";
import React from "react";
import { isPanelActive, panelHasFlag } from "@orb_UI/panels/Panels";
import { translateOriginPoint } from "@orb_utils/Mesh";
import { useViewport } from "src/store/Viewport";


const Canvas = observer(() => {
    const { scene, onLoad } = useEditor()
    const { fpsEnabled, camera } = useViewport();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    return (
        <>
            <div style={{ backgroundColor: "#696969", width: "100%", height: "calc(100vh - 32px)", display: loaded ? "none" : "flex", alignItems: "center", alignContent: "center" }}>
                <div style={{ margin: "auto", textAlign: "center", fontSize: 32, fontWeight: "bold" }}>
                    Loading Scene, please wait.
                </div>
            </div >
            <ReactThreeFiberCanvas
                ref={canvasRef}
                id="main"
                style={{ bottom: 0, height: "calc(100vh - 32px)", width: loaded ? "100%" : "1px" }}

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
        </>
    )
})

interface CanvasInfo {
    canvas: HTMLCanvasElement
}

const Scene: React.FC<CanvasInfo> = observer(({ canvas }) => {
    const { sceneObjects, sceneHelpers, removeObject } = useEditor();
    const { setTarget, target } = useViewport();
    // the passed ref is null at load time! 
    if (!canvas) canvas = document.getElementById('main') as HTMLCanvasElement;

    useHotkeys("backspace", () => target instanceof THREE.Object3D && removeObject(target))
    useHotkeys("esc", () => target && setTarget(null))

    return (
        <>
            {sceneObjects && sceneObjects.map((child) => <primitive key={child.uuid} object={child} />)}
            {sceneHelpers && sceneHelpers.map((helper) => <primitive key={helper.uuid} object={helper} />)}
        </>
    )
})

const EditorHelpers = observer(() => {
    const ref = useRef<THREE.Group>(null!);
    const { flags } = useEditor();
    const { gridEnabled, grid, viewHelperEnabled, controls, target } = useViewport();

    return (
        <>
            <group renderOrder={1} ref={ref} name={"EDITOR_HELPER_DO_NOT_MODIFY_PLEASE"} userData={{ sceneHelpers: true }}>
                {
                    viewHelperEnabled &&
                    <GizmoHelper
                        alignment="top-right"
                        margin={[70, 70]}
                        children={<GizmoViewport disabled />}
                    />
                }
                {
                    flags.includes("geometry_tools") &&
                    <group name="TRANSFORM_ORIGIN_WORLD_CENTER">
                        <group name="TRANSFORM_ORIGIN_GROUP" position={target?.position}>
                            <group name="TRANSFORM_ORIGIN_DRAGGER">
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
                <primitive object={controls.getHelper()} />
                {gridEnabled && <primitive object={grid} />}
            </group>
        </>
    )
})

export default Canvas;