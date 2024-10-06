
import { useStores } from "@orb_App";
import { ItemBoolean, ItemCollapse, ItemGroup, ItemInput, ItemNumber, ItemSelect, ItemVector2, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { Limit, LIMIT_01 } from "@orb_UI/controller/items/Item";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from 'three'

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
    const { controlsObject3D } = useStores();
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

        if (controlsObject3D instanceof THREE.Mesh) {
            controlsObject3D.geometry.dispose();
            controlsObject3D.geometry = undefined;
            controlsObject3D.geometry = geo;
            setG(geo)
        }
    }
    return (
        <>
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
                <ItemGroup label="Attributes">
                    <ItemInput object={{ count: "Position: " + g.getAttribute("position").count }} variable="count" readonly />
                    <ItemInput object={{ count: "Normal: " + g.getAttribute("normal").count }} variable="count" readonly />
                    <ItemInput object={{ count: "UV: " + g.getAttribute("uv").count }} variable="count" readonly />
                    <ItemInput object={{ count: "Index: " + g.index?.count }} variable="count" readonly />
                </ItemGroup>
            </ItemCollapse>
            <ItemCollapse label={g.type}>
                <ChildGeometry geometry={g} />
            </ItemCollapse>
        </>
    );
})

export const ChildGeometry: React.FC<{ geometry: THREE.BufferGeometry }> = observer(({ geometry }) => {

    switch (geometry.constructor) {
        case THREE.BoxGeometry: return <InspectorBoxGeometry geometry={geometry as THREE.BoxGeometry} />;
        case THREE.CylinderGeometry: return <InspectorCylinderGeometry geometry={geometry as THREE.CylinderGeometry} />;
        case THREE.ConeGeometry: return <InspectorCylinderGeometry geometry={geometry as THREE.ConeGeometry} />;
        case THREE.PlaneGeometry: return <InspectorPlaneGeometry geometry={geometry as THREE.PlaneGeometry} />;
        case THREE.CapsuleGeometry: return <InspectorCapsuleGeometry geometry={geometry as THREE.CapsuleGeometry} />;
        case THREE.TorusGeometry: return <InspectorTorusGeometry geometry={geometry as THREE.TorusGeometry} />;
        case THREE.IcosahedronGeometry: return <InspectorIcosahedronGeometry geometry={geometry as THREE.IcosahedronGeometry} />;
    }
})

