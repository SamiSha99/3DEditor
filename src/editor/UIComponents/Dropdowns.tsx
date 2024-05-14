import { ExportOutlined, ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Dropdown, Button, message, Modal, Input, Form, Select, Checkbox } from "antd";
import { ExportType, doExport } from "../tools/Exporter";
import { doImport } from "../tools/Importer";
import { useStores } from "../../App";
import { GenerateBox, GenerateCapsule, GenerateCylinder, GeneratePlane, GenerateSphere } from "../MeshCreator/Primitives";
import { GenerateButton } from "../MeshCreator/3DButton";
import * as THREE from "three";
import { useState } from "react";

export const FileDropDown = () => {
    const {setScene, controlsObject3D, sceneObjects} = useStores();
    const [modalExport, toggleModalExport] = useState(false);
    return(
        <>
            <ExportModal open={modalExport} onCancel={() => {toggleModalExport(false)}} onSubmit={(res) => {
                console.log("Exporting type", res.type, "for a file named", res.name, "using the", res.exportSelection ? "current selection." : "entire scene.")
                let selection;
                if(res.exportSelection) {
                    selection = controlsObject3D;
                }
                else {
                    const sceneExport = new THREE.Scene();
                    if(sceneObjects)
                        sceneExport.children = sceneObjects;
                    selection = sceneExport;
                }
                console.log("selecton:", selection)
                if(!selection) message.error('No selection detected, make sure you are selecting an Object before export.')
                
                doExport(selection as THREE.Object3D, res.type);
                toggleModalExport(false);
            }} />
            <Dropdown
            children={<Button children={"File"} />}
            menu={{
                items: [
                    // PLEASE FIX! IT BREAKS EXPORTS! -Sami
                {
                    label: 'New Scene',
                    key: '0',
                    icon: <SwapOutlined />,
                    disabled: false,
                    onClick: () => {
                        setScene();
                    }
                },
                {
                    type: "divider"
                },
                {
                    label: 'Import...',
                    key: '1',
                    icon: <ImportOutlined />,
                    onClick: () => {
                        doImport();
                    }
                },
                {
                    label: 'Export...',
                    key: '2',
                    icon: <ExportOutlined />,
                    onClick: () => {
                        toggleModalExport(true);
                    }
                }
                ]
            }}/>
        </>
    )
}

export const CreateDropDown = () => {
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
                        }],
                    onClick: (e) => {
                        message.success('Generated ' + (e.domEvent.target as HTMLElement).innerText)
                    }
                }}
            />
        </>
    )
}

export const AddDropDown = () => {
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

type ExportFormData = {name: string, type: ExportType, exportSelection: boolean};

const ExportModal: React.FC<{open: boolean, onCancel: () => void, onSubmit: (res: ExportFormData) => void}>  = ({open, onCancel, onSubmit}) => {
    const [formData, setFormData] = useState<ExportFormData>({name: "exportName", type: "glb", exportSelection: false});

    return (
        <Modal 
            title={"Export..."} 
            open={open} 
            onOk={() => onSubmit(formData)} 
            onCancel={() => onCancel()}>
                <Form>
                    <Select title="Export as"
                        defaultValue="glb"
                        style={{ width: 120 }}
                        onChange={(val: ExportType) => {setFormData({name: formData.name, type: val, exportSelection: formData.exportSelection})}}
                        options={[
                            { value: 'glb', label: 'GLB' },
                            { value: 'gltf', label: 'GLTF' },
                            { value: 'usdz', label: 'USDZ' },
                            { value: 'obj', label: 'OBJ' }
                        ]}
                        />
                    <Checkbox checked={formData.exportSelection} onChange={(e) => setFormData({name: formData.name, type: formData.type, exportSelection: e.target.checked})} />
                    <Input defaultValue={"exportName"} title="hello" onInput={(e) => {setFormData({name: (e.target as any).value, type: formData.type, exportSelection: formData.exportSelection})}} />
                </Form>
        </Modal>
    )
}