import { useStores } from "@orb_App";
import { Screenshot, screenshotCanvas } from "@orb_tools/Previewer";
import { DraggablePanel } from "@orb_UI/ActivePanels";
import { Environment, OrbitControls } from "@react-three/drei";
import { Alert, Button, Form, message, Row, Space } from "antd";
import { observer } from "mobx-react-lite";
import { PANEL_SCREENSHOT } from "./Panels";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as EXPORTER from '@orb_tools/Exporter';
import * as THREE from 'three';
import { ItemInput, ItemNumber, ItemVector2 } from "@orb_UI/controller/ControllerItems";

export const PanelScreenshot = observer(() => {
    const { controlsObject3D } = useStores();
    const scene = new THREE.Scene();
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    let previewRenderer: THREE.WebGLRenderer;

    const box3 = controlsObject3D && new THREE.Box3().expandByObject(controlsObject3D, true);
    const min = box3?.min || new THREE.Vector3(0, 0, 0);
    const max = box3?.max || new THREE.Vector3(1, 1, 1);
    const offset = max.sub(min);

    // const object = { width: 256, height: 256 }
    const object = { size: new THREE.Vector2(256, 256) }

    return (
        <DraggablePanel width={300} key={PANEL_SCREENSHOT.id} name="Screenshot" identifier={PANEL_SCREENSHOT.id}>
            <Row align="middle" justify="center">
                {
                    controlsObject3D &&
                    <Space>
                        <Space.Compact block direction="vertical">
                            <Space.Compact style={{ marginBottom: "5px" }} block>
                                <Button style={{ margin: "auto", width: "33.3%" }} children={"Screenshot"}
                                    onClick={() => {
                                        canvasRef.current.style.display = "none"
                                        screenshotCanvas(canvasRef.current, previewRenderer, object.size.x, object.size.y).then(blob => {
                                            if (blob) {
                                                EXPORTER.save(blob, "preview.png");
                                                message.success("Snip!");
                                                canvasRef.current.style.display = "";
                                            }
                                        });
                                    }}
                                />
                            </Space.Compact>
                            <Space.Compact style={{ marginBottom: "5px" }}>
                                <div style={{ margin: "auto", width: "100%", alignContent: "top" }}>
                                    <Form style={{ width: "100%" }} colon={false} labelWrap>
                                        <ItemVector2 object={object} variable="size" precision={false} label={false} labelVector={{x: "Width", y: "Height"}} />
                                    </Form>
                                </div>
                            </Space.Compact>
                            <div style={{ border: "2px dotted white" }}>
                                <Canvas
                                    style={{ width: object.size.x, height: object.size.y, cursor: "all-scroll" }}
                                    scene={scene}
                                    camera={{ position: offset }}
                                    gl={(node) => {
                                        previewRenderer = new THREE.WebGLRenderer({ canvas: node, alpha: true, antialias: true });
                                        return previewRenderer;
                                    }}
                                    ref={canvasRef} id="preview"
                                >
                                    <Environment preset="city" />
                                    <OrbitControls makeDefault enablePan={false} />
                                    <ambientLight />
                                    <primitive object={controlsObject3D.clone()} />
                                </Canvas>
                            </div>
                        </Space.Compact>
                    </Space>
                }
                {
                    !controlsObject3D && <Alert message="Select an object." type="info" showIcon />
                }
            </Row>
        </DraggablePanel>
    )
})

export default PanelScreenshot;