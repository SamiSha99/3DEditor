import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { ItemColor, ItemSelect } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";

export const InspectorScene: React.FC = observer(() => {
    const { scene, environment, setEnvironmentByName } = useStores();

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
            <ItemColor object={scene} variable="background" labelInVariable disabledAlpha />
        </>
    );
})

