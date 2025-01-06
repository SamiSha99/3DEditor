import { useState } from "react";
import { EditOutlined, ExportOutlined, ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Dropdown, Button, message, Modal, Form, Divider } from "antd";
import * as THREE from "three";
import { useEditor } from "@orb_Editor";
import { doImport } from "@orb_tools/Importer";
import { ExportType, doExport, save } from "@orb_tools/Exporter";
import { ItemBoolean, ItemInput, ItemSelect } from "@orb_UI/controller/ControllerItems";
import { ConvertModal, textureSizeOptions } from "./Tools";
import { useViewport } from "src/store/Viewport";

export const File = () => {
    const { setScene, addObject } = useEditor();
    const [modalExport, toggleModalExport] = useState(false);
    const [modalConvert, toggleModalConvert] = useState(false);
    return (
        <>
            <ExportModal open={modalExport} onSubmit={() => toggleModalExport(false)} onCancel={() => toggleModalExport(false)} />
            <ConvertModal open={modalConvert} onCancel={() => toggleModalConvert(false)} onSubmit={() => toggleModalConvert(false)} />
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
                            onClick: () => setScene()
                        },
                        {
                            type: "divider"
                        },
                        {
                            label: 'Import...',
                            key: '1',
                            icon: <ImportOutlined />,
                            onClick: () => {
                                doImport((scene) => {
                                    console.log(scene);
                                    addObject(scene);
                                });
                            }
                        },
                        {
                            label: 'Export...',
                            key: '2',
                            icon: <ExportOutlined />,
                            onClick: () => toggleModalExport(true)
                        },
                        {
                            label: 'Convert...',
                            key: '3',
                            icon: <EditOutlined />,
                            onClick: () => toggleModalConvert(true)
                        },
                    ]
                }} />
        </>
    )
}

const exportOptions = [
    { value: 'glb', label: 'GLB' },
    { value: 'gltf', label: 'GLTF' },
    { value: 'usdz', label: 'USDZ' },
    { value: 'obj', label: 'OBJ' },
    { value: 'ply', label: 'PLY' },
    { value: 'stl', label: 'STL' }
]

const exportSettings = { name: "exportName", type: exportOptions[0].value, exportSelection: false, textureSize: 1024 }

const ExportModal: React.FC<{ open: boolean, onSubmit: () => void, onCancel: () => void }> = ({ open, onSubmit, onCancel }) => {
    const { sceneObjects } = useEditor();
    const { target } = useViewport();

    const doDownload = () => {
        const res = exportSettings;
        console.log("Export settings:\n", res);
        let selection: THREE.Object3D | null;
        if (res.exportSelection)
            selection = target;
        else {
            const sceneExport = new THREE.Scene();
            if (sceneObjects)
                sceneExport.children = sceneObjects;
            selection = sceneExport;
        }
        if (!selection) message.warning('No selection detected with "export selection", make sure you are selecting an Object before export.')

        doExport(selection as THREE.Object3D, { type: res.type as ExportType, name: res.name, maxTextureSize: res.textureSize }, (blob) => save(blob, res.name + "." + res.type));
        onSubmit();
    }

    return (
        <Modal title={"Export..."} open={open} onOk={doDownload} onCancel={onCancel}>
            <Form>
                <ItemInput object={exportSettings} variable="name" labelInVariable />
                <ItemBoolean object={exportSettings} variable="exportSelection" labelInVariable />
                <ItemSelect object={{ options: exportOptions }} variable={"options"} defaultValue={exportOptions[0].label} label="Type" onChangeSelect={(select) => exportSettings.type = select as string} />
                <Divider />
                <ItemSelect object={{ textureSizes: textureSizeOptions }} variable="textureSizes" label="Size of Textures" defaultValue={textureSizeOptions[0].value} onChangeSelect={(value) => exportSettings.textureSize = parseFloat("" + value)} />
            </Form>
        </Modal>
    )
}

export default File