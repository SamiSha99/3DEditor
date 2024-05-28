import { CameraOutlined, FieldBinaryOutlined, InboxOutlined } from "@ant-design/icons";
import { useStores } from "@orb_App";
import { doConvert, doConvertFileList, ConversionTypes } from "@orb_tools/Convertor";
import { ExportType } from "@orb_tools/Exporter";
import { Screenshot } from "@orb_tools/ModelPreviewer";
import { Dropdown, message, Button, Modal, Form, Select, Input, Upload, UploadProps, UploadFile } from "antd"
import { useState } from "react";
import * as THREE from 'three';

export const Tools = () => {
    const { controlsObject3D } = useStores();
    const [modalConvert, toggleModalConvert] = useState(false);
    return (
        <>
        <ConvertModal open={modalConvert} onCancel={() => {toggleModalConvert(false)}} onSubmit={(res, fileList) => {
            console.log(fileList);
                if(fileList) {
                   doConvertFileList(fileList, res.type);
                }
                toggleModalConvert(false);
            }} />
        <Dropdown
            children={<Button children={"Tools"} />}
            menu={{
                items: [
                {
                    label: 'Take a Screenshot',
                    key: '0',
                    icon: <CameraOutlined />,
                    onClick: () => {
                        if(controlsObject3D) {
                            const object = (controlsObject3D as THREE.Object3D).clone();
                            Screenshot(object);
                            message.success("Snip!");
                        }
                        else
                            message.warning("Select an object to take a screenshot!");
                    }
                },
                {
                    label: 'Convert...',
                    key: '1',
                    icon: <CameraOutlined />,
                    onClick: () => {
                        toggleModalConvert(true);
                        // doConvert(".glb");
                    }
                }
                ]
            }}/>
        </>
    )
}

type ConvertFormData = {name: string, type: ConversionTypes};
const exportOptions = [
    { value: '.glb', label: 'GLB'},
    { value: '.gltf', label: 'GLTF'},
    { value: '.usdz', label: 'USDZ'},
    { value: '.obj', label: 'OBJ'}
]



const ConvertModal: React.FC<{open: boolean, onCancel: () => void, onSubmit: (res: ConvertFormData, fileList: FileList) => void}>  = ({open, onCancel, onSubmit}) => {
    const dataDefault : ConvertFormData = {name: "exportName", type: ".glb"};
    const [data, setData] = useState<ConvertFormData>(dataDefault);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { Dragger } = Upload;

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        maxCount: 2,
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
                onSubmit(data, fileList as any as FileList);
                setData(dataDefault)
                setFileList([]);
            }} 
            onCancel={() => onCancel()}>
                <Form>
                    <Select title="Convert into"
                        defaultValue=".glb"
                        style={{ width: 120 }}
                        onChange={(val: ConversionTypes) => {
                            setData({name: data.name, type: val});
                        }}
                        options={exportOptions}
                        />
                    <Input defaultValue={"convertName"} title="how is it going?" onInput={(e) => {setData({name:(e.target as any).value, type:data.type})}} />
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                            banned files.
                        </p>
                     </Dragger>
                </Form>
        </Modal>
    )
}


