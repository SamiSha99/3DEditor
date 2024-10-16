import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { ItemColor, ItemSelect, ItemTexture } from "@orb_UI/controller/ControllerItems";
import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Color } from "three";

const environmentOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Samples" },
    { value: 2, label: "Custom Texture" }
]

const selectedEnvironmentOption = 1;

const backgroundOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "Color" },
    { value: 2, label: "Texture" }
]

const selectedBackgroundOption = 1;

export const InspectorScene: React.FC = observer(() => {
    const { scene, environment, setEnvironmentByName, setEnvironmentByTexture } = useStores();
    const [environmentOption, setEnvironmentOption] = useState(selectedEnvironmentOption);
    const [backgroundOption, setBackgroundOption] = useState(selectedBackgroundOption);

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
            <Divider children="Environment" orientation="left" />
            <ItemSelect object={{ options: environmentOptions }} variable="options" defaultValue={environmentOptions[selectedEnvironmentOption].label} labelInVariable onChangeSelect={(s) => setEnvironmentOption(s)} />
            {/* Select Environment Option */}
            {
                ((selectedEnvironmentOption: number) => {
                    switch (selectedEnvironmentOption) {
                        case 1:
                            // to-do sync this correctly with AppStore  
                            return (
                                <ItemSelect object={{ Environment: list }} variable="Environment" label="Environment"
                                    defaultValue={!environment ? "Custom" : environment.replace(/^./, environment[0].toUpperCase())}
                                    onChangeSelect={(select) => {
                                        console.log("SELECT", select);
                                        let v = undefined;
                                        if (select != "undefined") v = select as Environments
                                        setEnvironmentByName(v)
                                    }}
                                    options={list}
                                />
                            )
                        case 2:
                            // to-do sync this correctly with AppStore
                            setEnvironmentByTexture(null);
                            scene.environment = null;
                            return (
                                <ItemTexture object={scene} variable="environment" labelInVariable hdr />
                            )
                        case 0:
                            // to-do sync this correctly with AppStore
                            scene.environment = null;
                            setEnvironmentByTexture(null);
                            return <></>
                        default:
                            return <></>
                    }
                })(environmentOption)
            }
            <Divider children="Background" orientation="left" />
            <ItemSelect object={{ type: backgroundOptions }} variable="type" defaultValue={backgroundOptions[selectedBackgroundOption].label} labelInVariable onChangeSelect={(s) => setBackgroundOption(s)} />
            {
                ((selectedBackgroundOption: number) => {
                    switch (selectedBackgroundOption) {
                        case 1:
                            // to-do sync this correctly with AppStore
                            scene.background = new Color(0x000000);
                            return (
                                <ItemColor object={scene} variable="background" labelInVariable disabledAlpha />
                            )
                        case 2:
                            // to-do sync this correctly with AppStore
                            scene.background = null
                            return (
                                <ItemTexture object={scene} variable="background" labelInVariable />
                            )
                        case 0:
                            scene.background = null
                            return <></>
                        default:
                            return <></>
                    }
                })(backgroundOption)
            }
            {/* to-do add fog */}
            {/* <Divider children="Fog" orientation="left" /> */}
        </>
    );
})