export const InspectorBoxGeometry: React.FC<{ geometry: THREE.BoxGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const width = geometry.parameters.width;
    const height = geometry.parameters.height;
    const depth = geometry.parameters.depth;
    const widthSegments = geometry.parameters.widthSegments;
    const heightSegments = geometry.parameters.heightSegments;
    const depthSegments = geometry.parameters.depthSegments;

    const onChange = (p: { w?: number, h?: number, d?: number, wS?: number, hS?: number, dS?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.BoxGeometry).parameters;
            (controlsObject3D.geometry as THREE.BoxGeometry).dispose();
            controlsObject3D.geometry = new THREE.BoxGeometry(
                p.w != undefined ? p.w : old.width,
                p.h != undefined ? p.h : old.height,
                p.d != undefined ? p.d : old.depth,
                p.wS != undefined ? p.wS : old.widthSegments,
                p.hS != undefined ? p.hS : old.heightSegments,
                p.dS != undefined ? p.dS : old.depthSegments
            );
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
export const InspectorCylinderGeometry: React.FC<{ geometry: THREE.CylinderGeometry | THREE.ConeGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const radiusTop = geometry instanceof THREE.ConeGeometry ? 0 : geometry.parameters.radiusTop;
    const radiusBottom = geometry instanceof THREE.ConeGeometry ? geometry.parameters.radius : geometry.parameters.radiusBottom;
    const height = geometry.parameters.height;
    const radialSegments = geometry.parameters.radialSegments;
    const heightSegments = geometry.parameters.heightSegments;
    const openEnded = geometry.parameters.openEnded;
    const thetaStart = geometry.parameters.thetaStart;
    const thetaLength = geometry.parameters.thetaLength;

    const onChange = (p: { rT?: number, rB?: number, h?: number, rS?: number, hS?: number, openEnded?: boolean, tS?: number, tL?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.CylinderGeometry).parameters;
            controlsObject3D.geometry.dispose();
            switch (geometry.constructor) {
                case THREE.ConeGeometry:
                    controlsObject3D.geometry = new THREE.ConeGeometry(
                        p.rB != undefined ? p.rB : old.radiusBottom, // Radius of cone
                        p.h != undefined ? p.h : old.height,
                        p.rS != undefined ? p.rS : old.radialSegments,
                        p.hS != undefined ? p.hS : old.heightSegments,
                        p.openEnded != undefined ? p.openEnded : old.openEnded,
                        p.tS != undefined ? p.tS : old.thetaStart,
                    );
                    break;
                case THREE.CylinderGeometry:
                    controlsObject3D.geometry = new THREE.CylinderGeometry(
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

export const InspectorPlaneGeometry: React.FC<{ geometry: THREE.PlaneGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const width = geometry.parameters.width;
    const height = geometry.parameters.height;
    const widthSegments = geometry.parameters.widthSegments;
    const heightSegments = geometry.parameters.heightSegments;

    const onChange = (p: { w?: number, h?: number, wS?: number, hS?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.PlaneGeometry).parameters;
            (controlsObject3D.geometry as THREE.PlaneGeometry).dispose();
            controlsObject3D.geometry = new THREE.PlaneGeometry(
                p.w != undefined ? p.w : old.width,
                p.h != undefined ? p.h : old.height,
                p.wS != undefined ? p.wS : old.widthSegments,
                p.hS != undefined ? p.hS : old.heightSegments,
            );
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

export const InspectorCapsuleGeometry: React.FC<{ geometry: THREE.CapsuleGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const radius = geometry.parameters.radius;
    const length = geometry.parameters.length;
    const capSegments = geometry.parameters.capSegments;
    const radialSegments = geometry.parameters.radialSegments;

    const onChange = (p: { r?: number, l?: number, cS?: number, rS?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.CapsuleGeometry).parameters;
            (controlsObject3D.geometry as THREE.CapsuleGeometry).dispose();
            controlsObject3D.geometry = new THREE.CapsuleGeometry(
                p.r != undefined ? p.r : old.radius,
                p.l != undefined ? p.l : old.length,
                p.cS != undefined ? p.cS : old.capSegments,
                p.rS != undefined ? p.rS : old.radialSegments,
            );
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

export const InspectorTorusGeometry: React.FC<{ geometry: THREE.TorusGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const radius = geometry.parameters.radius;
    const tube = geometry.parameters.tube;
    const radialSegments = geometry.parameters.radialSegments;
    const tubularSegments = geometry.parameters.tubularSegments;
    const arc = geometry.parameters.arc;

    const onChange = (p: { r?: number, t?: number, rS?: number, tS?: number, a?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.TorusGeometry).parameters;
            (controlsObject3D.geometry as THREE.TorusGeometry).dispose();
            controlsObject3D.geometry = new THREE.TorusGeometry(
                p.r != undefined ? p.r : old.radius,
                p.t != undefined ? p.t : old.tube,
                p.rS != undefined ? p.rS : old.radialSegments,
                p.tS != undefined ? p.tS : old.tubularSegments,
                p.a != undefined ? p.a : old.arc
            );
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

export const InspectorIcosahedronGeometry: React.FC<{ geometry: THREE.IcosahedronGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const radius = geometry.parameters.radius;
    const detail = geometry.parameters.detail;

    const onChange = (p: { r?: number, d?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.IcosahedronGeometry).parameters;
            (controlsObject3D.geometry as THREE.IcosahedronGeometry).dispose();
            controlsObject3D.geometry = new THREE.IcosahedronGeometry(
                p.r != undefined ? p.r : old.radius,
                p.d != undefined ? p.d : old.detail,
            );
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