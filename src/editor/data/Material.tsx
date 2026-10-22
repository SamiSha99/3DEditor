import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemCollapse, ItemNumber, ItemSelect, ItemTexture, ItemVector2, ItemGroup, ItemInput, ItemEuler, ItemRow, ItemSection, ItemTable } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01 } from '@orb_UI/controller/items/Item';
import { useState } from 'react';
import { Alert, Button } from 'antd';
import { ItemColor } from '@orb_UI/controller/items/ItemColor';
import { useViewport } from 'src/store/Viewport';
import { useEditor } from '@orb_Editor';
import { EyeOutlined } from '@ant-design/icons';
import { passParameters } from '@orb_utils/three/Material';
import * as INTERFACES from 'src/store/Interfaces';

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
    { value: "MeshPhysicalMaterial", label: "Physical" },
] as { value: string, label: string }[];

// ################### //
// MATERIAL INTERFACES //
// ################### //

interface Material { material?: THREE.Material }
interface MeshStandardMaterial { material: THREE.MeshStandardMaterial }
interface MeshBasicMaterial { material: THREE.MeshBasicMaterial }
interface MeshPhongMaterial { material: THREE.MeshPhongMaterial }
interface MeshToonMaterial { material: THREE.MeshToonMaterial }
interface MeshDepthMaterial { material: THREE.MeshDepthMaterial }
interface MeshLambertMaterial { material: THREE.MeshLambertMaterial }
interface MeshMatcapMaterial { material: THREE.MeshMatcapMaterial }
interface MeshNormalMaterial { material: THREE.MeshNormalMaterial }
interface MeshPhysicalMaterial { material: THREE.MeshPhysicalMaterial }

// ### //
// END //
// ### //

export const InspectorMaterial = observer((props: Material) => {
    const { material } = props;
    const { target, setTarget } = useViewport();
    const { scene } = useEditor();
    const [meshMaterial, setMeshMaterial] = useState(material);
    const [, setUpdate] = useState(false);
    const update = () => { setUpdate((prev) => !prev); meshMaterial && needsUpdate(meshMaterial); };
    
    const references: THREE.Object3D[] = [];
    scene.traverse((o) => {
        if (o instanceof THREE.Mesh && (Array.isArray(o.material) && o.material.includes(material) || o.material == material)) {
            references.push(o);
        }
    });
    
    const dataSource = references ? references.map((r) => {
        return {
            key: r.id,
            index: r.id,
            name: r.name,
            typeClass: r.type,
            action: <Button disabled={target == r} icon={< EyeOutlined />} onClick={() => { setTarget(r) }} />
        }
    }) : undefined;
    
    return (
        <>
            <ItemCollapse label={"References"} collapsed={true}>
                <ItemRow layout="full">
                    <Alert showIcon type="info" message={`Material is referenced in ${references.length} object${references.length > 1 ? "s" : ""}.`} />
                </ItemRow>
                <ItemTable
                    layout="full"
                    style={{ border: "1px solid grey" }}
                    showHeader={false}
                    columns={[
                        { dataIndex: 'index' },
                        { dataIndex: 'name', width: "100%" },
                        { dataIndex: 'typeClass' },
                        { dataIndex: 'action' }
                    ]}
                    dataSource={dataSource}
                />
            </ItemCollapse>
            <ItemCollapse label={"Material"}>
                {/* Change material type */}
                <MaterialSetter material={material} onSet={(m) => { setMeshMaterial(m) }} />
                {/* Material Properties */}
                {
                    meshMaterial &&
                    <>
                        <ItemInput object={meshMaterial} variable="name" labelInVariable />
                        <ItemGroup label="UUID" sizes={["75%", "25%"]} tooltip={"Universally unique identifier"}>
                            <ItemInput object={meshMaterial} variable="uuid" readonly />
                            <ItemButton buttonName="New UUID" onClick={() => { (meshMaterial as { uuid: string }).uuid = THREE.MathUtils.generateUUID() }} size='small' />
                        </ItemGroup>
                        <ItemGroup label={"Version"} sizes={[3,1]} tooltip={"Automatically increments whenever an update to the material is required."}>
                            <ItemNumber object={meshMaterial} variable="version" readonly />
                            <ItemButton buttonName="Update" onClick={() => { update() }} size='small' />
                        </ItemGroup>
                        <ItemBoolean object={meshMaterial} variable="transparent" labelInVariable onChange={() => { update() }} />
                        <ItemNumber object={meshMaterial} variable="opacity" labelInVariable limit={LIMIT_01} disabled={!meshMaterial.transparent} tooltip={"Requires \"Transparent\"."} />
                        <ItemBoolean object={meshMaterial} variable="visible" labelInVariable />
                        <ItemBoolean object={meshMaterial} variable="vertexColors" labelInVariable onChange={() => { update() }} />

                    </>
                }
            </ItemCollapse>
            {/* Don't render if its the parent */}
            {
                meshMaterial && meshMaterial.constructor != THREE.Material &&
                <ItemCollapse label={meshMaterial.type} children={<ChildMaterial material={meshMaterial} />} />
            }
        </>
    );
})

