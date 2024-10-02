import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemCollapse, ItemNumber, ItemSelect, ItemTexture, ItemVector2, ItemGroup, ItemInput } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01 } from '@orb_UI/controller/items/Item';
import { useStores } from '@orb_App';
import { useState } from 'react';
import { Divider } from 'antd';

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
                        <ItemGroup label={"Version"} sizes={["75%", "25%"]}>
                            <ItemNumber object={meshMaterial} variable="version" readonly />
                            <ItemButton object={meshMaterial} variable="version" buttonName="Update" onClick={() => needsUpdate(meshMaterial)} size='small' />
                        </ItemGroup>
                        <ItemNumber object={meshMaterial} variable="opacity" labelInVariable limit={LIMIT_01} />
                        <ItemBoolean object={meshMaterial} variable="transparent" labelInVariable onChange={() => needsUpdate(meshMaterial)} />
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
    }
})

const StandardMaterial: React.FC<{ material: THREE.MeshStandardMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" labelInVariable />
            <ItemNumber object={material} variable="metalness" labelInVariable limit={LIMIT_01} />
            <ItemNumber object={material} variable="roughness" labelInVariable limit={LIMIT_01} />
            <ItemBoolean object={material} variable="wireframe" labelInVariable />
            <ItemBoolean object={material} variable="transparent" labelInVariable />
            <ItemBoolean object={material} variable="fog" labelInVariable />
            <ItemBoolean object={material} variable="flatShading" labelInVariable />
            <Divider children="Ambient Occlusion" orientation="left" />
            <ItemTexture object={material} variable="aoMap" label="Map" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01} />
            <Divider children="Normal" orientation="left" />
            <ItemTexture object={material} variable="normalMap" label="Map" />
            <ItemVector2 object={material} variable="normalScale" label="Scale" />
            <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01} />

        </>
    )
})

const BasicMaterial: React.FC<{ material: THREE.MeshBasicMaterial }> = observer(({ material }) => {
    return (
        <>
            Basic Material content here
        </>
    )
})