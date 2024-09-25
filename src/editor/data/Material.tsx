import * as THREE from 'three'
import { observer } from "mobx-react-lite";
import { ItemBoolean, ItemGroup, ItemNumber, ItemTexture, ItemVector2 } from '@orb_UI/controller/ControllerItems';

export const InspectorMaterial: React.FC<{ material: THREE.Material }> = observer(({ material }) => {

    switch (material.constructor) {
        case THREE.MeshStandardMaterial:
            return <InspectorMeshStandardMaterial material={material as THREE.MeshStandardMaterial} />
    }
    return <>no material lol</>;
})

const InspectorMeshStandardMaterial: React.FC<{ material: THREE.MeshStandardMaterial }> = observer(({ material }) => {
    return (
        <div>
            <ItemTexture object={material} variable="map" />
            <ItemNumber object={material} variable="metalness" limit={{ min: 0, max: 1 }} />
            <ItemNumber object={material} variable="roughness" limit={{ min: 0, max: 1 }} />
            <ItemNumber object={material} variable="opacity" limit={{ min: 0, max: 1 }} />
            <ItemNumber object={material} variable="_alphaTest" limit={{ min: 0, max: 1 }} label="Alpha Test" />
            <ItemBoolean object={material} variable="wireframe" />
            <ItemBoolean object={material} variable="transparent" />
            <ItemBoolean object={material} variable="fog" />
            <ItemBoolean object={material} variable="flatShading" />
            <ItemGroup key={"1"} label={"Ambient Occlusion"}>
                <ItemTexture object={material} variable="aoMap" label="Map" />
                <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            </ItemGroup>
            <ItemGroup key={"1"} label={"Normal"}>
                <ItemTexture object={material} variable="normalMap" label="Map" />
                <ItemVector2 object={material} variable="normalScale" label="Scale" />
                <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
            </ItemGroup>
        </div>
    )
})