type MaterialSetter = {
    material?: THREE.Material | THREE.Material[],
    allowNullType?: boolean,
    onSet?: (material?: THREE.Material) => void,
}

export const MaterialSetter = observer((props: MaterialSetter) => {
    const { material, allowNullType, onSet } = props;
    const { target } = useViewport();

    const instantiateMaterial = (value: string) => {
        let mat: THREE.Material | undefined;

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
            case "undefined": mat = new THREE.Material(); mat.name = "empty"; break;
            default: return;
        }

        if (target instanceof THREE.Mesh) {
            const oldMaterial = target.material as THREE.Material;
            passParameters(oldMaterial, mat);
            target.material = mat;
            needsUpdate(mat);
            onSet && onSet(mat)
            oldMaterial.dispose();
        }
    }

    return (
        <>
            <ItemSelect
                object={{ Materials: allowNullType ? MaterialSelect : MaterialSelect.filter(v => v.value != "undefined") }}
                variable="Materials"
                label="Material"
                defaultValue={material && !Array.isArray(material) && material.type != "Material" ? material.type.replace("Mesh", "").replace("Material", "") : "None"}
                onChangeSelect={(s) => {
                    const str = s as unknown as string;
                    instantiateMaterial(str)
                }} />
        </>
    )
})

export const ChildMaterial = observer((props: Material) => {
    const { material } = props;
    switch (material!.constructor) {
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



const StandardMaterial = observer((props: MeshStandardMaterial) => {
    const { material } = props;
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



const BasicMaterial = observer((props: MeshBasicMaterial) => {
    const { material } = props;
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

const PhongMaterial = observer((props: MeshPhongMaterial) => {
    const { material } = props;
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

const ToonMaterial = observer((props: MeshToonMaterial) => {
    const { material } = props;
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
            <ItemSection label="Gradient" />
            <ItemTexture object={material} variable="gradientMap" label="Map" />
            {/* END GRADIENT */}
            <Light material={material} />
            <Normal material={material} />
        </>
    )
})

const DepthMaterial = observer((props: MeshDepthMaterial) => {
    const { material } = props;
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

const LambertMaterial = observer((props: MeshLambertMaterial) => {
    const { material } = props;
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

const MatCapMaterial = observer((props: MeshMatcapMaterial) => {
    const { material } = props;
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

const NormalMaterial = observer((props: MeshNormalMaterial) => {
    const { material } = props;
    return (
        <>
            <ItemBoolean object={material} variable="flatShading" labelInVariable />
            <Bump material={material} />
            <Displacement material={material} />
            <Normal material={material} />
        </>
    )
})

const PhysicalMaterial = observer((props: MeshPhysicalMaterial) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="General" />
            <ItemNumber object={material} variable="ior" label="IOR" tooltip="Index Of Refraction" />
            {/**
            * Related to IOR! 
            * https://github.com/mrdoob/three.js/blob/master/src/materials/MeshPhysicalMaterial.js#L34-L45 
            * to-do maybe implement a fake sync to IOR?
            */}
            {/* <ItemNumber object={material} variable="reflectivity" label="Reflectivity" /> */}
            <ItemNumber object={material} variable="dispersion" label="Dispersion" />
            <ItemNumber object={material} variable="thickness" label="Thickness" />
            <ItemTexture object={material} variable="thicknessMap" label="Thickness Map" />

            <ItemSection label="Anisotropy" />
            <ItemNumber object={material} variable="anisotropy" label="Anisotropy" />
            <ItemNumber object={material} variable="anisotropyRotation" label="Rotation" />
            <ItemTexture object={material} variable="anisotropyMap" label="Map" />

            <ItemSection label="Clearcoat" />
            <ItemNumber object={material} variable="clearcoat" label="Clearcoat" />
            <ItemNumber object={material} variable="clearcoatRoughness" label="Roughness" />
            <ItemVector2 object={material} variable="clearcoatNormalScale" label="Normal Scale" />
            <ItemTexture object={material} variable="clearcoatMap" label="Map" />
            <ItemTexture object={material} variable="clearcoatRoughnessMap" label="Roughness Map" />
            <ItemTexture object={material} variable="clearcoatNormalMap" label="Normal Map" />

            <ItemSection label="Iridescence" />
            <ItemNumber object={material} variable="iridescence" label="Iridescence" />
            <ItemNumber object={material} variable="iridescenceIOR" label="IOR" tooltip="Iridescence's Index Of Refraction" />
            <ItemTexture object={material} variable="iridescenceMap" label="Map" />
            {/* Bad [number, number]! Won't work with Vector2 */}
            {/* <ItemNumber object={material} variable="iridescenceThicknessRange" /> */}

            <ItemSection label="Sheen" />
            <ItemNumber object={material} variable="sheen" label="Sheen" />
            <ItemColor object={material} variable="sheenColor" label="Color" />
            <ItemNumber object={material} variable="sheenRoughness" label="Roughness" />
            <ItemTexture object={material} variable="sheenColorMap" label="Color Map" />
            <ItemTexture object={material} variable="sheenRoughnessMap" label="Roughness Map" />

            <ItemSection label="Attenuation" />
            <ItemNumber object={material} variable="attenuationDistance" label="Distance" />
            <ItemColor object={material} variable="attenuationColor" label="Color" />

            <ItemSection label="Specular" />
            <ItemNumber object={material} variable="specularIntensity" label="Intensity" />
            <ItemColor object={material} variable="specularColor" label="Color" />
            <ItemTexture object={material} variable="specularIntensityMap" label="Intensity Map" />
            <ItemTexture object={material} variable="specularColorMap" label="Color Map" />

            <ItemSection label="Transmission" />
            <ItemNumber object={material} variable="transmission" label="Transmission" />
            <ItemTexture object={material} variable="transmissionMap" label="Map" />

            <ItemCollapse label={"MeshStandardMaterial"}>
                <StandardMaterial material={material} />
            </ItemCollapse>
        </>
    )
})

// ################ //
// GROUP COMPONENTS //
// ################ //

const Alpha = observer((props: INTERFACES.Alpha) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Alpha" />
            <ItemTexture object={material} variable="alphaMap" label="Map" />
        </>
    )
})

const AmbientOcclusion = observer((props: INTERFACES.AmbientOcclusion) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Ambient Occlusion" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
        </>
    )
})

const Bump = observer((props: INTERFACES.Bump) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Bump" />
            <ItemTexture object={material} variable="bumpMap" label="Map" />
            <ItemNumber object={material} variable="bumpScale" label="Scale" />
        </>
    )
})

const Displacement = observer((props: INTERFACES.Displacement) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Displacement" />
            <ItemTexture object={material} variable="displacementMap" label="Map" />
            <ItemNumber object={material} variable="displacementScale" label="Scale" />
            <ItemNumber object={material} variable="displacementBias" label="Bias" />
        </>
    )
})

const Emissive = observer((props: INTERFACES.Emissive) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Emissive" />
            <ItemTexture object={material} variable="emissiveMap" label="Map" />
            <ItemColor object={material} variable="emissive" label="Color" allowClear />
            <ItemNumber object={material} variable="emissiveIntensity" label="Scale" />
        </>
    )
})

const Environment = observer((props: INTERFACES.Environment) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Environment" />
            {/* to-do EquirectangularReflectionMapping and EquirectangularRefractionMapping are two different things for differnet purposes! We need to make modifying textures directly important */}
            <ItemTexture object={material} variable="envMap" label="Map" onChange={(v) => { v!.mapping = THREE.EquirectangularReflectionMapping }} />
            <ItemEuler object={material} variable="envMapRotation" label="Map Rotation" isDegree />
        </>
    )
})

