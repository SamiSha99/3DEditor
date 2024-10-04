
import { useStores } from "@orb_App";
import { ItemCollapse, ItemGroup, ItemInput, ItemNumber, ItemSelect, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from 'three'

const GeometrySelect = [
    { value: "BoxGeometry", label: "Box" },
    { value: "CylinderGeometry", label: "Cylinder" },
    { value: "PlaneGeometry", label: "Plane" },
    { value: "CapsuleGeometry", label: "Capsule" },
    { value: "TorusGeometry", label: "Torus" },
    { value: "ConeGeometry", label: "Cone" },
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
        // case THREE.MeshStandardMaterial: return <StandardMaterial material={material as THREE.MeshStandardMaterial} />;
    }
})

export const InspectorBoxGeometry: React.FC<{ geometry: THREE.BoxGeometry }> = observer(({ geometry }) => {
    const { controlsObject3D } = useStores();

    const parameters = geometry.parameters;

    const onChange = (p: { w?: number, h?: number, d?: number, wS?: number, hS?: number, dS?: number }) => {
        if (controlsObject3D instanceof THREE.Mesh) {
            const old = (controlsObject3D.geometry as THREE.BoxGeometry).parameters;
            (controlsObject3D.geometry as THREE.BoxGeometry).dispose();
            controlsObject3D.geometry = new THREE.BoxGeometry(
                p.w ? p.w : old.width,
                p.h ? p.h : old.height,
                p.d ? p.d : old.depth,
                p.wS ? p.wS : old.widthSegments,
                p.hS ? p.hS : old.heightSegments,
                p.dS ? p.dS : old.depthSegments
            );
        }
    }

    return (
        <>
            <ItemVector3
                object={{ edges: new THREE.Vector3(parameters.width, parameters.height, parameters.depth) }}
                variable="edges"
                labelInVariable
                labelVector={{ x: "Width", y: "Height", z: "Depth" }}
                onChange={(v) => {
                    onChange({ w: v.x, h: v.y, d: v.z });
                }}
            />
            <ItemVector3
                object={{ segments: new THREE.Vector3(parameters.widthSegments, parameters.heightSegments, parameters.depthSegments) }}
                variable="segments"
                labelInVariable
                labelVector={{ x: "Width", y: "Height", z: "Depth" }}
                onChange={(v) => {
                    onChange({ wS: v.x, hS: v.y, dS: v.z });
                }}
            />
        </>
    )
})


