import { useStores } from "@orb_App";
import { Card, Row, Space, Button, Segmented, Checkbox, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import Draggable from "react-draggable";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";


export const OriginPointPanel = observer(() => {
    const { controlsObject3D, scene, setIsOriginPointMode } = useStores();
    const [onConstraintObject, setOnConstraintObject] = useState(false);
    const c = document.getElementsByTagName("canvas")[0];
    console.log(c);
    const bounds = c?.getBoundingClientRect();
    console.log(bounds, bounds?.left, bounds?.right, bounds?.top, bounds?.bottom);

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
                if (center) {
                    o.geometry.center();
                    onConstraintObject && o.position.add(centerPos);
                }
                else if (pos) {
                    const transAdd = new THREE.Vector3();
                    const objAdd = new THREE.Vector3();
                    if (pos.x != undefined) {
                        pos.x < 0 && objAdd.setX(min.x) && transAdd.setX(max.x - 2 * centerPos.x);
                        pos.x > 0 && objAdd.setX(max.x) && transAdd.setX(min.x - 2 * centerPos.x)
                        pos.x == 0 && objAdd.setX(centerPos.x) && transAdd.setX(-centerPos.x);
                    }
                    if (pos.y != undefined) {
                        pos.y < 0 && objAdd.setY(min.y) && transAdd.setY(max.y - 2 * centerPos.y);
                        pos.y > 0 && objAdd.setY(max.y) && transAdd.setY(min.y - 2 * centerPos.y);
                        pos.y == 0 && objAdd.setY(centerPos.y) && transAdd.setY(-centerPos.y);
                    }
                    if (pos.z != undefined) {
                        pos.z < 0 && objAdd.setZ(min.z) && transAdd.setZ(max.z - 2 * centerPos.z);
                        pos.z > 0 && objAdd.setZ(max.z) && transAdd.setZ(min.z - 2 * centerPos.z);
                        pos.z == 0 && objAdd.setZ(centerPos.z) && transAdd.setZ(-centerPos.z);
                    }

                    o.geometry.translate(transAdd.x, transAdd.y, transAdd.z);
                    onConstraintObject && o.position.add(objAdd);
                }
                const originGroup = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                const originDragger = originGroup?.children[0];
                originGroup?.position.copy(o.position);
                originDragger?.position.set(0, 0, 0);
            }
        }

    }

    return (
        controlsObject3D &&
        <div style={{ position: "absolute" }}>
            <Draggable bounds={bounds} handle=".handle" defaultPosition={{ x: (bounds.right - bounds.left) * 0.1, y: (bounds.bottom - bounds.top) * 0.7 }}>
                <Card style={{width: 200}} title={<div className="handle" style={{cursor: "all-scroll"}}>Origin Point</div>}
                    extra={
                        <Button style={{margin: "auto"}} icon={<CloseOutlined />} danger type="text" onClick={() => setIsOriginPointMode(false)} />}>
                    <Row align="middle" justify="center">
                        <Space>
                            <Space.Compact block direction="vertical">
                                <Space.Compact style={{ marginBottom: "5px" }} block>
                                    <Tooltip title="Offsets the object to keep the model in place.">
                                        <Checkbox children={"Constraint Object"} onChange={(e) => setOnConstraintObject(e.target.checked)} />
                                    </Tooltip>
                                </Space.Compact>
                                <Space.Compact style={{ marginBottom: "5px" }} block>
                                    <Button style={{ margin: "auto", width: "33.3%" }} children={"Center"} onClick={() => setOriginPoint(undefined, true)} />
                                </Space.Compact>
                                <Space.Compact block>
                                    <Button style={{ width: "33.3%", borderRadius: "10px 0 0 0" }} children={"-𝑋"} onClick={() => setOriginPoint({ x: -1 })} />
                                    <Button style={{ width: "33.3%" }} children={"𝑋"} onClick={() => setOriginPoint({ x: 0 })} />
                                    <Button style={{ width: "33.3%", borderRadius: "0 10px 0 0" }} children={"+𝑋"} onClick={() => setOriginPoint({ x: 1 })} />
                                </Space.Compact>
                                <Space.Compact block>
                                    <Button style={{ width: "33.3%" }} children={"-𝑌"} onClick={() => setOriginPoint({ y: -1 })} />
                                    <Button style={{ width: "33.3%" }} children={"𝑌"} onClick={() => setOriginPoint({ y: 0 })} />
                                    <Button style={{ width: "33.3%" }} children={"+𝑌"} onClick={() => setOriginPoint({ y: 1 })} />
                                </Space.Compact>
                                <Space.Compact block>
                                    <Button style={{ width: "33.3%", borderRadius: "0 0 0 10px" }} children={"-𝑍"} onClick={() => setOriginPoint({ z: -1 })} />
                                    <Button style={{ width: "33.3%" }} children={"𝑍"} onClick={() => setOriginPoint({ z: 0 })} />
                                    <Button style={{ width: "33.3%", borderRadius: "0 0 10px 0" }} children={"+𝑍"} onClick={() => setOriginPoint({ z: 1 })} />
                                </Space.Compact>
                            </Space.Compact>
                        </Space>
                    </Row>
                </Card>
            </Draggable>
        </div>
    )
})