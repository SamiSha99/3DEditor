import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemCollapse, ItemNumber, ItemSelect, ItemTexture, ItemVector2, ItemGroup, ItemInput, ItemEuler } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01 } from '@orb_UI/controller/items/Item';
import { useStores } from '@orb_App';
import { useState } from 'react';
import { Divider } from 'antd';
import { ItemColor } from '@orb_UI/controller/items/ItemColor';

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

const NormalTypesSelect = [
    { value: THREE.TangentSpaceNormalMap, label: "Tangent Space" },
    { value: THREE.ObjectSpaceNormalMap, label: "Object Space" }
]

const CombineSelect = [
    { value: THREE.MultiplyOperation, label: "Multiply" },
    { value: THREE.MixOperation, label: "Mix" },
    { value: THREE.AddOperation, label: "Add" }
]

export const InspectorMaterial: React.FC<{ material?: THREE.Material }> = observer(({ material }) => {
    const { controlsObject3D } = useStores();
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

        if (controlsObject3D instanceof THREE.Mesh) {
            const oldMaterial = controlsObject3D.material as THREE.Material;
            // mat.copy(oldMaterial)
            controlsObject3D.material = mat;
            (controlsObject3D.material as THREE.Material).needsUpdate = true;
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
                            <ItemButton object={meshMaterial} variable="version" buttonName="Regenerate" onClick={() => { meshMaterial.uuid = THREE.MathUtils.generateUUID() }} size='small' />
                        </ItemGroup>
                        <ItemGroup label={"Version"} sizes={["75%", "25%"]} tooltip={"Automatically increments whenever an update to the material is required."}>
                            <ItemNumber object={meshMaterial} variable="version" readonly />
                            <ItemButton object={meshMaterial} variable="version" buttonName="Update" onClick={() => needsUpdate(meshMaterial)} size='small' />
                        </ItemGroup>
                        <ItemBoolean object={meshMaterial} variable="transparent" labelInVariable onChange={() => needsUpdate(meshMaterial)} />
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
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* AO */}
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
            {/* Emissive */}
            <Divider children="Emissive" orientation="left" />
            <ItemTexture object={material} variable="emissiveMap" label="Map" />
            <ItemColor object={material} variable="emissive" label="Color" allowClear />
            <ItemNumber object={material} variable="emissiveIntensity" label="Scale" />
            {/* Environment */}
            <Divider children="Environment" orientation="left" />
            <ItemTexture object={material} variable="envMap" label="Map" />
            <ItemEuler object={material} variable="envMapRotation" label="Map Rotation" isDegree />
            {/* Light */}
            <Divider children="Light" orientation="left" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
            {/* Normal */}
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
            {/* Roughness */}
            <Divider children="Roughness" orientation="left" />
            <ItemTexture object={material} variable="roughnessMap" label="map" />
            <ItemNumber object={material} variable="roughness" label="Intensity" />
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
            <ItemNumber object={material} variable="refractionRatio" labelInVariable limit={LIMIT_01} />
            <ItemNumber object={material} variable="reflectivity" labelInVariable />
            <ItemSelect
                object={{ combines: CombineSelect }}
                variable="combines"
                label="Reflectivity Combine"
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
                }} />
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* AO */}
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            {/* Environment */}
            <Divider children="Environment" orientation="left" />
            <ItemTexture object={material} variable="envMap" label="Map" />
            <ItemEuler object={material} variable="envMapRotation" label="Map Rotation" isDegree />
            {/* Light */}
            <Divider children="Light" orientation="left" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
            {/* Specular */}
            <Divider children="Specular" orientation="left" />
            <ItemTexture object={material} variable="specularMap" label="Map" />
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
            <ItemNumber object={material} variable="refractionRatio" labelInVariable limit={LIMIT_01} />
            <ItemNumber object={material} variable="reflectivity" labelInVariable />
            <ItemSelect
                object={{ combines: CombineSelect }}
                variable="combines"
                label="Reflectivity Combine"
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
                }} />
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* AO */}
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Environment */}
            <Divider children="Environment" orientation="left" />
            <ItemTexture object={material} variable="envMap" label="Map" />
            <ItemEuler object={material} variable="envMapRotation" label="Map Rotation" isDegree />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
            {/* Emissive */}
            <Divider children="Emissive" orientation="left" />
            <ItemTexture object={material} variable="emissiveMap" label="Map" />
            <ItemColor object={material} variable="emissive" label="Color" allowClear />
            <ItemNumber object={material} variable="emissiveIntensity" label="Scale" />
            {/* Light */}
            <Divider children="Light" orientation="left" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
            {/* Normal */}
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
            {/* Specular */}
            <Divider children="Specular" orientation="left" />
            <ItemTexture object={material} variable="specularMap" label="Map" />
            <ItemNumber object={material} variable="shininess" labelInVariable step={1} />
            <ItemColor object={material} variable="specular" labelInVariable />
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
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* AO */}
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
            {/* Emissive */}
            <Divider children="Emissive" orientation="left" />
            <ItemTexture object={material} variable="emissiveMap" label="Map" />
            <ItemColor object={material} variable="emissive" label="Color" allowClear />
            <ItemNumber object={material} variable="emissiveIntensity" label="Scale" />
            {/* Gradient */}
            {/* TO-DO: THE TEXTURE NEEDS TO BE A VERY SPECIFIC TYPE -> THREE.NearestFilter */}
            <Divider children="Gradient" orientation="left" />
            <ItemTexture object={material} variable="gradientMap" label="Map" />
            {/* Light */}
            <Divider children="Light" orientation="left" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
            {/* Normal */}
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

