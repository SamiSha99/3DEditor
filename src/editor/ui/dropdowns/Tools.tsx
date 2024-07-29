import * as ICONS from "@ant-design/icons";
import { useStores } from "@orb_App";
import { doConvertFileList } from "@orb_tools/converter";
import { ExportType, save } from "@orb_tools/Exporter";
import { Screenshot } from "@orb_tools/previewer";
import { Dropdown, message, Button, Modal, Form, Select, Input, Upload, UploadProps, UploadFile } from "antd"
import { useState } from "react";
import * as THREE from 'three';
import * as EXPORTER from '@orb_tools/Exporter'

export const Tools = () => {
    const { controlsObject3D } = useStores();
    const [modalConvert, toggleModalConvert] = useState(false);
    return (
        <>
            <ConvertModal open={modalConvert} onCancel={() => { toggleModalConvert(false) }} onSubmit={(res, fileList) => {
                console.log(fileList);
                if (fileList) {
                    doConvertFileList(fileList, { type: res.type, name: res.name, maxTextureSize: res.textureSize }, (blob) => {
                        save(blob, (res.name || "export") + "." + res.type)
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
                            label: 'Export Animations',
                            key: '2',
                            icon: <ICONS.VideoCameraOutlined />,
                            onClick: () => {
                                if (controlsObject3D) {
                                    const animations = (controlsObject3D as THREE.Object3D).animations;
                                    if (!animations || animations.length <= 0) {
                                        message.warning("The selected model has no animations!");
                                        return;
                                    }
                                    animations.map((animation, index) => {
                                        const fileName = "animation_" + index + ".json";
                                        const optimized = animation.clone().optimize();
                                        const json = EXPORTER.saveJSON(THREE.AnimationClip.toJSON(optimized));
                                        if(json)
                                            EXPORTER.save(json, fileName); 
                                    })
                                }
                                else
                                    message.warning("Select an object that has animations to export!");
                            }
                        }
                    ]
                }} />
        </>
    )
}

type ConvertFormData = { name: string, type: ExportType, textureSize: number };
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
    const [convertTo, setConvertTo] = useState<ExportType>("glb");
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
                    onChange={(val: ExportType) => setConvertTo(val)}
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
