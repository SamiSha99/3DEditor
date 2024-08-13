import { LikeOutlined } from "@ant-design/icons";
import { useStores } from "@orb_App";
import { Button, Collapse, ConfigProvider, Divider, Row, Space, theme, ThemeConfig, Tooltip, Typography } from "antd";
const { Text } = Typography;
import { observer } from "mobx-react-lite";
import Draggable, { DraggableCore } from "react-draggable";
import * as THREE from 'three';

const themeConfig: ThemeConfig = {
    components: {
        Collapse: {
            colorBgBase: "#212121",
            colorBgContainer: "#212121",
            colorBorder: "white"
        },
        Divider: {
            fontSize: 2,
            margin: 0
        }
    },
    token: {
        motion: false
    }
}

export const ActivePanels = observer(() => {

    return (
        <>
            <OriginPointPanel />
        </>
    )
})

export const OriginPointPanel = observer(() => {
    const { isGeometryMode, controlsObject3D, scene } = useStores();

    const setOriginPoint = (pos?: { x?: number, y?: number, z?: number }, center?: boolean) => {
        if (!controlsObject3D) return;
        const o = controlsObject3D;
        if (o instanceof THREE.Mesh && o.geometry instanceof THREE.BufferGeometry) {
            o.geometry.computeBoundingBox();
            if (o.geometry.boundingBox) {
                const size = new THREE.Vector3();
                const centerPos = new THREE.Vector3();
                o.geometry.boundingBox.getCenter(centerPos);
                o.geometry.boundingBox.getSize(size);
                const min = o.geometry.boundingBox.min
                const max = o.geometry.boundingBox.max
                console.log("size:", size);
                console.log("center:", centerPos);
                console.log("min:", min);
                console.log("max:", max);
                if (center) {
                    o.position.add(centerPos);
                    o.geometry.center();
                }
                else if (pos) {
                    if (pos.x != undefined) {
                        if (pos.x < 0) {
                            o.position.add(new THREE.Vector3(min.x, 0, 0));
                            o.geometry.translate(max.x - 2 * centerPos.x, 0, 0);
                        }
                        else if (pos.x > 0) {
                            o.position.add(new THREE.Vector3(max.x, 0, 0));
                            o.geometry.translate(min.x - 2 * centerPos.x, 0, 0);
                        }
                        else {
                            o.position.add(new THREE.Vector3(centerPos.x, 0, 0));
                            o.geometry.translate(-centerPos.x, 0, 0);
                        }
                    }
                    if (pos.y != undefined)
                        if (pos.y < 0) {
                            o.position.add(new THREE.Vector3(0, min.y, 0));
                            o.geometry.translate(0, max.y - 2 * centerPos.y, 0);
                        }
                        else if (pos.y > 0) {
                            o.position.add(new THREE.Vector3(0, max.y, 0));
                            o.geometry.translate(0, min.y - 2 * centerPos.y, 0);
                        }
                        else {
                            o.position.add(new THREE.Vector3(0, centerPos.y, 0));
                            o.geometry.translate(0, -centerPos.y, 0);
                        }
                    if (pos.z != undefined)
                        if (pos.z < 0) {
                            o.position.add(new THREE.Vector3(0, 0, min.z));
                            o.geometry.translate(0, 0, max.z - 2 * centerPos.z);
                        }
                        else if (pos.z > 0) {
                            o.position.add(new THREE.Vector3(0, 0, max.z));
                            o.geometry.translate(0, 0, min.z - 2 * centerPos.z);
                        }
                        else {
                            o.position.add(new THREE.Vector3(0, 0, centerPos.z));
                            o.geometry.translate(0, 0, -centerPos.z);
                        }
                }
                const originGroup = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                const originDragger = originGroup?.children[0];
                originGroup?.position.copy(o.position);
                originDragger?.position.set(0, 0, 0);
            }
            // o.geometry.translate(0.1, 0, 0);
        }

    }

    return (
        isGeometryMode && controlsObject3D &&
        <Draggable handle=".handle" positionOffset={{ x: 200, y: 200 }}>
            <div style={{ background: "#212121", position: "absolute", width: 250 }}>
                <div style={{ padding: "0" }} className="handle">
                    <Divider style={{ fontSize: 2 }} />
                </div>
                <ConfigProvider theme={themeConfig}>
                    <Text>Origin Point</Text>
                    <Divider />
                    <Row align="middle" justify="center">
                        <Space align="center">
                            <Space.Compact block direction="vertical">
                                <Space.Compact style={{ marginBottom: "5px" }} block>
                                    <Button style={{ margin: "auto", width: "33.3%" }} children={"Center"} onClick={() => setOriginPoint(undefined, true)} />
                                </Space.Compact>
                                <Space.Compact block>
                                    <Button style={{ width: "33.3%" }} children={"+𝑋"} onClick={() => setOriginPoint({ x: 1 })} />
                                    <Button style={{ width: "33.3%" }} children={"+𝑌"} onClick={() => setOriginPoint({ y: 1 })} />
                                    <Button style={{ width: "33.3%" }} children={"+𝑍"} onClick={() => setOriginPoint({ z: 1 })} />
                                </Space.Compact>
                                <Space.Compact block>
                                    <Button style={{ width: "33.3%" }} children={"𝑋"} onClick={() => setOriginPoint({ x: 0 })} />
                                    <Button style={{ width: "33.3%" }} children={"𝑌"} onClick={() => setOriginPoint({ y: 0 })} />
                                    <Button style={{ width: "33.3%" }} children={"𝑍"} onClick={() => setOriginPoint({ z: 0 })} />
                                </Space.Compact>
                                <Space.Compact block>
                                    <Button style={{ width: "33.3%" }} children={"-𝑋"} onClick={() => setOriginPoint({ x: -1 })} />
                                    <Button style={{ width: "33.3%" }} children={"-𝑌"} onClick={() => setOriginPoint({ y: -1 })} />
                                    <Button style={{ width: "33.3%" }} children={"-𝑍"} onClick={() => setOriginPoint({ z: -1 })} />
                                </Space.Compact>
                            </Space.Compact>
                        </Space>
                    </Row>
                </ConfigProvider>
            </div>
        </Draggable>
    )
})