import { Dropdown, Button, message } from "antd";
import { useStores } from "@orb_App";
import { GenerateBox, GenerateCylinder, GeneratePlane, GenerateSphere } from "../../tools/meshCreator/Primitives";
import { GenerateButton } from "@orb_tools/meshCreator/3DButton";

export const Add = () => {
    const {pushComponentToScene, controlsObject3D} = useStores();
    
    return(
        <Dropdown 
            children={<Button children={"Add"} />} 
            menu={{
                items: [
                    {
                        label: 'Button to Selected Object',
                        key: '0',
                        onClick: () => {
                            const obj = GenerateButton()
                            if(!controlsObject3D) return;
                            if(!Array.isArray(controlsObject3D) && obj)
                                controlsObject3D?.add(obj);
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        label: 'Cube',
                        key: '1',
                        onClick: () => {
                            const res = GenerateBox();
                            pushComponentToScene(res);
                        }
                    },
                    {
                        label: 'Sphere',
                        key: '2',
                        onClick: () => {
                            const res = GenerateSphere();
                            pushComponentToScene(res);
                        }
                    },
                    {
                        label: 'Plane',
                        key: '3',
                        onClick: () => {
                            const res = GeneratePlane();
                            pushComponentToScene(res);
                        }
                    },
                    {
                        label: 'Cylinder',
                        key: '4',
                        onClick: () => {
                            const res = GenerateCylinder();
                            pushComponentToScene(res);
                        }
                    }],
                onClick: (e) => {
                    message.success('Generated ' + (e.domEvent.target as HTMLElement).innerText)
                }
            }}
        />
    )
}