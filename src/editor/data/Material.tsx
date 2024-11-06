import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemCollapse, ItemNumber, ItemSelect, ItemTexture, ItemVector2, ItemGroup, ItemInput, ItemEuler } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01 } from '@orb_UI/controller/items/Item';
import { useEditor } from '@orb_Editor';
import { useState } from 'react';
import { Divider } from 'antd';
import { ItemColor } from '@orb_UI/controller/items/ItemColor';
import { useViewport } from 'src/store/Viewport';

const needsUpdate = (m: THREE.Material) => { m.needsUpdate = true; }

const MaterialSelect = [
    { value: "MeshBasicMaterial", label: "Basic" },
    { value: "MeshStandardMaterial", label: "Standard" },
    { value: "MeshPhongMaterial", label: "Phong" },
    { value: "MeshToonMaterial", label: "Toon" },
    { value: "MeshDepthMaterial", label: "Depth" },
    // { value: "MeshDistanceMaterial", label: "Distance" },
    { value: "MeshLambertMaterial", label: "Lambert" },
    { value: "MeshMatcapMaterial", label: "Matcap" },
    { value: "MeshNormalMaterial", label: "Normal" },
    // { value: "MeshPhysicalMaterial", label: "Physical" },
] as { value: string, label: string }[];

export const InspectorMaterial: React.FC<{ material?: THREE.Material }> = observer(({ material }) => {
    const { target } = useViewport();
    const [meshMaterial, setMeshMaterial] = useState(material);

    const instantiateMaterial = (value: string) => {
        let mat: THREE.Material;
        console.log(value);
        switch (value) {
            case "MeshBasicMaterial": mat = new THREE.MeshBasicMaterial(); break;
            case "MeshStandardMaterial": mat = new THREE.MeshStandardMaterial(); break;
            case "MeshPhongMaterial": mat = new THREE.MeshPhongMaterial(); break;
            case "MeshToonMaterial": mat = new THREE.MeshToonMaterial(); break;
            case "MeshDepthMaterial": mat = new THREE.MeshDepthMaterial(); break;
            case "MeshDistanceMaterial": mat = new THREE.MeshDistanceMaterial(); break;
            case "MeshLambertMaterial": mat = new THREE.MeshLambertMaterial(); break;
            case "MeshMatcapMaterial": mat = new THREE.MeshMatcapMaterial(); break;
            case "MeshNormalMaterial": mat = new THREE.MeshNormalMaterial(); break;
            case "MeshPhysicalMaterial": mat = new THREE.MeshPhysicalMaterial(); break;
            default: return;
        }

        if (target instanceof THREE.Mesh) {
            const oldMaterial = target.material as THREE.Material;
            // mat.copy(oldMaterial)
            target.material = mat;
            (target.material as THREE.Material).needsUpdate = true;
            setMeshMaterial(mat)
            oldMaterial.dispose();
        }
    }

    return (
        <>
            <ItemCollapse label={THREE.Material.name}>
                {/* Change material type */}
                <ItemSelect
                    object={{ Materials: MaterialSelect }}
                    variable="Materials"
                    label="Type"
                    defaultValue={material ? material.constructor.name.replace("Mesh", "").replace("Material", "") : "None"}
                    onChangeSelect={(s) => {
                        const str = s as unknown as string;
                        instantiateMaterial(str)
                    }} />
                {/* Material Properties */}
                {
                    meshMaterial &&
                    <>
                        <ItemInput object={meshMaterial} variable="name" labelInVariable />
                        <ItemGroup label="UUID" sizes={["75%", "25%"]}>
                            <ItemInput object={meshMaterial} variable="uuid" readonly />
                            <ItemButton buttonName="Regenerate" onClick={() => { meshMaterial.uuid = THREE.MathUtils.generateUUID() }} size='small' />
                        </ItemGroup>
                        <ItemGroup label={"Version"} sizes={["75%", "25%"]} tooltip={"Automatically increments whenever an update to the material is required."}>
                            <ItemNumber object={meshMaterial} variable="version" readonly />
                            <ItemButton buttonName="Update" onClick={() => needsUpdate(meshMaterial)} size='small' />
                        </ItemGroup>
                        <ItemBoolean object={meshMaterial} variable="transparent" labelInVariable onChange={() => { needsUpdate(meshMaterial) }} />
                        <ItemNumber object={meshMaterial} variable="opacity" labelInVariable limit={LIMIT_01} />
                        <ItemBoolean object={meshMaterial} variable="visible" labelInVariable />
                    </>
                }
            </ItemCollapse>
            {/* Don't render if its the parent */}
            {
                meshMaterial && meshMaterial.constructor != THREE.Material &&
                <ItemCollapse label={meshMaterial.constructor.name} children={<ChildMaterial material={meshMaterial} />} />
            }
        </>
    );
})

