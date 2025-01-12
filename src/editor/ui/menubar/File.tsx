import { useState } from "react";
import { EditOutlined, ExportOutlined, ImportOutlined, SwapOutlined } from "@ant-design/icons";
import { Dropdown, Button, message, Modal, Form, Divider } from "antd";
import * as THREE from "three";
import { useEditor } from "@orb_Editor";
import { doImport } from "@orb_tools/Importer";
import { DEFAULT_GLTF_EXPORTER_OPTIONS, DEFAULT_PLY_EXPORTER_OPTIONS, DEFAULT_STL_EXPORTER_OPTIONS, DEFAULT_USDZ_EXPORTER_OPTIONS, DEFAULT_USDZ_EXPORTER_OPTIONS_AR, ExportOptions, ExportParameters, ExportType, USDZExporterAlignmentTypes, USDZExporterAnchoringTypes, doExport, save } from "@orb_tools/Exporter";
import { ItemBoolean, ItemInput, ItemNumber, ItemSelect } from "@orb_UI/controller/ControllerItems";
import { ConvertModal, textureSizeOptions } from "./Tools";
import { useViewport } from "src/store/Viewport";
import { GLTFExporterOptions, USDZExporterOptions } from "three/examples/jsm/Addons";

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
    { value: 'gltf', label: 'GLTF / GLB' },
    { value: 'usdz', label: 'USDZ' },
    { value: 'obj', label: 'OBJ' },
    { value: 'ply', label: 'PLY' },
    { value: 'stl', label: 'STL' }
]

const USDZAlignmentSelect = [
    { value: "horizontal", label: "horizontal" },
    { value: "vertical", label: "vertical" },
    { value: "any", label: "any" }
] as { value: string, label: string }[];

// @ts-ignore
const USDZAnchoringSelect = [
    { value: "plane", label: "plane" },
    { value: "image", label: "image" },
    { value: "face", label: "face" },
    { value: "none", label: "none" }
] as { value: string, label: string }[];

const exportSettings: ExportOptions<ExportParameters> = { name: "exportName", type: "gltf", selectionOnly: false, parameters: { ...DEFAULT_GLTF_EXPORTER_OPTIONS } }

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
                            case "gltf":
                                exportSettings.parameters = { ...DEFAULT_GLTF_EXPORTER_OPTIONS };
                                break;
                            case "usdz":
                                exportSettings.parameters = { ...DEFAULT_USDZ_EXPORTER_OPTIONS };
                                break;
                            case "obj":
                                exportSettings.parameters = undefined;
                                break;
                            case "ply":
                                exportSettings.parameters = { ...DEFAULT_PLY_EXPORTER_OPTIONS };
                                break;
                            case "stl":
                                exportSettings.parameters = { ...DEFAULT_STL_EXPORTER_OPTIONS };
                                break;
                        }
                        setType(exportSettings.type);
                    }}
                />
                {
                    exportSettings.parameters &&
                    <>
                        <Divider children="Parameters" />
                        {
                            type == "gltf" &&
                            <>
                                <ItemBoolean variable="binary" label="Binary" tooltip="Export in binary (.glb) format instead of .gltf" object={exportSettings.parameters} />
                                <ItemBoolean variable="trs" object={exportSettings.parameters} labelInVariable />
                                <ItemBoolean variable="onlyVisible" object={exportSettings.parameters} labelInVariable />
                                <ItemBoolean variable="truncateDrawRange" object={exportSettings.parameters} labelInVariable />
                                <ItemBoolean variable="embedImages" object={exportSettings.parameters} labelInVariable />
                                <ItemNumber variable="maxTextureSize" object={exportSettings.parameters} labelInVariable />
                                {/* to-do maybe make it so users can select animations, for now it will export all animations off of what the model has */}
                                {/* <ItemBoolean variable="animations" object={exportSettings.parameters} /> */}
                                <ItemBoolean variable="forceIndices" object={exportSettings.parameters} labelInVariable />
                            </>
                        }
                        {
                            type == "usdz" &&
                            <>
                                <ItemBoolean variable="includeAnchoringProperties" object={exportSettings.parameters} labelInVariable />
                                <ItemBoolean variable="quickLookCompatible" object={exportSettings.parameters} labelInVariable />
                                <ItemNumber variable="maxTextureSize" object={exportSettings.parameters} labelInVariable />
                                <ItemSelect
                                    disabled={!(exportSettings.parameters as USDZExporterOptions).includeAnchoringProperties}
                                    object={{ alignment: USDZAlignmentSelect }}
                                    defaultValue="horizontal"
                                    variable="alignment" label="Anchor Alignment"
                                    onChangeSelect={(s) => {
                                        const p = (exportSettings.parameters as USDZExporterOptions)
                                        p.ar!.planeAnchoring.alignment = s as USDZExporterAlignmentTypes;
                                    }}
                                />
                            </>
                        }
                        {
                            type == "ply" &&
                            <>
                                <ItemBoolean variable="binary" object={exportSettings.parameters} labelInVariable />
                                <ItemBoolean variable="littleEndian" object={exportSettings.parameters} labelInVariable />
                            </>
                        }
                        {
                            type == "stl" &&
                            <ItemBoolean variable="binary" object={exportSettings.parameters} labelInVariable />
                        }
                    </>
                }
            </Form>
        </Modal>
    )
}

export default File