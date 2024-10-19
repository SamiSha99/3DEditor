import { useStores } from "@orb_App";
import { AppStore } from "@orb_AppStore";
import { Environments, environments } from "@orb_types";
import { ItemCollapse, ItemColor, ItemEuler, ItemNumber, ItemSelect, ItemTexture } from "@orb_UI/controller/ControllerItems";
import { Alert } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/Addons";

const environmentOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Samples" },
    { value: 2, label: "Custom Texture" }
]

let lastEnvironmentSample: { name: string, data: THREE.DataTexture } | null;
let lastEnvironmentTexture: THREE.Texture | null;

const backgroundOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Color" },
    { value: 2, label: "Texture" }
]

let lastBackgroundColor: THREE.Color | null = AppStore.DEFAULT_SCENE_BACKGROUND_COLOR.clone();
let lastBackgroundTexture: THREE.Texture | null;

const fogOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Linear" },
    { value: 2, label: "Exponential" }
]

let lastFogLinear: THREE.Fog | null;
let lastFogExp2: THREE.FogExp2 | null;

export const InspectorScene = observer(() => {

    return (
        <>
            <Alert style={{ marginTop: 10, marginBottom: 10 }} type="info" showIcon message="Scene options don't impact the export of the modal." />
            <Background />
            <Environment />
            <Fog />
        </>
    );
})

export const Background = observer(() => {
    const { scene, setBackground } = useStores();
    const [backgroundOption, setBackgroundOption] = useState<number>(() => { return !scene.background ? 0 : (scene.background instanceof THREE.Color ? 1 : 2); });

    const backgroundUI = (selectedBackgroundOption: number) => {
        switch (selectedBackgroundOption) {
            // Adjust THREE.Color
            case 1:
                lastBackgroundColor && setBackground(lastBackgroundColor);
                return <ItemColor object={{ background: scene.background }} variable="background" label="Color" disabledAlpha
                    onChange={(c) => {
                        lastBackgroundColor = c;
                        setBackground(c);
                    }}
                />
            // Adjust by THREE.Texture
            case 2:
                lastBackgroundTexture && setBackground(lastBackgroundTexture);
                return <>
                    <ItemTexture object={scene} variable="background" label="Map"
                        onChange={(v) => {
                            if (v) {
                                setBackground(v);
                                lastBackgroundTexture = v;
                            }
                        }}
                    />
                    <ItemNumber object={scene} variable="backgroundIntensity" label="Intensity" />
                    <ItemNumber object={scene} variable="backgroundBlurriness" label="Blurriness" />
                    <ItemEuler object={scene} variable="backgroundRotation" label="Rotation" isDegree />
                </>
            // Off
            default:
                setBackground(null);
                return <></>;
        }
    }

    return (
        <ItemCollapse label="Background">
            <ItemSelect object={{ type: backgroundOptions }} variable="type" defaultValue={backgroundOptions[backgroundOption].label} labelInVariable onChangeSelect={(s) => setBackgroundOption(s as number)} />
            {backgroundUI(backgroundOption)}
        </ItemCollapse>
    )
})

export const Environment = observer(() => {
    const { scene, setEnvironment } = useStores();
    const [environmentOption, setEnvironmentOption] = useState<number>(() => { return !scene.environment ? 0 : (scene.environment == lastEnvironmentSample?.data ? 1 : 2) });

    const list = (() => {
        let options: { value: string, label: string }[] = [];
        environments.map((e) => {
            const obj = { value: e ? e : "undefined", label: e ? e.replace(/^./, e[0].toUpperCase()) : "None" };
            if (e)
                options.push(obj);
            else
                options.unshift(obj)
        })
        return options;
    })()

    const environmentUI = (selectedEnvironmentOption: number) => {
        switch (selectedEnvironmentOption) {
            // Provided samples from the Drei library
            case 1:
                if (lastEnvironmentSample)
                    setEnvironment(lastEnvironmentSample.data);
                return <ItemSelect object={{ environment: list }} variable="environment" label="Environment"
                    defaultValue={!lastEnvironmentSample ? "None" : lastEnvironmentSample.name.replace(/^./, lastEnvironmentSample.name[0].toUpperCase())}
                    onChangeSelect={(select) => {
                        let v = undefined;
                        if (select == "undefined") {
                            setEnvironment(null);
                            lastEnvironmentSample = null;
                        }
                        else {
                            v = select as Environments

                            loadEnvironmentSample(v!, (o) => {
                                setEnvironment(o.data);
                                lastEnvironmentSample = o;
                            })
                        }
                    }}
                    options={list}
                />
            // Manually upload HDRI files
            case 2:
                if (lastEnvironmentTexture) {
                    setEnvironment(lastEnvironmentTexture);
                }
                return <ItemTexture object={scene} variable="environment" labelInVariable hdr
                    onChange={(t) => {
                        if (t) {
                            t.mapping = THREE.EquirectangularReflectionMapping;
                            setEnvironment(t);
                            lastEnvironmentTexture = scene.environment;
                        }
                    }}
                    onDelete={() => {
                        lastEnvironmentTexture?.dispose();
                        lastEnvironmentTexture = null;
                    }} />
            // Disabled
            case 0: default: setEnvironment(null); return <></>;
        }
    }

    return (
        <ItemCollapse label="Environment">
            <ItemSelect object={{ type: environmentOptions }} variable="type" defaultValue={environmentOptions[environmentOption].label} labelInVariable onChangeSelect={(s) => setEnvironmentOption(s as number)} />
            {environmentUI(environmentOption)}
            {
                environmentOption != 0 &&
                <>
                    <ItemNumber object={scene} variable="environmentIntensity" label="Intensity" />
                    <ItemEuler object={scene} variable="environmentRotation" label="Rotation" isDegree />
                </>
            }
        </ItemCollapse>
    )
})