export const ChildMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
    switch (material.constructor) {
        case THREE.MeshBasicMaterial: return <BasicMaterial material={material as THREE.MeshBasicMaterial} />
        case THREE.MeshStandardMaterial: return <StandardMaterial material={material as THREE.MeshStandardMaterial} />
        case THREE.MeshPhongMaterial: return <PhongMaterial material={material as THREE.MeshPhongMaterial} />
        case THREE.MeshToonMaterial: return <ToonMaterial material={material as THREE.MeshToonMaterial} />
        case THREE.MeshDepthMaterial: return <DepthMaterial material={material as THREE.MeshDepthMaterial} />
        case THREE.MeshLambertMaterial: return <LambertMaterial material={material as THREE.MeshLambertMaterial} />
        case THREE.MeshMatcapMaterial: return <MatCapMaterial material={material as THREE.MeshMatcapMaterial} />
        case THREE.MeshNormalMaterial: return <NormalMaterial material={material as THREE.MeshNormalMaterial} />
        case THREE.MeshPhysicalMaterial: return <PhysicalMaterial material={material as THREE.MeshPhysicalMaterial} />
    }
})

const StandardMaterial: React.FC<{ material: THREE.MeshStandardMaterial }> = observer(({ material }) => {

    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemColor object={material} variable="color" labelInVariable />
            <ItemNumber object={material} variable="metalness" labelInVariable />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="flatShading" labelInVariable />

            <Alpha material={material} />
            <AmbientOcclusion material={material} />
            <Bump material={material} />
            <Displacement material={material} />
            <Emissive material={material} />
            <Environment material={material} />
            <Light material={material} />
            <Normal material={material} />
            <Roughness material={material} />
        </>
    )
})

const BasicMaterial: React.FC<{ material: THREE.MeshBasicMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemColor object={material} variable="color" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />

            <Reflectivity material={material} />

            <Alpha material={material} />
            <AmbientOcclusion material={material} />
            <Environment material={material} />
            <Light material={material} />
            <Specular material={material} />
        </>
    )
})

const PhongMaterial: React.FC<{ material: THREE.MeshPhongMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemColor object={material} variable="color" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="flatShading" labelInVariable />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />

            <Reflectivity material={material} />

            <Alpha material={material} />
            <AmbientOcclusion material={material} />
            <Bump material={material} />
            <Displacement material={material} />
            <Emissive material={material} />
            <Environment material={material} />
            <Light material={material} />
            <Normal material={material} />
            <Specular material={material} />
        </>
    )
})

const ToonMaterial: React.FC<{ material: THREE.MeshToonMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemColor object={material} variable="color" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />

            <Alpha material={material} />
            <AmbientOcclusion material={material} />
            <Bump material={material} />
            <Displacement material={material} />
            <Emissive material={material} />
            {/* BEGIN GRADIENT */}
            {/* TO-DO: THE TEXTURE NEEDS TO BE A VERY SPECIFIC TYPE -> THREE.NearestFilter */}
            <Divider children="Gradient" orientation="left" />
            <ItemTexture object={material} variable="gradientMap" label="Map" />
            {/* END GRADIENT */}
            <Light material={material} />
            <Normal material={material} />
        </>
    )
})

const DepthMaterial: React.FC<{ material: THREE.MeshDepthMaterial }> = observer(({ material }) => {
    return (
        <>

            <ItemTexture object={material} variable="map" labelInVariable />

            <ItemBoolean object={material} variable="wireframe" labelInVariable />

            {/* It's specified as a constant in the docs, avoid? */}
            {/* <ItemNumber object={material} variable="depthPacking" labelInVariable /> */}
            <Alpha material={material} />
            <Displacement material={material} />
        </>
    )
})

const LambertMaterial: React.FC<{ material: THREE.MeshLambertMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="flatShading" labelInVariable />

            <Alpha material={material} />
            <Bump material={material} />
            <Displacement material={material} />
            <Emissive material={material} />
            <Environment material={material} />
            <Light material={material} />
            <Normal material={material} />
            <Specular material={material} />
        </>
    )
})

const MatCapMaterial: React.FC<{ material: THREE.MeshMatcapMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemTexture object={material} variable="matcap" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="flatShading" labelInVariable />

            <Alpha material={material} />
            <Bump material={material} />
            <Displacement material={material} />
            <Normal material={material} />
        </>
    )
})

const NormalMaterial: React.FC<{ material: THREE.MeshNormalMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemBoolean object={material} variable="flatShading" labelInVariable />
            <Bump material={material} />
            <Displacement material={material} />
            <Normal material={material} />
        </>
    )
})

