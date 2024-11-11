
import { useEditor } from "@orb_Editor";
import { useDeltaTime, useOnUnmount } from "@orb_Hooks";
import { ItemBoolean, ItemButton, ItemCollapse, ItemGroup, ItemNumber, ItemRadioButton, ItemSelect, ItemVector2, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { Limit } from "@orb_UI/controller/items/Item";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from 'three'

import { Space, Button, Checkbox, Tooltip, Form, Divider } from "antd";
import { SpaceCompactProps } from "antd/es/space/Compact";
import { useViewport } from "src/store/Viewport";
import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons";

const GEOMETRY_SEGMENTS_LIMIT = { min: 0, max: 100 } as Limit;
const GEOMETRY_SEGMENTS_LIMIT_VECTOR_2 = { x: GEOMETRY_SEGMENTS_LIMIT, y: GEOMETRY_SEGMENTS_LIMIT };
const GEOMETRY_SEGMENTS_LIMIT_VECTOR_3 = { x: GEOMETRY_SEGMENTS_LIMIT, y: GEOMETRY_SEGMENTS_LIMIT, z: GEOMETRY_SEGMENTS_LIMIT };

const GeometrySelect = [
    { value: "BoxGeometry", label: "Box" },
    { value: "CylinderGeometry", label: "Cylinder" },
    { value: "ConeGeometry", label: "Cone" },
    { value: "PlaneGeometry", label: "Plane" },
    { value: "CapsuleGeometry", label: "Capsule" },
    { value: "TorusGeometry", label: "Torus" },
    { value: "IcosahedronGeometry", label: "Icosahedron" }
] as { value: string, label: string }[];

export const InspectorGeometry: React.FC<{ geometry: THREE.BufferGeometry }> = observer(({ geometry }) => {
    const { target } = useViewport();
    const [g, setG] = useState(geometry);

    const instantiateGeometry = (value: string) => {
        let geo: THREE.BufferGeometry;
        console.log(value);
        switch (value) {
            case "BoxGeometry": geo = new THREE.BoxGeometry(); break;
            case "CylinderGeometry": geo = new THREE.CylinderGeometry(); break;
            case "PlaneGeometry": geo = new THREE.PlaneGeometry(); break;
            case "CapsuleGeometry": geo = new THREE.CapsuleGeometry(); break;
            case "TorusGeometry": geo = new THREE.TorusGeometry(); break;
            case "ConeGeometry": geo = new THREE.ConeGeometry(); break;
            case "IcosahedronGeometry": geo = new THREE.IcosahedronGeometry(); break;
            default: return;
        }

        if (target instanceof THREE.Mesh) {
            target.geometry.dispose();
            target.geometry = undefined;
            target.geometry = geo;
            setG(geo)
        }
    }

    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {

    });

    return (
        <>
            <ItemCollapse label="Tools">
                <GeometryTools />
            </ItemCollapse>
            <ItemCollapse label={"BufferGeometry"}>
                <ItemSelect
                    object={{ Geometries: GeometrySelect }}
                    variable="Geometries"
                    label="Type"
                    defaultValue={g ? g.type.replace("Geometry", "") : "None"}
                    onChangeSelect={(s) => {
                        const str = s as unknown as string;
                        instantiateGeometry(str)
                    }} />
                <ItemGroup label="Attributes" sizes={["50%", "50%", "50%", "50%"]}>
                    <ItemNumber addonBefore="Position" object={{ count: g.getAttribute("position").count }} variable="count" readonly />
                    <ItemNumber addonBefore="Normal" object={{ count: g.getAttribute("normal").count }} variable="count" readonly />
                    <ItemNumber addonBefore="UV" object={{ count: g.getAttribute("uv").count }} variable="count" readonly />
                    <ItemNumber addonBefore="Index" object={{ count: g.index?.count }} variable="count" readonly />
                </ItemGroup>
            </ItemCollapse>
            <ItemCollapse label={g.type}>
                <ChildGeometry geometry={g} onChange={(g) => setG(g)} />
            </ItemCollapse>
        </>
    );
})

