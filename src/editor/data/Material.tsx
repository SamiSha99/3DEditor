import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemGroup, ItemNumber, ItemSelect, ItemTexture, ItemVector2 } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01_CLAMPED } from '@orb_UI/controller/items/Item';
import { useStores } from '@orb_App';
import { useState } from 'react';

const MaterialSelect = [
    { value: "MeshBasicMaterial", label: "Basic" },
    { value: "MeshStandardMaterial", label: "Standard" },
    { value: "MeshPhongMaterial", label: "Phong" },
    { value: "MeshToonMaterial", label: "Toon" },
    { value: "MeshDepthMaterial", label: "Depth" },
    { value: "MeshDistanceMaterial", label: "Distance" },
    { value: "MeshLambertMaterial", label: "Lambert" },
    { value: "MeshMatcapMaterial", label: "Matcap" },
    { value: "MeshNormalMaterial", label: "Normal" },
    { value: "MeshPhysicalMaterial", label: "Physical" },
] as { value: string, label: string }[];

export const InspectorMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
    const { controlsObject3D } = useStores();
    const [meshMaterial, setMeshMaterial] = useState(material);

    const instantiateMaterial = (value: string) => {
        let newMat: THREE.Material;
        console.log(value);
        switch (value) {
            case "MeshBasicMaterial":
                newMat = new THREE.MeshBasicMaterial();
                console.log(newMat);
                break;
            case "MeshStandardMaterial":
                newMat = new THREE.MeshStandardMaterial();
                break;
            case "MeshPhongMaterial":
                newMat = new THREE.MeshPhongMaterial();
                break;
            case "MeshToonMaterial":
                newMat = new THREE.MeshToonMaterial();
                break;
            case "MeshDepthMaterial":
                newMat = new THREE.MeshDepthMaterial();
                break;
            case "MeshDistanceMaterial":
                newMat = new THREE.MeshDistanceMaterial();
                break;
            case "MeshLambertMaterial":
                newMat = new THREE.MeshLambertMaterial();
                break;
            case "MeshMatcapMaterial":
                newMat = new THREE.MeshMatcapMaterial();
                break;
            case "MeshNormalMaterial":
                newMat = new THREE.MeshNormalMaterial();
                break;
            case "MeshPhysicalMaterial":
                newMat = new THREE.MeshPhysicalMaterial();
                break;
            default:
                return;
        }

        if (controlsObject3D instanceof THREE.Mesh) {
            // newMat.copy(controlsObject3D.material)
            controlsObject3D.material = newMat;
            (controlsObject3D.material as THREE.Material).needsUpdate = true;
            console.log(controlsObject3D);
            setMeshMaterial(newMat)
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
                <ItemButton object={material} buttonName="Force Update" variable="version" onClick={() => { material.needsUpdate = true }} />
            </ItemGroup>
            {/* Don't render if its the parent */}
            {meshMaterial.constructor != THREE.Material && <ItemGroup label={meshMaterial.constructor.name} children={<ChildMaterial material={meshMaterial} />} />}
        </>
    );
})

export const ChildMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
    switch (material.constructor) {
        case THREE.MeshBasicMaterial:
            return <>Basic, basic on what?</>
        case THREE.MeshStandardMaterial:
            return <InspectorMeshStandardMaterial material={material as THREE.MeshStandardMaterial} />
    }
})

const InspectorMeshStandardMaterial: React.FC<{ material: THREE.MeshStandardMaterial }> = observer(({ material }) => {
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