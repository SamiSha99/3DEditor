import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemButton, ItemGroup, ItemNumber, ItemTexture, ItemVector2 } from '@orb_UI/controller/ControllerItems';
import { LIMIT_01_CLAMPED } from '@orb_UI/controller/items/Item';

export const InspectorMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
    switch (material.constructor) {
        case THREE.MeshStandardMaterial:
            return <InspectorMeshStandardMaterial material={material as THREE.MeshStandardMaterial} />
    }
    return <>no material lol</>;
})

export const ParentMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {
    return (
        <ItemGroup key={"1"} label={THREE.Material.name}>
            <ItemButton object={material} buttonName="Force Update" variable="version" onClick={() => { material.needsUpdate = true }} />
        </ItemGroup>
    )
})

const InspectorMeshStandardMaterial: React.FC<{ material: THREE.MeshStandardMaterial }> = observer(({ material }) => {
    return (
        <>
            <ParentMaterial material={material} />
            <ItemGroup key={"1"} label={material.constructor.name}>
                <ItemTexture object={material} variable="map" />
                <ItemNumber object={material} variable="metalness" limit={LIMIT_01_CLAMPED} />
                <ItemNumber object={material} variable="roughness" limit={LIMIT_01_CLAMPED} />
                <ItemNumber object={material} variable="opacity" limit={LIMIT_01_CLAMPED} />
                <ItemNumber object={material} variable="_alphaTest" limit={LIMIT_01_CLAMPED} label="Alpha Test" />
                <ItemBoolean object={material} variable="wireframe" />
                <ItemBoolean object={material} variable="transparent" />
                <ItemBoolean object={material} variable="fog" />
                <ItemBoolean object={material} variable="flatShading" />
                <ItemGroup key={"1"} label={"Ambient Occlusion"}>
                    <ItemTexture object={material} variable="aoMap" label="Map" />
                    <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" limit={LIMIT_01_CLAMPED} />
                </ItemGroup>
                <ItemGroup key={"1"} label={"Normal"}>
                    <ItemTexture object={material} variable="normalMap" label="Map" />
                    <ItemVector2 object={material} variable="normalScale" label="Scale" />
                    <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
                </ItemGroup>
            </ItemGroup>
        </>
    )
})