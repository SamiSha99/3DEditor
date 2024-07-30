import { observer } from "mobx-react-lite";
import { Canvas as ReactThreeFiberCanvas, useFrame, useThree } from '@react-three/fiber';
import { useStores } from "@orb_App";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";
import { Box, CameraControls, Environment, Grid, TransformControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { ITransformData } from "src/store/interface";

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
            children={<Scene canvas={canvasRef.current!} />}
        />
    )
})

const Scene: React.FC<{ canvas: HTMLCanvasElement }> = observer(({ canvas }) => {
    const { environment, sceneObjects, sceneHelpers, removeObject, controlsObject3D, setControlsTarget } = useStores();
    const { scene, camera, raycaster } = useThree();

    canvas.onmouseup = (event) => {
        // Left Click only
        if (event.button != 0) return;

        // Bounds are used to calculate an offseted, resized canvas that doesn't take the entire screen due to inspector.
        // Also getBoundingClientRect is apparently an expensive call, to-do: optimize?
        let canvasBounds = canvas.getBoundingClientRect();
        const pointer = new THREE.Vector2(
            ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1,
            -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1
        );
        raycaster.setFromCamera(pointer, camera)
        if (false)
            scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000))
        const intersects = raycaster.intersectObjects(sceneObjects, true);

        // to-do: Add root selection options with this new raycaster
        for (let i = 0; i < intersects.length; i++) {
            setControlsTarget(intersects[i].object);
            break;
        }
    }
    useHotkeys("delete", () => {
        if (controlsObject3D instanceof THREE.Object3D)
            removeObject(controlsObject3D);
    })

    return (
        <>
            <CameraControls makeDefault />
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
            <EditorHelpers />
            {environment && <Environment preset={environment} />}
        </>
    )
})

const EditorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    const { controlsObject3D } = useStores();
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
            console.log("animating...")
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

const EditorHelpers = observer(() => {
    const { controlsTarget, controlsMode, controlsSpace } = useStores()
    const ref = useRef(null!);

    return (
        <group ref={ref} name={"EDITOR_HELPER_DO_NOT_MODIFY_PLEASE"} userData={{ "sceneHelpers": true }}>
            <Box name='CENTER_GRID_HELPER' material-color={"red"} scale={[0.25, 0.0005, 0.25]} position={[0, 0, 0]} />
            <Grid name='GRID_HELPER' cellColor={"#2080ff"} infiniteGrid side={THREE.DoubleSide} />
            {controlsTarget != -1 && <Controls targetID={controlsTarget as number} mode={controlsMode} space={controlsSpace} />}
        </group>
    )
})

const Controls: React.FC<ITransformData> = observer((data) => {
    const { scene } = useThree();
    const o = scene.getObjectById(data.targetID);

    return (
        <TransformControls
            name='TRANSFORM_HELPER'
            object={o}
            mode={data.mode}
            space={data.space}
            onMouseUp={(e) => { /* General Kenobi: Hello there! */ }}
        />);
})

export default Canvas;