const GeometryTools = observer(() => {
    const { flag, hasFlag } = useEditor();
    const { transformControlsMode, setTransformControlsMode } = useViewport();
    const [enabled, setEnabled] = useState(hasFlag("geometry_tools"));

    useOnUnmount(() => { flag(["geometry_tools", "drag_object"], true) }, [])

    return (
        <>
            <ItemBoolean object={{ bool: enabled }}
                variable="bool"
                label="Activate"
                onChange={(v) => { flag("geometry_tools", !v), setEnabled(v) }} />
            {
                enabled &&
                <>
                    <ItemRadioButton
                        label="Mode"
                        defaultValue={transformControlsMode}
                        onClick={(v) => setTransformControlsMode(v as "translate" | "rotate" | "scale")}
                        props={[
                            { value: "translate", children: <><DragOutlined /> Translate</> },
                            { value: "rotate", children: <><SyncOutlined /> Rotate</> },
                            { value: "scale", children: <><ExpandAltOutlined /> Scale</> },
                        ]}
                    />
                    {transformControlsMode == "translate" && <GeometryToolsTranslation />}
                    {transformControlsMode == "rotate" && <GeometryToolsRotate />}
                    {transformControlsMode == "scale" && <GeometryToolsScale />}
                </>
            }
        </>
    )
})

const spaceCompactProps: SpaceCompactProps = { style: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5px" }, block: true }
const spaceCompactPropsButtons: SpaceCompactProps = { style: { display: "flex", justifyContent: "center", alignItems: "center" } }

const GeometryToolsTranslation = () => {
    const { target } = useViewport();
    const { scene, flag } = useEditor();
    const [onConstraintObject, setOnConstraintObject] = useState(false);

    const setOriginPoint = (pos?: { x?: number, y?: number, z?: number }, center?: boolean) => {
        if (!target) return;
        if (target instanceof THREE.Mesh && target.geometry instanceof THREE.BufferGeometry) {
            const geometry = target.geometry;
            geometry.computeBoundingBox();
            if (geometry.boundingBox) {
                const size = new THREE.Vector3();
                const centerPos = new THREE.Vector3();
                geometry.boundingBox.getCenter(centerPos);
                geometry.boundingBox.getSize(size);
                const min = geometry.boundingBox.min
                const max = geometry.boundingBox.max
                if (center) {
                    target.geometry.center();
                    !onConstraintObject && target.position.add(centerPos);
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

                    geometry.translate(transAdd.x, transAdd.y, transAdd.z);
                    !onConstraintObject && target.position.add(objAdd);
                }
                const originGroup = scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
                const originDragger = originGroup?.children[0];
                originGroup?.position.copy(target.position);
                originDragger?.position.set(0, 0, 0);
            }
        }
    }

    useOnUnmount(() => { flag(["drag_object"], true) }, [])

    return (
        <>
            <Divider children="Translate" orientation="left" />
            <Form.Item label="Controls">
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)", borderRadius: "10px 0 0 0" }} children={"-𝑋"} onClick={() => setOriginPoint({ x: -1 })} />
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)" }} children={"𝑋"} onClick={() => setOriginPoint({ x: 0 })} />
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)", borderRadius: "0 10px 0 0" }} children={"+𝑋"} onClick={() => setOriginPoint({ x: 1 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)" }} children={"-𝑌"} onClick={() => setOriginPoint({ y: -1 })} />
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)" }} children={"𝑌"} onClick={() => setOriginPoint({ y: 0 })} />
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)" }} children={"+𝑌"} onClick={() => setOriginPoint({ y: 1 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)", borderRadius: "0 0 0 10px" }} children={"-𝑍"} onClick={() => setOriginPoint({ z: -1 })} />
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)" }} children={"𝑍"} onClick={() => setOriginPoint({ z: 0 })} />
                    <Button disabled={!target} style={{ width: "min(33.3%, 50px)", borderRadius: "0 0 10px 0" }} children={"+𝑍"} onClick={() => setOriginPoint({ z: 1 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactProps}>
                    <Tooltip title="While enabled, moves the Object while keeping the origin point in place.">
                        <Checkbox
                            // disabled={true}
                            children={"Lock Origin Point"}
                            defaultChecked={onConstraintObject}
                            onChange={(e) => {
                                setOnConstraintObject(e.target.checked);
                                flag("drag_object", !e.target.checked);
                            }} />
                    </Tooltip>
                </Space.Compact>
                <Space.Compact {...spaceCompactProps}>
                    <Button disabled={!target} style={{ margin: "auto", width: "50px" }} children={"Center"} onClick={() => setOriginPoint(undefined, true)} />
                </Space.Compact>
            </Form.Item>
        </>
    )
}

