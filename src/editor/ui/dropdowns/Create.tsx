import { Dropdown, Button, message } from "antd";
import { GenerateBox, GenerateCapsule, GenerateCylinder, GeneratePlane, GenerateSphere, GenerateTorus } from "../../tools/meshCreator/Primitives";
import { GenerateButton } from "@orb_tools/meshCreator/3DButton";
import { useStores } from "@orb_App";
import { GenerateAmbientLight } from "@orb_tools/meshCreator/light";


export const Create = () => {
    const {pushComponentToScene} = useStores();

    return(
        <>
            <Dropdown 
                children={<Button children={"Create"} />} 
                menu={{
                    items: [
                        {
                            label: 'Button',
                            key: '0',
                            onClick: () => {
                                const button = GenerateButton();
                                pushComponentToScene(button);
                            }
                        },
                        {
                            type: "divider"
                        },
                        {
                            label: 'AmbientLight',
                            key: '-1',
                            onClick: () => {
                                const light = GenerateAmbientLight();
                                pushComponentToScene(light);
                            }
                        },
                        {
                            type: "divider"
                        },
                        {
                            label: 'Cube',
                            key: '1',
                            onClick: () => {
                                const res = GenerateBox()
                                pushComponentToScene(res);
                            }
                        },
                        {
                            label: 'Sphere',
                            key: '2',
                            onClick: () => {
                                const res = GenerateSphere()
                                pushComponentToScene(res);
                            }
                        },
                        {
                            label: 'Plane',
                            key: '3',
                            onClick: () => {
                                const res = GeneratePlane()
                                pushComponentToScene(res);
                            }
                        },
                        {
                            label: 'Cylinder',
                            key: '4',
                            onClick: () => {
                                const res = GenerateCylinder()
                                pushComponentToScene(res);
                            }
                        },
                        {
                            label: 'Capsule',
                            key: '5',
                            onClick: () => {
                                const res = GenerateCapsule()
                                pushComponentToScene(res);
                            }
                        },
                        {
                            label: 'Torus',
                            key: '6',
                            onClick: () => {
                                const res = GenerateTorus()
                                pushComponentToScene(res);
                            }
                        }],
                    onClick: (e) => {
                        message.success('Generated ' + (e.domEvent.target as HTMLElement).innerText)
                    }
                }}
            />
        </>
    )
}