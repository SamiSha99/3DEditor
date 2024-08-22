import * as ICONS from "@ant-design/icons";
import { useStores } from "@orb_App";
import { Screenshot } from "@orb_tools/Previewer";
import { Dropdown, message, Button, Modal, Form, Select, Input, Upload, UploadProps, UploadFile } from "antd"
import { useState } from "react";
import * as THREE from 'three';
import * as IMPORTER from '@orb_tools/Importer'
import * as EXPORTER from '@orb_tools/Exporter'
import * as CONVERTER from '@orb_tools/Converter'
import { observer } from "mobx-react-lite";
import { Sphere } from "@orb_tools/create/Primitive";
import { handleInvertedGeometry } from "src/editor/utils/MeshUtils";
import { PANEL_ORIGIN_POINT, PANEL_SCREENSHOT } from "@orb_UI/panels/Panels";

export const Tools = observer(() => {
    const { controlsObject3D, addObject, setControlsModeByName, addActivePanel } = useStores();
    const [modalConvert, toggleModalConvert] = useState(false);
    return (
        <>
            <ConvertModal open={modalConvert} onCancel={() => { toggleModalConvert(false) }} onSubmit={(res, fileList) => {
                console.log(fileList);
                if (fileList) {
                    CONVERTER.doConvertFileList(fileList, { type: res.type, name: res.name, maxTextureSize: res.textureSize }, (blob) => {
                        EXPORTER.save(blob, (res.name || "export") + "." + res.type)
                    });
                }
                toggleModalConvert(false);
            }} />
            <Dropdown
                trigger={["click"]}
                children={<Button children={"Tools"} />}
                menu={{
                    items: [
                        {
                            label: 'Take a Screenshot',
                            key: '0',
                            icon: <ICONS.CameraOutlined />,
                            onClick: () => {
                                addActivePanel(PANEL_SCREENSHOT);
                                return;
                                if (controlsObject3D) {
                                    const object = (controlsObject3D as THREE.Object3D).clone();
                                    Screenshot(object).then(blob => {
                                        if (blob) {
                                            EXPORTER.save(blob, "preview.png");
                                            message.success("Snip!");
                                        }
                                    });
                                }
                                else
                                    message.warning("Select an object to take a screenshot!");
                            }
                        },
                        {
                            label: 'Convert...',
                            key: '1',
                            icon: <ICONS.CameraOutlined />,
                            onClick: () => {
                                toggleModalConvert(true);
                                // doConvert(".glb");
                            }
                        },
                        {
                            label: 'Animations...',
                            key: '2',
                            icon: <ICONS.VideoCameraOutlined />,
                            children: [{
                                label: 'Export from Selected Object',
                                key: '2.1',
                                onClick: () => {
                                    if (controlsObject3D) {
                                        const animations = (controlsObject3D as THREE.Object3D).animations;
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
                                    if (controlsObject3D) {
                                        IMPORTER.doImportAnimationClip((clip) => {
                                            (controlsObject3D as THREE.Object3D).animations.push(clip);
                                        })
                                    }
                                    else
                                        message.warning("Select an object to import an animation!");
                                }
                            }]
                        },
                        {
                            label: 'Create a Skydome',
                            key: '3',
                            icon: <ICONS.CloudOutlined />,
                            onClick: () => {
                                IMPORTER.doImportTexture((res) => {

                                    const mat = new THREE.MeshStandardMaterial({ map: res });
                                    const sphere = Sphere({ heightSegments: 32 }, mat);
                                    sphere.name = "Skydome"
                                    handleInvertedGeometry(sphere.geometry);
                                    
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
                            label: 'Adjust Origin Point',
                            key: '4',
                            icon: null,
                            onClick: () => {
                                addActivePanel(PANEL_ORIGIN_POINT)
                                setControlsModeByName("translate");
                            }
                        }
                    ]
                }} />
        </>
    )
})

type ConvertFormData = { name: string, type: EXPORTER.ExportType, textureSize: number };
const exportOptions = [
    { value: 'glb', label: 'GLB' },
    { value: 'gltf', label: 'GLTF' },
    { value: 'usdz', label: 'USDZ' },
    { value: 'obj', label: 'OBJ' }
]

const textureSizeOptions = [
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
    onCancel: () => void,
    onSubmit: (res: ConvertFormData, fileList: FileList) => void
}

const ConvertModal: React.FC<ConvertModalInterface> = ({ open, onCancel, onSubmit }) => {
    const [exportName, setExportName] = useState("exportName");
    const [convertTo, setConvertTo] = useState<EXPORTER.ExportType>("glb");
    const [textureSize, setTextureSize] = useState(2048);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { Dragger } = Upload;

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        maxCount: 32,
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file, fc) => {
            const fl = fc as any as FileList;
            console.log(fl);
            setFileList(fc);
            return false;
        },
        fileList,
    };

    return (
        <Modal
            title={"Convert..."}
            open={open}
            onOk={() => {
                onSubmit({ name: exportName, type: convertTo, textureSize: textureSize }, fileList as any as FileList);
                setConvertTo("glb");
                setExportName("exportName")
                setFileList([]);
            }}
            onCancel={() => onCancel()}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14, offset: 4 }}
                layout={"horizontal"}
            >
                <Select
                    title="Convert Into"
                    defaultValue={"glb"}
                    style={{ width: 120 }}
                    onChange={(val: EXPORTER.ExportType) => setConvertTo(val)}
                    options={exportOptions}
                />
                <Select
                    title="Texture Size"
                    defaultValue={2048}
                    onChange={(val) => setTextureSize(val)}
                    options={textureSizeOptions}
                />
                <Input
                    title="Name of Your File."
                    defaultValue={"convertName"}
                    onInput={(e) => { setExportName((e.target as any).value as string) }}
                />
                <Dragger {...props}>
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
