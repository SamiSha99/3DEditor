import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemColorPicker, ItemGroup, ItemNumber, ItemSelect, ItemTexture, ItemVector2 } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01_CLAMPED } from '@orb_UI/controller/items/Item';
import { useStores } from '@orb_App';
import { useState } from 'react';

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

export const InspectorMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
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
            <ItemGroup label={THREE.Material.name}>
                <ItemSelect
                    defaultValue={material.constructor.name.replace("Mesh", "").replace("Material", "")}
                    object={{ Materials: MaterialSelect }}
                    variable="Materials"
                    label="Type"
                    onChangeSelect={(s) => { const str = s as unknown as string; instantiateMaterial(str) }} />
                <ItemButton object={material} buttonName="Force Update" variable="version" onClick={() => needsUpdate(material)} />
                <ItemNumber object={material} variable="opacity" limit={LIMIT_01_CLAMPED} />
                {/* <ItemNumber object={material} variable="_alphaTest" limit={LIMIT_01_CLAMPED} /> */}
                <ItemBoolean object={material} variable="transparent" onChange={() => needsUpdate(material)} />
                <ItemBoolean object={material} variable="visible" />
            </ItemGroup>
            {/* Don't render if its the parent */}
            {meshMaterial.constructor != THREE.Material && <ItemGroup label={meshMaterial.constructor.name} children={<ChildMaterial material={meshMaterial} />} />}
        </>
    );
})

export const ChildMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
    switch (material.constructor) {
        case THREE.MeshBasicMaterial:
            return <BasicMaterial material={material as THREE.MeshBasicMaterial} />
        case THREE.MeshStandardMaterial:
            return <StandardMaterial material={material as THREE.MeshStandardMaterial} />
    }
})

const StandardMaterial: React.FC<{ material: THREE.MeshStandardMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" />
            <ItemNumber object={material} variable="metalness" limit={LIMIT_01_CLAMPED} />
            <ItemNumber object={material} variable="roughness" limit={LIMIT_01_CLAMPED} />
            <ItemNumber object={material} variable="opacity" limit={LIMIT_01_CLAMPED} />
            <ItemNumber object={material} variable="_alphaTest" limit={LIMIT_01_CLAMPED} label="Alpha Test" />
            <ItemBoolean object={material} variable="wireframe" />
            <ItemBoolean object={material} variable="transparent" />
            <ItemBoolean object={material} variable="fog" />
            <ItemBoolean object={material} variable="flatShading" />
            <ItemGroup label={"Ambient Occlusion"}>
                <ItemTexture object={material} variable="aoMap" label="Map" />
                <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01_CLAMPED} />
            </ItemGroup>
            <ItemGroup label={"Normal"}>
                <ItemTexture object={material} variable="normalMap" label="Map" />
                <ItemVector2 object={material} variable="normalScale" label="Scale" />
                <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01_CLAMPED} />
            </ItemGroup>
        </>
    )
})

const BasicMaterial: React.FC<{ material: THREE.MeshBasicMaterial }> = observer(({ material }) => {
    return (
        <>
            <ItemTexture object={material} variable="map" />
            <ItemNumber object={material} variable="metalness" limit={LIMIT_01_CLAMPED} />
            <ItemNumber object={material} variable="roughness" limit={LIMIT_01_CLAMPED} />
            <ItemNumber object={material} variable="opacity" limit={LIMIT_01_CLAMPED} />
            <ItemBoolean object={material} variable="wireframe" />
            <ItemBoolean object={material} variable="transparent" />
            <ItemBoolean object={material} variable="fog" />
            <ItemBoolean object={material} variable="flatShading" />
            <ItemGroup label={"Ambient Occlusion"}>
                <ItemTexture object={material} variable="aoMap" label="Map" />
                <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01_CLAMPED} />
            </ItemGroup>
            <ItemGroup label={"Normal"}>
                <ItemTexture object={material} variable="normalMap" label="Map" />
                <ItemVector2 object={material} variable="normalScale" label="Scale" />
                <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01_CLAMPED} />
            </ItemGroup>
        </>
    )
})