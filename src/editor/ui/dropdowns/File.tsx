import { useState } from "react";
import { ExportOutlined, ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Dropdown, Button, message, Modal, Input, Form, Select, Checkbox } from "antd";
import * as THREE from "three";
import { useStores } from "@orb_App";
import { doImport, testFirebaseFiles } from "@orb_tools/Importer";
import { ExportType, doExport, save } from "@orb_tools/Exporter";

export const File = () => {
    const { setScene, controlsObject3D, sceneObjects, addObject } = useStores();
    const [modalExport, toggleModalExport] = useState(false);
    return (
        <>
            <ExportModal open={modalExport} onCancel={() => { toggleModalExport(false) }} onSubmit={(res) => {
                console.log("Exporting type", res.type, "for a file named", res.name, "using the", res.exportSelection ? "current selection." : "entire scene.")
                let selection;
                if (res.exportSelection) {
                    selection = controlsObject3D;
                }
                else {
                    const sceneExport = new THREE.Scene();
                    if (sceneObjects)
                        sceneExport.children = sceneObjects;
                    selection = sceneExport;
                }
                console.log("selecton:", selection)
                if (!selection) message.warning('No selection detected with "export selection", make sure you are selecting an Object before export.')

                doExport(selection as THREE.Object3D, { type: res.type, name: res.name }, (blob) => save(blob, res.name + "." + res.type));
                toggleModalExport(false);
            }} />
            <Dropdown
                trigger={["click"]}
                children={<Button children={"File"} />}
                menu={{
                    items: [
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
                                testFirebaseFiles({fileName: "test.glb", fileUrlAndroid: "REDACTED_URL"}, 
                                    (scene) => {
                                    console.log(scene);
                                    addObject(scene);
                                });
                                // doImport((scene) => {
                                //     console.log(scene);
                                //     addObject(scene);
                                // });
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
                }} />
        </>
    )
}

type ExportFormData = { name: string, type: ExportType, exportSelection: boolean };
const exportOptions = [
    { value: 'glb', label: 'GLB' },
    { value: 'gltf', label: 'GLTF' },
    { value: 'usdz', label: 'USDZ' },
    { value: 'obj', label: 'OBJ' },
    { value: 'ply', label: 'PLY' },
    { value: 'stl', label: 'STL' }
]

const ExportModal: React.FC<{ open: boolean, onCancel: () => void, onSubmit: (res: ExportFormData) => void }> = ({ open, onCancel, onSubmit }) => {
    const [formData, setFormData] = useState<ExportFormData>({ name: "exportName", type: "glb", exportSelection: false });

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
                    onChange={(val: ExportType) => {
                        setFormData({ name: formData.name, type: val, exportSelection: formData.exportSelection })
                    }}
                    options={exportOptions}
                />
                <Checkbox children={"Export selected only."} checked={formData.exportSelection} onChange={(e) => setFormData({ name: formData.name, type: formData.type, exportSelection: e.target.checked })} />
                <Input defaultValue={"exportName"} title="hello" onInput={(e) => { setFormData({ name: (e.target as any).value, type: formData.type, exportSelection: formData.exportSelection }) }} />
            </Form>
        </Modal>
    )
}

export default File