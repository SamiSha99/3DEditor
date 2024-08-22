import { useStores } from "@orb_App";
import { Screenshot, screenshotCanvas } from "@orb_tools/Previewer";
import { DraggablePanel } from "@orb_UI/ActivePanels";
import { OrbitControls } from "@react-three/drei";
import { Alert, Button, message, Row, Space } from "antd";
import { observer } from "mobx-react-lite";
import { PANEL_SCREENSHOT } from "./Panels";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as EXPORTER from '@orb_tools/Exporter';
import * as THREE from 'three';

export const PanelScreenshot = observer(() => {
    const { controlsObject3D } = useStores();
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    let previewRenderer: THREE.WebGLRenderer;
    return (
        <DraggablePanel key={PANEL_SCREENSHOT.id} name="Screenshot" identifier={PANEL_SCREENSHOT.id}>
            <Row align="middle" justify="center">
                {
                    controlsObject3D &&
                    <Space>
                        <Space.Compact block direction="vertical">
                            <Space.Compact style={{ marginBottom: "5px" }} block>
                                <Button style={{ margin: "auto", width: "33.3%" }} children={"Screenshot"}
                                    onClick={() => {
                                        console.log(canvasRef.current);
                                        screenshotCanvas(canvasRef.current, previewRenderer, 1024, 1024).then(blob => {
                                            if (blob) {
                                                EXPORTER.save(blob, "preview.png");
                                                message.success("Snip!");
                                            }
                                        });
                                    }}
                                />
                            </Space.Compact>
                            <div style={{ border: "1px solid white" }}>
                                <Canvas
                                    style={{ width: "256px", height: "256px" }}
                                    gl={(canvasnode) => {
                                        previewRenderer = new THREE.WebGLRenderer({ canvas: canvasnode, preserveDrawingBuffer: true, alpha: true, antialias: true });
                                        return previewRenderer;
                                    }}
                                    ref={canvasRef} id="preview"
                                >
                                    <OrbitControls />
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