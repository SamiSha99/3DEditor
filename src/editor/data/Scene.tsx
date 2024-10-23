import { useEditor } from "@orb_Editor";
import { Editor } from "@orb_Editor";
import { Environments, environments } from "@orb_types";
import { ItemCollapse, ItemColor, ItemEuler, ItemNumber, ItemSelect, ItemTexture } from "@orb_UI/controller/ControllerItems";
import { loadEnvironmentSample } from "@orb_utils/Samples";
import { Alert } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from "three";

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

let lastBackgroundColor: THREE.Color | null = Editor.DEFAULT_SCENE_BACKGROUND_COLOR.clone();
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
    const { scene, setBackground } = useEditor();
    const [backgroundOption, setBackgroundOption] = useState<number>(() => { return !scene.background ? 0 : (scene.background instanceof THREE.Color ? 1 : 2); });

    const backgroundUI = (selectedBackgroundOption: number) => {
        switch (selectedBackgroundOption) {
            // Adjust Color
            case 1:
                lastBackgroundColor && setBackground(lastBackgroundColor);
                return <ItemColor object={{ background: scene.background }} variable="background" label="Color" disabledAlpha
                    onChange={(c) => {
                        lastBackgroundColor = c;
                        setBackground(c);
                    }}
                />
            // Adjust by Texture
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
    const { scene, setEnvironment } = useEditor();
    const [environmentOption, setEnvironmentOption] = useState<number>(() => { return !scene.environment ? 0 : (scene.environment == lastEnvironmentSample?.data ? 1 : 2) });
    const [_selectedSample, setSelectedSample] = useState<string | undefined>(lastEnvironmentSample?.name);

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
                setEnvironment(lastEnvironmentSample ? lastEnvironmentSample.data : null);
                return (
                    <>
                        <ItemSelect object={{ environment: list }} variable="environment" label="Sample"
                            defaultValue={!lastEnvironmentSample ? "None" : lastEnvironmentSample.name.replace(/^./, lastEnvironmentSample.name[0].toUpperCase())}
                            onChangeSelect={(select) => {
                                let v = undefined;
                                if (select == "undefined") {
                                    setEnvironment(null);
                                    setSelectedSample(undefined)
                                    lastEnvironmentSample = null;
                                }
                                else {
                                    v = select as Environments
                                    loadEnvironmentSample(v!).then((o) => {
                                        if (o) {
                                            setEnvironment(o.data);
                                            setSelectedSample(o.name)
                                            lastEnvironmentSample = o;
                                        }
                                    })
                                }
                            }}
                            options={list}
                        />
                        {<ItemTexture key={"sample" + scene.environment?.uuid} object={scene} variable="environment" labelInVariable hdr readonly size={{ width: 128, height: 64 }} />}
                    </>
                )
            // Manually upload HDRI files
            case 2:
                if (lastEnvironmentTexture) {
                    setEnvironment(lastEnvironmentTexture);
                }
                return <ItemTexture key={"custom" + scene.environment?.uuid} object={scene} variable="environment" labelInVariable hdr size={{ width: 128, height: 64 }}
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
    const { scene, setFog } = useEditor();
    const [fogOption, setFogOption] = useState<number>(() => { return !scene.fog ? 0 : (scene.fog instanceof THREE.Fog ? 1 : 2) });

    const itemFog = (() => {
        switch (fogOption) {

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
    })()

    return (
        <ItemCollapse label="Fog">
            <ItemSelect object={{ type: fogOptions }} variable="type" defaultValue={backgroundOptions[fogOption].label} labelInVariable onChangeSelect={(s) => setFogOption(s as number)} />
            {itemFog}
        </ItemCollapse>
    )

})