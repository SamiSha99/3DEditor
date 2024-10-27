import { useEditor } from "@orb_Editor";
import { screenshotCanvas } from "@orb_tools/Previewer";
import { DraggablePanel } from "../antd/DraggablePanel";
import { Environment, OrbitControls } from "@react-three/drei";
import { Alert, Button, Form, message, Row, Space } from "antd";
import { observer } from "mobx-react-lite";
import { PANEL_SCREENSHOT } from "./Panels";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as EXPORTER from '@orb_tools/Exporter';
import * as THREE from 'three';
import { ItemVector2 } from "@orb_UI/controller/ControllerItems";

const DEFAULT_SIZE_WIDTH = 256;
const DEFAULT_SIZE_HEIGHT = 256;
const object = { size: new THREE.Vector2(DEFAULT_SIZE_WIDTH, DEFAULT_SIZE_HEIGHT) }

let previewRenderer: THREE.WebGLRenderer | undefined;


function resetDefaults() {
    object.size.x = DEFAULT_SIZE_WIDTH;
    object.size.y = DEFAULT_SIZE_HEIGHT;
}

export const PanelScreenshot = observer(() => {
    const { controlsTarget } = useEditor();

    const obj = controlsTarget?.clone();
    obj?.position.set(0, 0, 0);

    const scene = new THREE.Scene();
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    const box3 = obj && new THREE.Box3().expandByObject(obj, true);
    const min = box3?.min || new THREE.Vector3(0, 0, 0);
    const max = box3?.max || new THREE.Vector3(1, 1, 1);
    const offset = max.sub(min);

    return (
        <DraggablePanel width={300} name="Screenshot" identifier={PANEL_SCREENSHOT.id} onClose={() => {
            resetDefaults();
            previewRenderer && previewRenderer.dispose();
            previewRenderer = undefined;
        }}>
            <Row align="middle" justify="center">
                {
                    obj &&
                    <Space>
                        <Space.Compact block direction="vertical">
                            <Space.Compact style={{ marginBottom: "5px" }} block>
                                <Button style={{ margin: "auto", width: "33.3%" }} children={"Screenshot"}
                                    onClick={() => {
                                        canvasRef.current.style.display = "none"
                                        previewRenderer && screenshotCanvas(canvasRef.current, previewRenderer, object.size.x, object.size.y).then(blob => {
                                            console.log(blob);
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
                                        <ItemVector2 object={object} variable="size" precision={false} label={false} labelVector={{ x: "Width", y: "Height" }} limit={{ x: { min: 128, max: 1024 }, y: { min: 128, max: 1024 } }} />
                                    </Form>
                                </div>
                            </Space.Compact>
                            <div style={{ border: "2px dotted white" }}>
                                <Canvas
                                    style={{ width: DEFAULT_SIZE_WIDTH, height: DEFAULT_SIZE_HEIGHT, cursor: "all-scroll" }}
                                    scene={scene}
                                    camera={{ position: offset }}
                                    gl={(node) => {
                                        if (previewRenderer) {
                                            previewRenderer.dispose();
                                            previewRenderer = undefined;
                                        }
                                        previewRenderer = new THREE.WebGLRenderer({ canvas: node, alpha: true, antialias: true });
                                        return previewRenderer;
                                    }}
                                    ref={canvasRef} id="preview"
                                >
                                    <Environment preset="city" />
                                    <OrbitControls makeDefault enablePan={false} />
                                    <ambientLight />
                                    <primitive object={obj} />
                                </Canvas>
                            </div>
                        </Space.Compact>
                    </Space>
                }
                {
                    !obj && <Alert message="Select an object." type="info" showIcon />
                }
            </Row>
        </DraggablePanel>
    )
})

export default PanelScreenshot;