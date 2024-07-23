import { Dropdown, Button, message } from "antd";
import { useStores } from "@orb_App";
import { GenerateButton } from "@orb_tools/create/3DButton";
import { Object3D } from "three";

export const Add = () => {
    const { addObject, controlsObject3D, badForceUpdateInspector } = useStores();

    return (
        <Dropdown
            trigger={["click"]}
            children={<Button children={"Add"} />}
            menu={{
                items: [
                    {
                        label: 'Button to Selected Object',
                        key: '0',
                        onClick: () => {
                            const obj = GenerateButton()
                            if (!controlsObject3D) {
                                message.warning('Select something before attaching!');
                                return;
                            }
                            if (!Array.isArray(controlsObject3D) && obj)
                                controlsObject3D?.add(obj);
                            badForceUpdateInspector();
                            message.success('Generated a Button and attached to ' + (controlsObject3D as Object3D).name);
                        }
                    }],
                onClick: (e) => {
                    // message.success('Generated ' + (e.domEvent.target as HTMLElement).innerText)
                }
            }}
        />
    )
}

export default Add