const GeometryToolsRotate = () => {
    const { target } = useViewport();

    const doRotation = (rot?: { x?: number, y?: number, z?: number }) => {
        console.log(rot);
        rot?.x && (target as THREE.Mesh).geometry.rotateX(rot.x);
        rot?.y && (target as THREE.Mesh).geometry.rotateY(rot.y);
        rot?.z && (target as THREE.Mesh).geometry.rotateZ(rot.z);
    }

    return (
        <>
            <Divider children="Rotate" orientation="left" />
            <Form.Item label="Controls">
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "10px 0 0 0" }} children={"-45 𝑋"} onClick={() => doRotation({ x: -Math.PI / 4 })} />
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "0 10px 0 0" }} children={"+45 𝑋"} onClick={() => doRotation({ x: Math.PI / 4 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(50%, 50px)" }} children={"-45 𝑌"} onClick={() => doRotation({ y: -Math.PI / 4 })} />
                    <Button disabled={!target} style={{ width: "min(50%, 50px)" }} children={"+45 𝑌"} onClick={() => doRotation({ y: Math.PI / 4 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "0 0 0 10px" }} children={"-45 𝑍"} onClick={() => doRotation({ z: -Math.PI / 4 })} />
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "0 0 10px 0" }} children={"+45 𝑍"} onClick={() => doRotation({ z: Math.PI / 4 })} />
                </Space.Compact>
            </Form.Item>
        </>
    )
}

const GeometryToolsScale = () => {
    const { target } = useViewport();

    const doScale = (scal?: { x?: number, y?: number, z?: number }) => {
        if (!scal) return;
        if (scal.x == undefined) scal.x = 1;
        if (scal.y == undefined) scal.y = 1;
        if (scal.z == undefined) scal.z = 1;
        (target as THREE.Mesh).geometry.scale(scal.x, scal.y, scal.z);
    }

    return (
        <>
            <Divider children="Scale" orientation="left" />
            <Form.Item label="Controls">
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "10px 0 0 0" }} children={"x0.5 𝑋"} onClick={() => doScale({ x: 0.5 })} />
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "0 10px 0 0" }} children={"x2 𝑋"} onClick={() => doScale({ x: 2 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(50%, 50px)" }} children={"x0.5 𝑌"} onClick={() => doScale({ y: 0.5 })} />
                    <Button disabled={!target} style={{ width: "min(50%, 50px)" }} children={"x2 𝑌"} onClick={() => doScale({ y: 2 })} />
                </Space.Compact>
                <Space.Compact {...spaceCompactPropsButtons}>
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "0 0 0 10px" }} children={"x0.5 𝑍"} onClick={() => doScale({ z: 0.5 })} />
                    <Button disabled={!target} style={{ width: "min(50%, 50px)", borderRadius: "0 0 10px 0" }} children={"x2 𝑍"} onClick={() => doScale({ z: 2 })} />
                </Space.Compact>
            </Form.Item>
        </>
    )
}

export const ChildGeometry: React.FC<{ geometry: THREE.BufferGeometry, onChange: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onChange }) => {

    switch (geometry.constructor) {
        case THREE.BoxGeometry: return <InspectorBoxGeometry geometry={geometry as THREE.BoxGeometry} onNewGeometry={onChange} />;
        case THREE.CylinderGeometry: return <InspectorCylinderGeometry geometry={geometry as THREE.CylinderGeometry} onNewGeometry={onChange} />;
        case THREE.ConeGeometry: return <InspectorCylinderGeometry geometry={geometry as THREE.ConeGeometry} onNewGeometry={onChange} />;
        case THREE.PlaneGeometry: return <InspectorPlaneGeometry geometry={geometry as THREE.PlaneGeometry} onNewGeometry={onChange} />;
        case THREE.CapsuleGeometry: return <InspectorCapsuleGeometry geometry={geometry as THREE.CapsuleGeometry} onNewGeometry={onChange} />;
        case THREE.TorusGeometry: return <InspectorTorusGeometry geometry={geometry as THREE.TorusGeometry} onNewGeometry={onChange} />;
        case THREE.IcosahedronGeometry: return <InspectorIcosahedronGeometry geometry={geometry as THREE.IcosahedronGeometry} onNewGeometry={onChange} />;
    }
})