const PhysicalMaterial: React.FC<{ material: THREE.MeshPhysicalMaterial }> = observer(({ material }) => {
    return (
        <>
            <StandardMaterial material={material} />
            {/* to-do add physical material */}
        </>
    )
})

// ###################### //
// BEGIN GROUP COMPONENTS //
// ###################### //

const Alpha = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
        </>
    )
})

const AmbientOcclusion = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
        </>
    )
})

const Bump = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
        </>
    )
})

const Displacement = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
        </>
    )
})

const Emissive = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Emissive" orientation="left" />
            <ItemTexture object={material} variable="emissiveMap" label="Map" />
            <ItemColor object={material} variable="emissive" label="Color" allowClear />
            <ItemNumber object={material} variable="emissiveIntensity" label="Scale" />
        </>
    )
})

const Environment = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Environment" orientation="left" />
            {/* to-do EquirectangularReflectionMapping and EquirectangularRefractionMapping are two different things for differnet purposes! We need to make modifying textures directly important */}
            <ItemTexture object={material} variable="envMap" label="Map" onChange={(v) => { v!.mapping = THREE.EquirectangularReflectionMapping }} />
            <ItemEuler object={material} variable="envMapRotation" label="Map Rotation" isDegree />
        </>
    )
})

const Light = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Light" orientation="left" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
        </>
    )
})

type MaterialWithNormal = THREE.MeshStandardMaterial | THREE.MeshPhongMaterial | THREE.MeshMatcapMaterial | THREE.MeshNormalMaterial | THREE.MeshLambertMaterial | THREE.MeshToonMaterial;
const Normal = observer<{ material: MaterialWithNormal }>(({ material }) => {

    const NormalTypesSelect = [
        { value: THREE.TangentSpaceNormalMap, label: "Tangent Space" },
        { value: THREE.ObjectSpaceNormalMap, label: "Object Space" }
    ]

    return (
        <>
            <Divider children="Normal" orientation="left" />
            <ItemTexture object={material} variable="normalMap" label="Map" />
            <ItemSelect
                object={{ types: NormalTypesSelect }}
                variable="types"
                label="Type"
                defaultValue={material.normalMapType ? "Object Space" : "Tangent Space"}
                onChangeSelect={(s) => {
                    material.normalMapType = parseInt(s as string) ? THREE.ObjectSpaceNormalMap : THREE.TangentSpaceNormalMap;
                }} />
            <ItemVector2 object={material} variable="normalScale" label="Scale" />
        </>
    )
})

const Roughness = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Roughness" orientation="left" />
            <ItemTexture object={material} variable="roughnessMap" label="map" />
            <ItemNumber object={material} variable="roughness" label="Intensity" />
        </>
    )
})

const Specular = observer<{ material: THREE.Material }>(({ material }) => {
    return (
        <>
            <Divider children="Specular" orientation="left" />
            <ItemTexture object={material} variable="specularMap" label="Map" />
            {/* Exclusive to Phong material */}
            {
                material instanceof THREE.MeshPhongMaterial &&
                <>
                    <ItemNumber object={material} variable="shininess" labelInVariable step={1} />
                    <ItemColor object={material} variable="specular" labelInVariable />
                </>
            }
        </>
    )
})

const Reflectivity = observer<{ material: THREE.MeshPhongMaterial | THREE.MeshBasicMaterial }>(({ material }) => {

    const CombineSelect = [
        { value: THREE.MultiplyOperation, label: "Multiply" },
        { value: THREE.MixOperation, label: "Mix" },
        { value: THREE.AddOperation, label: "Add" }
    ]

    return (
        <>
            <Divider children="Reflectivity" orientation="left" />
            <ItemNumber object={material} variable="refractionRatio" labelInVariable limit={LIMIT_01} tooltip="the amount of refracted light on the material." />
            <ItemNumber object={material} variable="reflectivity" label="Amount" limit={LIMIT_01} tooltip="Affects how much the Environment map affects the surface." />
            <ItemSelect
                object={{ combines: CombineSelect }}
                variable="combines"
                label="Type"
                tooltip="Adjust the combination between the surface's color with the environment map."
                defaultValue={
                    (() => {
                        switch (material.combine) {
                            case THREE.MultiplyOperation: return "Multiply";
                            case THREE.MixOperation: return "Mix";
                            case THREE.AddOperation: return "Add";
                            default: return "0";
                        }
                    })()
                }
                onChangeSelect={(s) => {
                    switch (parseInt(s as string)) {
                        case THREE.MultiplyOperation: material.combine = THREE.MultiplyOperation; break;
                        case THREE.MixOperation: material.combine = THREE.MixOperation; break;
                        case THREE.AddOperation: material.combine = THREE.AddOperation; break;
                    }
                }}
            />
        </>
    )
})

// #################### //
// END GROUP COMPONENTS //
// #################### //