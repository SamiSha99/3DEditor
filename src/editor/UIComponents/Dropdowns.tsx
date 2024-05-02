import { ExportOutlined, ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Dropdown, Button, message, Modal, Input, Form, Select, Checkbox } from "antd";
import { doExportGLTF, doExportUSDZ } from "../Exporters";
import { doImport } from "../Importers";
import { useStores } from "../../App";
import { GenerateBox, GenerateCylinder, GeneratePlane, GenerateSphere } from "../MeshCreator/Primitives";
import { AppSettings } from "../../store/appSettings";
import { EditorObject } from "../Source/EditorObject";
import * as MESH_UTILS from '.././Utils/MeshUtils'
import { GenerateButton } from "../MeshCreator/3DButton";
import { VertexNormalsHelper } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useState } from "react";
import { string } from "three/examples/jsm/nodes/Nodes.js";
import { AppStore } from "../../store/AppStore";

export const FileDropDown = () => {
    const {scene, pushComponentToScene, setScene, controlsObject3D} = useStores();
    const [modalExport, toggleModalExport] = useState(false);
    return(
        <>
            <ExportModal open={modalExport} onCancel={() => {toggleModalExport(false)}} onSubmit={(res) => {
                console.log("Exporting type", res.type, "for a file named", res.name, "using the", res.exportSelection ? "current selection." : "entire scene.")
                
                const selection = res.exportSelection ? controlsObject3D : prepareSceneForExport(scene);
                console.log("selecton:", selection)
                if(!selection) message.error('No selection detected, make sure you are selecting an Object before export.')
                switch(res.type) {
                    case '.glb':
                        doExportGLTF(selection, true, res.name);
                        break;
                    case '.usdz':
                        doExportUSDZ(selection, res.name)
                        break;
                }
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
                    disabled: true,
                    onClick: () => {
                        
                        setScene(new THREE.Scene());
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
                        doImport((onHandle) => {
                            if(onHandle) {
                                MESH_UTILS.computeAllVertexNormals(onHandle);
                                console.log("Imported object:", onHandle);
                                const editorObject = new EditorObject(onHandle);
                                pushComponentToScene(editorObject);
                                message.success("Import successful!");
                            }
                            else
                                message.error("Import failed!");
                        });
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
                            onClick: () => GenerateButton(pushComponentToScene)
                        },
                        {
                            type: "divider"
                        },
                        {
                            label: 'Cube',
                            key: '1',
                            onClick: () => GenerateBox(pushComponentToScene)
                        },
                        {
                            label: 'Sphere',
                            key: '2',
                            onClick: () => GenerateSphere(pushComponentToScene)
                        },
                        {
                            label: 'Plane',
                            key: '3',
                            onClick: () => GeneratePlane(pushComponentToScene)
                        },
                        {
                            label: 'Cylinder',
                            key: '4',
                            onClick: () => GenerateCylinder(pushComponentToScene)
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
    // const { scene } = useThree(); 
    return(
        <Dropdown 
            children={<Button children={"Add"} />} 
            menu={{
                items: [
                    {
                        label: 'Button to Selected Object',
                        key: '0',
                        onClick: () => {
                            const obj = GenerateButton(pushComponentToScene)
                            if(!controlsObject3D) return;
                            if(!Array.isArray(controlsObject3D) && obj.component)
                                controlsObject3D?.add(obj.component);
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        label: 'Cube',
                        key: '1',
                        onClick: () => GenerateBox(pushComponentToScene)
                    },
                    {
                        label: 'Sphere',
                        key: '2',
                        onClick: () => GenerateSphere(pushComponentToScene)
                    },
                    {
                        label: 'Plane',
                        key: '3',
                        onClick: () => GeneratePlane(pushComponentToScene)
                    },
                    {
                        label: 'Cylinder',
                        key: '4',
                        onClick: () => GenerateCylinder(pushComponentToScene)
                    }],
                onClick: (e) => {
                    message.success('Generated ' + (e.domEvent.target as HTMLElement).innerText)
                }
            }}
        />
    )
}

function prepareSceneForExport(scene: THREE.Scene) {
    const refs = cleanUpHelpers(scene);
    const sceneClone = scene.clone();
    const editorHelpers = sceneClone.getObjectByName(AppSettings.EDITOR_HELPERS_NAME);
    const transHelper = sceneClone.getObjectByName("TRANSFORM_HELPER");
    const what = sceneClone.getObjectByName("mesh_1");
    console.log("????", what);
    console.log("trans controls", transHelper)
    console.log(editorHelpers);
    if(transHelper) {
        sceneClone.remove(transHelper);
    }
    if(editorHelpers)
        sceneClone.remove(editorHelpers);
    restoreHelpers(refs);
    return sceneClone;
}

function cleanUpHelpers(scene: THREE.Scene) {
    const helpers = scene.getObjectsByProperty("type","VertexNormalsHelper") as VertexNormalsHelper[];
    let oldParents = [] as (THREE.Object3D | null)[];
    console.log(helpers);
    helpers.forEach(h => {
        if(h.parent) {
            oldParents.push(h.parent);
            h.parent.remove(h);
        }
        else {
            oldParents.push(null);
        }
    });
    return {helpers, oldParents};
}

type ExportFormData = {name: string, type:".glb"|".usdz", exportSelection: boolean};

const ExportModal: React.FC<{open: boolean, onCancel: () => void, onSubmit: (res: ExportFormData) => void}>  = ({open, onCancel, onSubmit}) => {
    const [formData, setFormData] = useState<ExportFormData>({name: "exportName", type: ".glb", exportSelection: false});

    return (
        <Modal 
            title={"Export..."} 
            open={open} 
            onOk={(e) => {
                onSubmit(formData);
            }} 
            onCancel={(e) => {
                onCancel();
                // setModalType(open);
            }}>
                <Form>
                    <Select title="Export as"
                        defaultValue=".glb"
                        style={{ width: 120 }}
                        onChange={(val: ".glb" | ".usdz") => {setFormData({name: formData.name, type: val, exportSelection: formData.exportSelection})}}
                        options={[
                            { value: '.glb', label: 'GLB' },
                            { value: '.usdz', label: 'USDZ' }
                        ]}
                        />
                    <Checkbox checked={formData.exportSelection} onChange={(e) => setFormData({name: formData.name, type: formData.type, exportSelection: e.target.checked})} />
                    <Input defaultValue={"exportName"} title="hello" onInput={(e) => {setFormData({name: (e.target as any).value, type: formData.type, exportSelection: formData.exportSelection})}} />
                </Form>
        </Modal>
    )
}

function restoreHelpers(refs: {helpers: VertexNormalsHelper[], oldParents: (THREE.Object3D | null)[]}) {
    const oldParents = refs.oldParents;
    const helpers = refs.helpers;

    oldParents.forEach((parent, indx) => {
        console.log(oldParents[indx]);
        if(oldParents[indx]) {
            oldParents[indx]?.add(helpers[indx]);
        }
    });
}