export const InspectorBoxGeometry: React.FC<{ geometry: THREE.BoxGeometry, onNewGeometry: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onNewGeometry }) => {
    const { target } = useViewport();

    const width = geometry.parameters.width;
    const height = geometry.parameters.height;
    const depth = geometry.parameters.depth;
    const widthSegments = geometry.parameters.widthSegments;
    const heightSegments = geometry.parameters.heightSegments;
    const depthSegments = geometry.parameters.depthSegments;

    const onChange = (p: { w?: number, h?: number, d?: number, wS?: number, hS?: number, dS?: number }) => {
        if (target instanceof THREE.Mesh) {
            const old = (target.geometry as THREE.BoxGeometry).parameters;
            (target.geometry as THREE.BoxGeometry).dispose();
            target.geometry = new THREE.BoxGeometry(
                p.w != undefined ? p.w : old.width,
                p.h != undefined ? p.h : old.height,
                p.d != undefined ? p.d : old.depth,
                p.wS != undefined ? p.wS : old.widthSegments,
                p.hS != undefined ? p.hS : old.heightSegments,
                p.dS != undefined ? p.dS : old.depthSegments
            );
            onNewGeometry(target.geometry);
        }
    }

    return (
        <>
            <ItemVector3
                object={{ size: new THREE.Vector3(width, height, depth) }}
                variable="size"
                labelInVariable
                labelVector={{ x: "Width", y: "Height", z: "Depth" }}
                onChange={(v) => {
                    onChange({ w: v.x, h: v.y, d: v.z });
                }}
            />
            <ItemVector3
                object={{ segments: new THREE.Vector3(widthSegments, heightSegments, depthSegments) }}
                variable="segments"
                labelInVariable
                limit={GEOMETRY_SEGMENTS_LIMIT_VECTOR_3}
                labelVector={{ x: "Width", y: "Height", z: "Depth" }}
                onChange={(v) => {
                    onChange({ wS: v.x, hS: v.y, dS: v.z });
                }}
            />
        </>
    )
})

// Cone is a child of Cylinder
export const InspectorCylinderGeometry: React.FC<{ geometry: THREE.CylinderGeometry | THREE.ConeGeometry, onNewGeometry: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onNewGeometry }) => {
    const { target } = useViewport();

    const radiusTop = geometry instanceof THREE.ConeGeometry ? 0 : geometry.parameters.radiusTop;
    const radiusBottom = geometry instanceof THREE.ConeGeometry ? geometry.parameters.radius : geometry.parameters.radiusBottom;
    const height = geometry.parameters.height;
    const radialSegments = geometry.parameters.radialSegments;
    const heightSegments = geometry.parameters.heightSegments;
    const openEnded = geometry.parameters.openEnded;
    const thetaStart = geometry.parameters.thetaStart;
    const thetaLength = geometry.parameters.thetaLength;

    const onChange = (p: { rT?: number, rB?: number, h?: number, rS?: number, hS?: number, openEnded?: boolean, tS?: number, tL?: number }) => {
        if (target instanceof THREE.Mesh) {
            const old = (target.geometry as THREE.CylinderGeometry).parameters;
            target.geometry.dispose();
            switch (geometry.constructor) {
                case THREE.ConeGeometry:
                    target.geometry = new THREE.ConeGeometry(
                        p.rB != undefined ? p.rB : old.radiusBottom, // Radius of cone
                        p.h != undefined ? p.h : old.height,
                        p.rS != undefined ? p.rS : old.radialSegments,
                        p.hS != undefined ? p.hS : old.heightSegments,
                        p.openEnded != undefined ? p.openEnded : old.openEnded,
                        p.tS != undefined ? p.tS : old.thetaStart,
                    );
                    break;
                case THREE.CylinderGeometry:
                    target.geometry = new THREE.CylinderGeometry(
                        p.rT != undefined ? p.rT : old.radiusTop,
                        p.rB != undefined ? p.rB : old.radiusBottom,
                        p.h != undefined ? p.h : old.height,
                        p.rS != undefined ? p.rS : old.radialSegments,
                        p.hS != undefined ? p.hS : old.heightSegments,
                        p.openEnded != undefined ? p.openEnded : old.openEnded,
                        p.tS != undefined ? p.tS : old.thetaStart,
                        p.tL != undefined ? p.tL : old.thetaLength
                    );
            }
            onNewGeometry(target.geometry);
        }
    }

    return (
        <>
            <ItemNumber
                object={{ height: height }}
                variable="height"
                labelInVariable
                onChange={(v) => onChange({ h: v })}
            />
            {
                (() => {
                    if (geometry instanceof THREE.ConeGeometry)
                        return <ItemNumber
                            object={{ radiusBottom: radiusBottom }}
                            variable="radiusBottom"
                            label="Radius"
                            onChange={(v) => onChange({ rB: v })}
                        />
                    else
                        return <ItemVector2
                            object={{ radius: new THREE.Vector2(radiusTop, radiusBottom) }}
                            variable="radius"
                            labelInVariable
                            labelVector={{ x: "Top", y: "Bottom" }}
                            onChange={(v) => onChange({ rT: v.x, rB: v.y })}
                        />
                })()
            }
            <ItemVector2
                object={{ segments: new THREE.Vector2(radialSegments, heightSegments) }}
                variable="segments"
                labelInVariable
                limit={GEOMETRY_SEGMENTS_LIMIT_VECTOR_2}
                labelVector={{ x: "Radial", y: "Height" }}
                onChange={(v) => {
                    onChange({ rS: v.x, hS: v.y });
                }}
            />
            {
                (() => {
                    if (geometry instanceof THREE.ConeGeometry)
                        return <ItemNumber
                            object={{ thetaStart: thetaStart }}
                            variable="thetaStart"
                            label="Start"
                            labelInVariable
                            onChange={(v) => onChange({ tS: v })}
                        />
                    else
                        return <ItemVector2
                            object={{ theta: new THREE.Vector2(thetaStart, thetaLength) }}
                            variable="theta"
                            labelInVariable
                            labelVector={{ x: "Start", y: "Length" }}
                            onChange={(v) => {
                                onChange({ tS: v.x, tL: v.y });
                            }}
                        />
                })()
            }
            <ItemBoolean
                object={{ openEnded: openEnded }}
                variable={"openEnded"}
                labelInVariable
                onChange={(v) => onChange({ openEnded: v })}
            />
        </>
    )
})

