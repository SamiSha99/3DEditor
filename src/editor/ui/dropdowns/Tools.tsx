import { CameraOutlined } from "@ant-design/icons";
import { useStores } from "@orb_App";
import { doConvert } from "@orb_tools/Convertor";
import { Screenshot } from "@orb_tools/ModelPreviewer";
import { Dropdown, message, Button } from "antd"
import * as THREE from 'three';

export const Tools = () => {
    const { controlsObject3D } = useStores();
    return (
        <Dropdown
            children={<Button children={"Tools"} />}
            menu={{
                items: [
                {
                    label: 'Take a Screenshot',
                    key: '0',
                    icon: <CameraOutlined />,
                    onClick: () => {
                        if(controlsObject3D) {
                            const object = (controlsObject3D as THREE.Object3D).clone();
                            Screenshot(object);
                            message.success("Snip!");
                        }
                        else
                            message.warning("Select an object to take a screenshot!");
                    }
                },
                {
                    label: 'Convert...',
                    key: '0',
                    icon: <CameraOutlined />,
                    onClick: () => {
                        doConvert(".glb");
                    }
                }
                ]
            }}/>
    )
}