export const Fog = observer(() => {
    const { scene, setFog } = useStores();
    const [fogOption, setFogOption] = useState<number>(() => { return !scene.fog ? 0 : (scene.fog instanceof THREE.Fog ? 1 : 2) });

    const fogUI = (selectedFogOption: number) => {
        switch (selectedFogOption) {

            case 1:
                if (!lastFogLinear) lastFogLinear = new THREE.Fog(0x000000, 1, 50);
                setFog(lastFogLinear);
                return (
                    <>
                        <ItemColor key="linear" object={scene.fog!} variable="color" labelInVariable />
                        <ItemNumber object={scene.fog!} variable="near" labelInVariable />
                        <ItemNumber object={scene.fog!} variable="far" labelInVariable />
                    </>
                )

            case 2:
                if (!lastFogExp2) lastFogExp2 = new THREE.FogExp2(0x000000);
                setFog(lastFogExp2);
                return (
                    <>
                        <ItemColor key="exponential" object={scene.fog!} variable="color" labelInVariable />
                        <ItemNumber object={scene.fog!} variable="density" labelInVariable />
                    </>
                )
            // Off
            default:
                setFog(null);
                return <></>;
        }
    }

    return (
        <ItemCollapse label="Fog">
            <ItemSelect object={{ type: fogOptions }} variable="type" defaultValue={backgroundOptions[fogOption].label} labelInVariable onChangeSelect={(s) => setFogOption(s as number)} />
            {fogUI(fogOption)}
        </ItemCollapse>
    )

})

const samples = {
    none: null,
    apartment: await import('@pmndrs/assets/hdri/apartment.exr'),
    bridge: await import('@pmndrs/assets/hdri/bridge.exr'),
    city: await import('@pmndrs/assets/hdri/city.exr'),
    dawn: await import('@pmndrs/assets/hdri/dawn.exr'),
    esplanade: await import('@pmndrs/assets/hdri/esplanade.exr'),
    forest: await import('@pmndrs/assets/hdri/forest.exr'),
    hall: await import('@pmndrs/assets/hdri/hall.exr'),
    lab: await import('@pmndrs/assets/hdri/lab.exr'),
    lobby: await import('@pmndrs/assets/hdri/lobby.exr'),
    night: await import('@pmndrs/assets/hdri/night.exr'),
    park: await import('@pmndrs/assets/hdri/park.exr'),
    sky: await import('@pmndrs/assets/hdri/sky.exr'),
    studio: await import('@pmndrs/assets/hdri/studio.exr'),
    sunrise: await import('@pmndrs/assets/hdri/sunrise.exr'),
    sunset: await import('@pmndrs/assets/hdri/sunset.exr'),
    venice: await import('@pmndrs/assets/hdri/venice.exr'),
    warehouse: await import('@pmndrs/assets/hdri/warehouse.exr'),
    workshop: await import('@pmndrs/assets/hdri/workshop.exr'),
} as { [environments: string]: any };

const loadEnvironmentSample = async (sampleName: string, onLoad: (obj: { name: string, data: THREE.DataTexture }) => void) => {
    const sample = samples[sampleName]
    console.log(sample);
    new EXRLoader().load(sample.default, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        texture.needsUpdate = true
        onLoad({ name: sampleName, data: texture });
    })
}