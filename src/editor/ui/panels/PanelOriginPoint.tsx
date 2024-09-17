import { useStores } from "@orb_App";
import { Row, Space, Button, Checkbox, Tooltip, Alert, Divider, ButtonProps } from "antd";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { useState } from "react";
import { DraggablePanel } from "@orb_UI/ActivePanels";
import { PANEL_ORIGIN_POINT } from "./Panels";
import { SpaceCompactProps } from "antd/es/space/Compact";

const spaceCompactProps: SpaceCompactProps = { style: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5px" }, block: true }
const spaceCompactPropsButtons: SpaceCompactProps = { style: { display: "flex", justifyContent: "center", alignItems: "center" } }

export const PanelOriginPoint = observer(() => {
    const { controlsObject3D, scene, addPanelFlag, removePanelFlag } = useStores();
    const [onConstraintObject, setOnConstraintObject] = useState(true);
    const o = controlsObject3D;

    const setOriginPoint = (pos?: { x?: number, y?: number, z?: number }, center?: boolean) => {
        if (!o) return;
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
                    !onConstraintObject && o.position.add(centerPos);
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
                    !onConstraintObject && o.position.add(objAdd);
                }
                const originGroup = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                const originDragger = originGroup?.children[0];
                originGroup?.position.copy(o.position);
                originDragger?.position.set(0, 0, 0);
            }
        }
    }

    return (
        <DraggablePanel name="Origin Point" identifier={PANEL_ORIGIN_POINT.id}>
            <Row align="middle" justify="center">
                {
                    <Space>
                        <Space.Compact block direction="vertical">
                            <Space.Compact {...spaceCompactProps} style={{ marginBottom: 10 }}>
                                {
                                    o && !(o instanceof THREE.Mesh) &&
                                    <Alert message="Not a Mesh!" type="warning" showIcon />
                                }
                                {
                                    o && o instanceof THREE.Mesh && !(o.geometry instanceof THREE.BufferGeometry) &&
                                    <Alert message="Mesh lacks geometry" type="warning" showIcon />
                                }
                            </Space.Compact>
                            <Space.Compact {...spaceCompactProps}>
                                <Tooltip title="While enabled, moves the Object while keeping the origin point in place.">
                                    <Checkbox
                                        disabled={!controlsObject3D}
                                        children={"Lock Origin Point"}
                                        defaultChecked={onConstraintObject}
                                        onChange={(e) => {
                                            setOnConstraintObject(e.target.checked);
                                            if (e.target.checked)
                                                addPanelFlag("drag_object", PANEL_ORIGIN_POINT);
                                            else
                                                removePanelFlag("drag_object", PANEL_ORIGIN_POINT);
                                        }} />
                                </Tooltip>
                            </Space.Compact>
                            <Space.Compact {...spaceCompactProps}>
                                <Button disabled={!controlsObject3D} style={{ margin: "auto", width: "50px" }} children={"Center"} onClick={() => setOriginPoint(undefined, true)} />
                            </Space.Compact>
                            <Space.Compact {...spaceCompactPropsButtons}>
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)", borderRadius: "10px 0 0 0" }} children={"-𝑋"} onClick={() => setOriginPoint({ x: -1 })} />
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)" }} children={"𝑋"} onClick={() => setOriginPoint({ x: 0 })} />
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)", borderRadius: "0 10px 0 0" }} children={"+𝑋"} onClick={() => setOriginPoint({ x: 1 })} />
                            </Space.Compact>
                            <Space.Compact {...spaceCompactPropsButtons}>
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)" }} children={"-𝑌"} onClick={() => setOriginPoint({ y: -1 })} />
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)" }} children={"𝑌"} onClick={() => setOriginPoint({ y: 0 })} />
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)" }} children={"+𝑌"} onClick={() => setOriginPoint({ y: 1 })} />
                            </Space.Compact>
                            <Space.Compact {...spaceCompactPropsButtons}>
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)", borderRadius: "0 0 0 10px" }} children={"-𝑍"} onClick={() => setOriginPoint({ z: -1 })} />
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)" }} children={"𝑍"} onClick={() => setOriginPoint({ z: 0 })} />
                                <Button disabled={!controlsObject3D} style={{ width: "min(33.3%, 50px)", borderRadius: "0 0 10px 0" }} children={"+𝑍"} onClick={() => setOriginPoint({ z: 1 })} />
                            </Space.Compact>
                        </Space.Compact>
                    </Space>
                }
            </Row>
        </DraggablePanel>
    )
})

export default PanelOriginPoint;