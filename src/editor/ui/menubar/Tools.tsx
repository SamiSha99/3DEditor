import * as ICONS from "@ant-design/icons";
import { useEditor } from "@orb_Editor";
import { Dropdown, message, Button, Modal, Form, Upload, UploadProps, UploadFile, Divider } from "antd"
import { useState } from "react";
import * as THREE from 'three';
import * as IMPORTER from '@orb_tools/Importer'
import * as EXPORTER from '@orb_tools/Exporter'
import * as CONVERTER from '@orb_tools/Converter'
import { observer } from "mobx-react-lite";
import { Sphere } from "@orb_tools/create/Primitive";
import { invertGeometry } from "src/editor/utils/Mesh";
import { PANEL_SCREENSHOT } from "@orb_UI/panels/Panels";
import { ItemInput, ItemSelect } from "@orb_UI/controller/ControllerItems";
import { useViewport } from "src/store/Viewport";

export const Tools = observer(() => {
    const { addObject, activatePanel } = useEditor();
    const { target } = useViewport();
    const [open, setOpen] = useState(false);
    return (
        <>
            <Dropdown
                open={open}
                trigger={["click"]}
                children={<Button children={"Tools"} />}
                onOpenChange={() => { setOpen(true) }}
                menu={{
                    items: [
                        {
                            label: 'Animations...',
                            key: '2',
                            icon: <ICONS.VideoCameraOutlined />,
                            children: [{
                                label: 'Export from Selected Object',
                                key: '2.1',
                                onClick: () => {
                                    if (target) {
                                        const animations = (target as THREE.Object3D).animations;
                                        if (!animations || animations.length <= 0) {
                                            message.warning("The selected model has no animations!");
                                            return;
                                        }
                                        animations.map((ac) => EXPORTER.exportAnimationClip(ac, true, (blob) => EXPORTER.save(blob, ac.name + ".ac")));
                                    }
                                    else
                                        message.warning("Select an object that has animations to export!");
                                }
                            },
                            {
                                label: 'Import into Selected Object',
                                key: '2.2',
                                onClick: () => {
                                    if (target) {
                                        IMPORTER.doImportAnimationClip((clip) => {
                                            (target as THREE.Object3D).animations.push(clip);
                                        })
                                    }
                                    else
                                        message.warning("Select an object to import an animation!");
                                }
                            }]
                        },
                        {
                            type: 'divider'
                        },
                        {
                            label: 'Create a Skydome',
                            key: '3',
                            icon: <ICONS.CloudOutlined />,
                            onClick: () => {
                                IMPORTER.doImportTexture((res) => {
                                    const mat = new THREE.MeshStandardMaterial({ map: res });
                                    const sphere = Sphere([, , 32], mat);
                                    sphere.name = "Skydome"
                                    invertGeometry(sphere.geometry);

                                    // sphere.renderOrder = 1

                                    // https://woodenraft.games/blog/how-to-hide-water-plane-inside-hollow-boat-threejs
                                    // const hider = new THREE.MeshStandardMaterial({ side: THREE.FrontSide, colorWrite: false });
                                    // const sphereFront = Sphere({ heightSegments: 32, thetaStart: Math.PI / 8 }, hider);
                                    // sphereFront.name = "Front"
                                    // sphereFront.rotation.set(Math.PI / 2, 0, 0);
                                    // sphereFront.scale.setScalar(1.005);
                                    // const group = new THREE.Group();
                                    // group.name = "Skydome"
                                    // group.add(sphereFront);
                                    // group.add(sphere);

                                    addObject(sphere);
                                })
                            }
                        },
                        {
                            label: 'Take a Screenshot',
                            key: '0',
                            icon: <ICONS.CameraOutlined />,
                            onClick: () => {
                                activatePanel(PANEL_SCREENSHOT);
                            }
                        }
                    ],
                    onClick: () => { setOpen(true) },
                    onMouseLeave: () => { setOpen(false) }
                }} />
        </>
    )
})

const exportOptions = [
    { value: 'glb', label: 'GLB' },
    { value: 'gltf', label: 'GLTF' },
    { value: 'usdz', label: 'USDZ' },
    { value: 'obj', label: 'OBJ' }
]

export const textureSizeOptions = [
    { value: '2048', label: '2048' },
    { value: '1024', label: '1024' },
    { value: '512', label: '512' },
    { value: '256', label: '256' },
    { value: '128', label: '128' },
    { value: '64', label: '64' },
    { value: '32', label: '32' }
]

type ConvertModalInterface = {
    open: boolean,
    onSubmit: () => void,
    onCancel: () => void
}

const exportSettings = { name: "myExport", type: exportOptions[0].value, textureSize: 1024 }

export const ConvertModal = (props: ConvertModalInterface) => {
    const { open, onCancel, onSubmit } = props;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { Dragger } = Upload;

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        maxCount: 32,
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (_file, fc) => {
            // const fl = fc as any as FileList;
            setFileList(fc);
            return false;
        },
        fileList,
    };

    const onRequest = () => {
        const list = fileList as any as FileList;
        const res = exportSettings;
        if (fileList) {
            CONVERTER.doConvertFileList(list, { type: res.type as EXPORTER.ExportType, name: res.name /*, maxTextureSize: res.textureSize*/ }, (blob) => {
                EXPORTER.save(blob, (res.name || "export") + "." + res.type)
            });
        }
        setFileList([]);
        onSubmit();
    }

    return (
        <Modal title={"Convert File(s)..."} open={open} onOk={onRequest} onCancel={onCancel}>
            <Form>
                <p>Convert 3D model files into .glb, .gtlf, .usdz (ASCII), .ply, .stl and .obj.</p>
                <Divider />
                <ItemSelect object={{ exportOptions: exportOptions }} variable="exportOptions" labelInVariable defaultValue={exportOptions[0].value} onChangeSelect={(s) => { exportSettings.type = s as EXPORTER.ExportType }} />
                <ItemSelect object={{ textureSize: textureSizeOptions }} variable="textureSize" labelInVariable defaultValue={textureSizeOptions[0].value} onChangeSelect={(s) => { exportSettings.textureSize = parseFloat("" + s) }} />
                <ItemInput object={exportSettings} variable="name" labelInVariable />
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <ICONS.InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload.</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
            </Form>
        </Modal>
    )
}

export default Tools
