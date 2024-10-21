import { Dropdown, Button, message } from "antd";
import { useStores } from "@orb_App";
import { Button3D } from "@orb_tools/create/Button3D";
import { Object3D } from "three";

export const Create = () => {
    const { controlsObject3D, badForceUpdateInspector } = useStores();

    return (
        <>
            <Dropdown
                children={<Button children={'Create'} />}
                trigger={['click']}
                menu={{
                    items: [
                        {
                            disabled: true,
                            label: 'Button to Selected Object',
                            key: '0',
                            onClick: () => {
                                const obj = Button3D()
                                console.log(controlsObject3D)
                                if (!controlsObject3D) {
                                    message.warning('Select something before attaching!');
                                    return;
                                }
                                if (obj)
                                    controlsObject3D?.add(obj);
                                badForceUpdateInspector();
                                message.success('Generated a Button and attached to ' + (controlsObject3D as Object3D).name);
                            }
                        }],
                    // onClick: (e) => {
                    //     // message.success('Generated ' + (e.domEvent.target as HTMLElement).innerText)
                    // }
                }}
            />
        </>
    )
}

export default Create