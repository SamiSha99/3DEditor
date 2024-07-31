import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, Grid, TransformControls as TransformControlsDrei } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { ITransformData } from "src/store/interface";
import { TransformControls } from "three/examples/jsm/Addons";


const Canvas = observer(() => {
    const { scene } = useStores()
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <ReactThreeFiberCanvas
            ref={canvasRef}
            scene={scene}
            shadows
            style={{ height: "95%", flex: "80%" }}
            camera={{ position: [-2.5, 2.5, 0] }}
        >
            <Scene canvas={canvasRef.current!} />
            <EditorHelpers />
        </ReactThreeFiberCanvas>
    )
})

const Scene: React.FC<{ canvas: HTMLCanvasElement }> = observer(({ canvas }) => {
    const { environment, sceneObjects, sceneHelpers, controlsObject3D, isTransforming,
        removeObject, setControlsTarget } = useStores();
    const { scene, camera, raycaster } = useThree();

    const selectObject = (event: MouseEvent) => {
        // Left Click only
        if (event.button != 0) return;
        if (isTransforming) return;
        // Bounds are used to calculate an offseted, resized canvas that doesn't take the entire screen due to inspector.
        // Also getBoundingClientRect is apparently an expensive call, to-do: optimize?
        let canvasBounds = canvas.getBoundingClientRect();
        const pointer = new THREE.Vector2(
            ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1,
            -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1
        );
        raycaster.setFromCamera(pointer, camera)
        const DEBUG_SHOW_RAYCASTER_HELPER = true;
        if (DEBUG_SHOW_RAYCASTER_HELPER)
            scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 10, 0xff0000))
        const intersects = raycaster.intersectObjects(sceneObjects, true);

        for (let i = 0; i < intersects.length; i++) {
            setControlsTarget(intersects[i].object);
            break;
        }
    }
    canvas.onmouseup = selectObject;

    useHotkeys("delete", () => {
        if (controlsObject3D instanceof THREE.Object3D)
            removeObject(controlsObject3D);
    })

    return (
        <>

            {sceneObjects && sceneObjects.map((child) =>
                <EditorObject3D object={child} />
            )}
            {/* NOTE: sceneHelpers such as PointLight must be at the root of the scene or bugs will happen!*/}
            {sceneHelpers && sceneHelpers.map((helper) =>
                <primitive
                    key={helper.uuid}
                    object={helper}
                />
            )}
            {environment && <Environment preset={environment} />}
        </>
    )
})

const EditorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    let mixer: THREE.AnimationMixer | null;

    useEffect(() => {
        if (object.animations.length) {
            mixer = new THREE.AnimationMixer(object);
            object.animations.forEach((animation) => {
                const action = mixer?.clipAction(animation);
                action?.play();
            })
        }
        else
            mixer = null;
    }, [object.animations]);

    useFrame((state, delta) => {
        if (mixer) {
            mixer?.update(delta);
        }
    })

    return (
        <primitive
            key={object.uuid}
            object={object}
        />
    )
})

const EditorHelpers = () => {
    const ref = useRef(null!);

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

    return (
        <>
            <CameraControls
                makeDefault
                onStart={() => {
                    !cameraStartDrag && setCameraStartDrag(true);
                }}
                onEnd={() => {
                    setCameraStartDrag(false);
                    isTransforming && setIsTransforming(false);
                }}
                // rather of a hack for onChange running after onEnd multiple times due to dragging smoothness from draggingSmoothTime
                onChange={() => {
                    cameraStartDrag && !isTransforming && setIsTransforming(true);
                    !cameraStartDrag && isTransforming && setIsTransforming(false)
                }}
            />
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