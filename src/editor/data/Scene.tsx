import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useStores } from "@orb_App";
import { AppStore } from "@orb_AppStore";
import { Environments, environments } from "@orb_types";
import { ItemButton, ItemCollapse, ItemColor, ItemEuler, ItemGroup, ItemNumber, ItemSelect, ItemTexture } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Color, DataTexture, EquirectangularReflectionMapping, Fog, Texture } from "three";
import { EXRLoader } from "three/examples/jsm/Addons";

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

let lastEnvironmentSample: { name: string, data: DataTexture } | null;
let lastEnvironmentTexture: Texture | null;

let lastBackgroundColor: Color | null = AppStore.DEFAULT_SCENE_BACKGROUND_COLOR.clone();
let lastBackgroundTexture: Texture | null;


export const InspectorScene: React.FC = observer(() => {
    const { scene, setEnvironment, setBackground, setFog } = useStores();
    const [environmentOption, setEnvironmentOption] = useState(getEnvironmentOption(scene.environment));
    const [backgroundOption, setBackgroundOption] = useState(getBackgroundOption(scene.background));
    const [fogScene, setFogScene] = useState(scene.fog);

    const environmentList = () => {
        let options: { value: string, label: string }[] = [];
        environments.map((e) => {
            const obj = { value: e ? e : "undefined", label: e ? e.replace(/^./, e[0].toUpperCase()) : "None" };
            if (e)
                options.push(obj);
            else
                options.unshift(obj)
        })
        return options;
    }

    const list = environmentList();

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

                            loadEnvironmentSample(v, (o) => {
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
    }

    return (
        <>

            {/* Scene Background Options */}
            <ItemCollapse label="Background">
                <ItemSelect object={{ type: backgroundOptions }} variable="type" defaultValue={backgroundOptions[backgroundOption].label} labelInVariable onChangeSelect={(s) => setBackgroundOption(s)} />
                {backgroundUI(backgroundOption)}
            </ItemCollapse>
            <ItemCollapse label="Environment">
                <ItemSelect object={{ type: environmentOptions }} variable="type" defaultValue={environmentOptions[getEnvironmentOption(scene.environment)].label} labelInVariable onChangeSelect={(s) => setEnvironmentOption(s)} />
                {environmentUI(environmentOption)}
                {
                    environmentOption != 0 &&
                    <>
                        <ItemNumber object={scene} variable="environmentIntensity" label="Intensity" />
                        <ItemEuler object={scene} variable="environmentRotation" label="Rotation" isDegree />
                    </>
                }
            </ItemCollapse>
            {/* to-do add fog */}
            <ItemCollapse label="Fog">
                {/* to-do, delete this! Replace with a select for None, Linear, Exponential */}
                <ItemGroup label="Actions" sizes={["15%", "15%"]}>
                    <ItemButton disabled={fogScene != null} buttonName={<PlusOutlined style={{ fontSize: 24 }} />} onClick={() => { setFog(new Fog(0x000000, 1, 25)); setFogScene(scene.fog); }} />
                    <ItemButton disabled={fogScene == null} buttonName={<MinusOutlined style={{ fontSize: 24 }} />} onClick={() => { setFog(null); setFogScene(scene.fog); }} />
                </ItemGroup>
                {
                    fogScene &&
                    <>
                        <ItemColor object={fogScene} variable="color" labelInVariable />
                        <ItemNumber object={fogScene} variable="near" labelInVariable />
                        <ItemNumber object={fogScene} variable="far" labelInVariable />
                    </>
                }
            </ItemCollapse>
        </>
    );
})

const getBackgroundOption = (background: Color | Texture | undefined | null) => {
    if (!background) return 0; // Off
    if (background instanceof Color) return 1; // Samples
    return 2; // Texture
}

const getEnvironmentOption = (environment: string | Texture | undefined | null) => {
    if (environment == null) return 0; // Off
    if (environment == lastEnvironmentSample?.data) return 1; // Samples
    return 2; // Texture
}

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

const loadEnvironmentSample = async (sampleName: string, onLoad: (obj: { name: string, data: DataTexture }) => void) => {
    const sample = samples[sampleName]
    console.log(sample);
    new EXRLoader().load(sample.default, (texture) => {
        texture.mapping = EquirectangularReflectionMapping
        texture.needsUpdate = true
        console.log(texture)
        onLoad({ name: sampleName, data: texture });
    })
}