export const InspectorPlaneGeometry: React.FC<{ geometry: THREE.PlaneGeometry, onNewGeometry: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onNewGeometry }) => {
    const { target } = useViewport();

    const width = geometry.parameters.width;
    const height = geometry.parameters.height;
    const widthSegments = geometry.parameters.widthSegments;
    const heightSegments = geometry.parameters.heightSegments;

    const onChange = (p: { w?: number, h?: number, wS?: number, hS?: number }) => {
        if (target instanceof THREE.Mesh) {
            const old = (target.geometry as THREE.PlaneGeometry).parameters;
            (target.geometry as THREE.PlaneGeometry).dispose();
            target.geometry = new THREE.PlaneGeometry(
                p.w != undefined ? p.w : old.width,
                p.h != undefined ? p.h : old.height,
                p.wS != undefined ? p.wS : old.widthSegments,
                p.hS != undefined ? p.hS : old.heightSegments,
            );
            onNewGeometry(target.geometry);
        }
    }

    return (
        <>
            <ItemVector2
                object={{ size: new THREE.Vector2(width, height) }}
                variable="size"
                labelInVariable
                labelVector={{ x: "Width", y: "Height" }}
                onChange={(v) => {
                    onChange({ w: v.x, h: v.y });
                }}
            />
            <ItemVector2
                object={{ segments: new THREE.Vector2(widthSegments, heightSegments) }}
                variable="segments"
                labelInVariable
                limit={GEOMETRY_SEGMENTS_LIMIT_VECTOR_2}
                labelVector={{ x: "Width", y: "Height" }}
                onChange={(v) => {
                    onChange({ wS: v.x, hS: v.y });
                }}
            />
        </>
    )
})