const DepthMaterial: React.FC<{ material: THREE.MeshDepthMaterial }> = observer(({ material }) => {
    return (
        <>

            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemColor object={material} variable="color" labelInVariable />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />

            {/* It's specified as a constant, avoid? */}
            {/* <ItemNumber object={material} variable="depthPacking" labelInVariable /> */}
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* AO */}
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
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
            <ItemNumber object={material} variable="refractionRatio" labelInVariable limit={LIMIT_01} />
            <ItemNumber object={material} variable="reflectivity" labelInVariable />
            <ItemSelect
                object={{ combines: CombineSelect }}
                variable="combines"
                label="Reflectivity Combine"
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
            {/* It's specified as a constant, avoid? */}
            {/* <ItemNumber object={material} variable="depthPacking" labelInVariable /> */}
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
            {/* Emissive */}
            <Divider children="Emissive" orientation="left" />
            <ItemTexture object={material} variable="emissiveMap" label="Map" />
            <ItemColor object={material} variable="emissive" label="Color" allowClear />
            <ItemNumber object={material} variable="emissiveIntensity" label="Scale" />
            {/* Environment */}
            <Divider children="Environment" orientation="left" />
            <ItemTexture object={material} variable="envMap" label="Map" />
            <ItemEuler object={material} variable="envMapRotation" label="Map Rotation" isDegree />
            {/* Light */}
            <Divider children="Light" orientation="left" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
            {/* Normal */}
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
            {/* Specular */}
            <Divider children="Specular" orientation="left" />
            <ItemTexture object={material} variable="specularMap" label="Map" />
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
            {/* It's specified as a constant, avoid? */}
            {/* <ItemNumber object={material} variable="depthPacking" labelInVariable /> */}
            {/* Alpha */}
            <Divider children="Alpha" orientation="left" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
            {/* Normal */}
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

const NormalMaterial: React.FC<{ material: THREE.MeshNormalMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemBoolean object={material} variable="flatShading" labelInVariable />
            {/* Bump */}
            <Divider children="Bump" orientation="left" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
            {/* Displacement */}
            <Divider children="Displacement" orientation="left" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
            {/* Normal */}
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

const PhysicalMaterial: React.FC<{ material: THREE.MeshPhysicalMaterial }> = observer(({ material }) => {
    return (
        <>
            <StandardMaterial material={material} />
            {/* to-do add physical material */}
        </>
    )
})