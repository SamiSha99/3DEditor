import { useStores } from "@orb_App";
import { AppStore } from "@orb_AppStore";
import { Environments, environments } from "@orb_types";
import { ItemColor, ItemEuler, ItemNumber, ItemSelect, ItemTexture } from "@orb_UI/controller/ControllerItems";
import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Color, EquirectangularReflectionMapping, Texture } from "three";

const environmentOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Samples" },
    { value: 2, label: "Custom Texture" }
]

const backgroundOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Color" },
    { value: 2, label: "Texture" }
]

let lastEnvironmentSample: Environments | null = environments[1];
let lastEnvironmentTexture: Texture | null;

let lastBackgroundColor: Color | null = AppStore.DEFAULT_SCENE_BACKGROUND_COLOR.clone();
let lastBackgroundTexture: Texture | null;

export const InspectorScene: React.FC = observer(() => {
    const { scene, environment, setEnvironment, background, setBackground } = useStores();
    const [environmentOption, setEnvironmentOption] = useState(getEnvironmentOption(environment));
    const [backgroundOption, setBackgroundOption] = useState(0);

    const environmentList = () => {
        let options: { value: string, label: string }[] = [];
        environments.map((e) => {
            const obj = { value: e ? e : "undefined", label: e ? e.replace(/^./, e[0].toUpperCase()) : "Custom" };
            if (e)
                options.push(obj);
            else
                options.unshift(obj)
        })
        return options;
    }

    const list = environmentList();

    return (
        <>

            {/* Scene Background Options */}
            <Divider children="Background" orientation="left" />
            <ItemSelect object={{ type: backgroundOptions }} variable="type" defaultValue={backgroundOptions[0].label} labelInVariable onChangeSelect={(s) => setBackgroundOption(s)} />
            {
                ((selectedBackgroundOption: number) => {
                    switch (selectedBackgroundOption) {
                        // Adjust Color
                        case 1:
                            lastBackgroundColor && setBackground(lastBackgroundColor);
                            return <ItemColor object={{ background: background }} variable="background" label="Color" disabledAlpha
                                onChange={(c) => {
                                    lastBackgroundColor = c;
                                    setBackground(c);
                                    scene.background = c
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
                                            scene.background = v;
                                            lastBackgroundTexture = v;
                                        }
                                    }}
                                />
                                <ItemNumber object={scene} variable="backgroundIntensity" label="Intensity" />
                                <ItemNumber object={scene} variable="backgroundBlurriness" label="Blurriness" />
                                <ItemEuler object={scene} variable="backgroundRotation" label="Rotation" isDegree />
                            </>
                        // Off
                        case 0: default: setBackground(null); scene.background = null; return <></>;
                    }
                })(backgroundOption)
            }

            {/* Environment Options */}
            <Divider children="Environment" orientation="left" />
            <ItemSelect object={{ type: environmentOptions }} variable="type" defaultValue={environmentOptions[getEnvironmentOption(environment)].label} labelInVariable onChangeSelect={(s) => setEnvironmentOption(s)} />
            {
                ((selectedEnvironmentOption: number) => {
                    switch (selectedEnvironmentOption) {
                        // Provided samples from the Drei library
                        case 1:
                            if (lastEnvironmentSample)
                                setEnvironment(lastEnvironmentSample);
                            return <ItemSelect object={{ environment: list }} variable="environment" label="Environment"
                                defaultValue={environment instanceof Texture ? "Custom" : (environment as string).replace(/^./, (environment as string)[0].toUpperCase())}
                                onChangeSelect={(select) => {
                                    let v = undefined;
                                    if (select != "undefined") v = select as Environments
                                    setEnvironment(v);
                                    lastEnvironmentSample = v;
                                }}
                                options={list}
                            />
                        // Manually upload HDRI files
                        case 2:
                            if (lastEnvironmentTexture) {
                                scene.environment = lastEnvironmentTexture;
                                setEnvironment(lastEnvironmentTexture);
                            }
                            return <ItemTexture object={scene} variable="environment" labelInVariable hdr
                                onChange={(t) => {
                                    if (t) {
                                        t.mapping = EquirectangularReflectionMapping;
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
                })(environmentOption)
            }
            <ItemNumber object={scene} variable="environmentIntensity" label="Intensity" />
            <ItemEuler object={scene} variable="environmentRotation" label="Rotation" isDegree />
            {/* to-do add fog */}
            {/* <Divider children="Fog" orientation="left" /> */}
        </>
    );
})

const getEnvironmentOption = (environment: string | Texture | undefined | null) => {
    if (environment == null) return 0; // Off
    if (typeof environment == "string") return 1; // Samples
    return 2; // Custom Texture
}