export const InspectorCapsuleGeometry: React.FC<{ geometry: THREE.CapsuleGeometry, onNewGeometry: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onNewGeometry }) => {
    const { target } = useViewport();

    const radius = geometry.parameters.radius;
    const length = geometry.parameters.length;
    const capSegments = geometry.parameters.capSegments;
    const radialSegments = geometry.parameters.radialSegments;

    const onChange = (p: { r?: number, l?: number, cS?: number, rS?: number }) => {
        if (target instanceof THREE.Mesh) {
            const old = (target.geometry as THREE.CapsuleGeometry).parameters;
            (target.geometry as THREE.CapsuleGeometry).dispose();
            target.geometry = new THREE.CapsuleGeometry(
                p.r != undefined ? p.r : old.radius,
                p.l != undefined ? p.l : old.length,
                p.cS != undefined ? p.cS : old.capSegments,
                p.rS != undefined ? p.rS : old.radialSegments,
            );
            onNewGeometry(target.geometry);
        }
    }

    return (
        <>
            <ItemNumber
                object={{ radius: radius }}
                variable="radius"
                labelInVariable
                onChange={(v) => onChange({ r: v })}
            />
            <ItemNumber
                object={{ length: length }}
                variable="length"
                labelInVariable
                onChange={(v) => onChange({ l: v })}
            />
            <ItemVector2
                object={{ segments: new THREE.Vector2(capSegments, radialSegments) }}
                variable="segments"
                labelInVariable
                labelVector={{ x: "Cap", y: "Radial" }}
                limit={GEOMETRY_SEGMENTS_LIMIT_VECTOR_2}
                onChange={(v) => {
                    onChange({ cS: v.x, rS: v.y });
                }}
            />
        </>
    )
})

export const InspectorTorusGeometry: React.FC<{ geometry: THREE.TorusGeometry, onNewGeometry: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onNewGeometry }) => {
    const { target } = useViewport();

    const radius = geometry.parameters.radius;
    const tube = geometry.parameters.tube;
    const radialSegments = geometry.parameters.radialSegments;
    const tubularSegments = geometry.parameters.tubularSegments;
    const arc = geometry.parameters.arc;

    const onChange = (p: { r?: number, t?: number, rS?: number, tS?: number, a?: number }) => {
        if (target instanceof THREE.Mesh) {
            const old = (target.geometry as THREE.TorusGeometry).parameters;
            (target.geometry as THREE.TorusGeometry).dispose();
            target.geometry = new THREE.TorusGeometry(
                p.r != undefined ? p.r : old.radius,
                p.t != undefined ? p.t : old.tube,
                p.rS != undefined ? p.rS : old.radialSegments,
                p.tS != undefined ? p.tS : old.tubularSegments,
                p.a != undefined ? p.a : old.arc
            );
            onNewGeometry(target.geometry);
        }
    }

    return (
        <>
            <ItemNumber
                object={{ radius: radius }}
                variable="radius"
                labelInVariable
                onChange={(v) => onChange({ r: v })}
            />
            <ItemNumber
                object={{ tube: tube }}
                variable="tube"
                labelInVariable
                onChange={(v) => onChange({ t: v })}
            />
            {/* to-do make this radial to degree */}
            <ItemNumber
                object={{ arc: arc }}
                variable="arc"
                labelInVariable
                onChange={(v) => onChange({ a: v })}
            />
            <ItemVector2
                object={{ segments: new THREE.Vector2(radialSegments, tubularSegments) }}
                variable="segments"
                labelInVariable
                labelVector={{ x: "Radial", y: "Tubular" }}
                limit={GEOMETRY_SEGMENTS_LIMIT_VECTOR_2}
                onChange={(v) => {
                    onChange({ rS: v.x, tS: v.y });
                }}
            />
        </>
    )
})

export const InspectorIcosahedronGeometry: React.FC<{ geometry: THREE.IcosahedronGeometry, onNewGeometry: (geometry: THREE.BufferGeometry) => void }> = observer(({ geometry, onNewGeometry }) => {
    const { target } = useViewport();

    const radius = geometry.parameters.radius;
    const detail = geometry.parameters.detail;

    const onChange = (p: { r?: number, d?: number }) => {
        if (target instanceof THREE.Mesh) {
            const old = (target.geometry as THREE.IcosahedronGeometry).parameters;
            (target.geometry as THREE.IcosahedronGeometry).dispose();
            target.geometry = new THREE.IcosahedronGeometry(
                p.r != undefined ? p.r : old.radius,
                p.d != undefined ? p.d : old.detail,
            );
            onNewGeometry(target.geometry);
        }
    }

    return (
        <>
            <ItemNumber
                object={{ radius: radius }}
                variable="radius"
                labelInVariable
                onChange={(v) => onChange({ r: v })}
            />
            <ItemNumber
                object={{ detail: detail }}
                variable="detail"
                labelInVariable
                onChange={(v) => onChange({ d: v })}
                limit={{ min: 0, max: 5 }}
                stepSlider={1}
            />
        </>
    )
})