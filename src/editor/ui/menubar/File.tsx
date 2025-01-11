import { useState } from "react";
import { EditOutlined, ExportOutlined, ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Dropdown, Button, message, Modal, Form, Divider } from "antd";
import * as THREE from "three";
import { useEditor } from "@orb_Editor";
import { doImport } from "@orb_tools/Importer";
import { DEFAULT_GLTF_EXPORTER_OPTIONS, DEFAULT_PLY_EXPORTER_OPTIONS, DEFAULT_STL_EXPORTER_OPTIONS, DEFAULT_USDZ_EXPORTER_OPTIONS, ExportOptions, ExportType, doExport, save } from "@orb_tools/Exporter";
import { ItemBoolean, ItemInput, ItemSelect } from "@orb_UI/controller/ControllerItems";
import { ConvertModal, textureSizeOptions } from "./Tools";
import { useViewport } from "src/store/Viewport";
import { GLTFExporterOptions } from "three/examples/jsm/Addons";

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
    { value: 'gltf', label: 'GLTF' },
    { value: 'usdz', label: 'USDZ' },
    { value: 'obj', label: 'OBJ' },
    { value: 'ply', label: 'PLY' },
    { value: 'stl', label: 'STL' }
]

const exportSettings: ExportOptions = { name: "exportName", type: "gltf", selectionOnly: false, parameters: { ...DEFAULT_GLTF_EXPORTER_OPTIONS } }

interface ExportModal {
    open: boolean,
    onSubmit: () => void,
    onCancel: () => void
}

const ExportModal = (props: ExportModal) => {
    const { open, onSubmit, onCancel } = props;
    const { sceneObjects } = useEditor();
    const { target } = useViewport();
    const [type, setType] = useState(exportSettings.type);

    const doDownload = () => {
        const arg = exportSettings;
        console.log("Export settings:\n", arg);
        let selection: THREE.Object3D | null;
        if (arg.selectionOnly)
            selection = target;
        else {
            const sceneExport = new THREE.Scene();
            if (sceneObjects)
                sceneExport.children = sceneObjects;
            selection = sceneExport;
        }
        if (!selection) message.warning('No selection detected with "export selection", make sure you are selecting an Object before export.')

        doExport(selection as THREE.Object3D, exportSettings, (blob) => save(blob, arg.name + "." + (arg.type == "gltf" && (arg.parameters as GLTFExporterOptions).binary ? "glb" : "gltf")));
        onSubmit();
    }

    return (
        <Modal title={"Export..."} open={open} onOk={doDownload} onCancel={onCancel}>
            <Form>
                <ItemInput object={exportSettings} variable="name" labelInVariable />
                <ItemBoolean object={exportSettings} variable="selectionOnly" labelInVariable />
                <ItemSelect
                    object={{ options: exportOptions }}
                    variable={"options"}
                    defaultValue={exportOptions[0].label}
                    label="Type"
                    onChangeSelect={(select) => {
                        exportSettings.type = select as ExportType
                        switch (exportSettings.type) {
                            case "gltf": exportSettings.parameters = { ...DEFAULT_GLTF_EXPORTER_OPTIONS }; break;
                            case "usdz": exportSettings.parameters = { ...DEFAULT_USDZ_EXPORTER_OPTIONS }; break;
                            case "obj": exportSettings.parameters = undefined; break;
                            case "ply": exportSettings.parameters = { ...DEFAULT_PLY_EXPORTER_OPTIONS }; break;
                            case "stl": exportSettings.parameters = { ...DEFAULT_STL_EXPORTER_OPTIONS }; break;
                        }
                        setType(exportSettings.type);
                    }}
                />
                {
                    exportSettings.parameters &&
                    <>
                        <Divider />
                        {
                            type == "gltf" &&
                            <>
                                <ItemBoolean variable="binary" object={exportSettings.parameters} />
                            </>
                        }
                    </>
                }
            </Form>
        </Modal>
    )
}

export default File