const Light = observer((props: INTERFACES.Light) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Light" />
            <ItemTexture object={material} variable="lightMap" label="Map" />
            <ItemNumber object={material} variable="lightMapIntensity" label="Map" />
        </>
    )
})

const Normal = observer((props: INTERFACES.Normal) => {
    const { material } = props;
    const NormalTypesSelect = [
        { value: THREE.TangentSpaceNormalMap, label: "Tangent Space" },
        { value: THREE.ObjectSpaceNormalMap, label: "Object Space" }
    ]

    return (
        <>
            <ItemSection label="Normal" />
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

const Roughness = observer((props: INTERFACES.Roughness) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Roughness" />
            <ItemTexture object={material} variable="roughnessMap" label="Map" />
            <ItemNumber object={material} variable="roughness" label="Intensity" />
        </>
    )
})

const Specular = observer((props: INTERFACES.Specular) => {
    const { material } = props;
    return (
        <>
            <ItemSection label="Specular" />
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

const Reflectivity = observer((props: INTERFACES.Reflectivity) => {
    const { material } = props;
    const CombineSelect = [
        { value: THREE.MultiplyOperation, label: "Multiply" },
        { value: THREE.MixOperation, label: "Mix" },
        { value: THREE.AddOperation, label: "Add" }
    ]

    return (
        <>
            <ItemSection label="Reflectivity" />
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