import * as ICONS from "@ant-design/icons";
import { useEditor } from "@orb_Editor";
import { Dropdown, Button, Modal, Form, Upload, UploadProps, UploadFile, Divider } from "antd"
import { useState } from "react";
import * as THREE from 'three';
import * as PINATA from '@dgreenheck/three-pinata'
import * as IMPORTER from '@orb_tools/Importer'
import * as EXPORTER from '@orb_tools/Exporter'
// import * as CONVERTER from '@orb_tools/Converter'
import { observer } from "mobx-react-lite";
import { Sphere } from "@orb_tools/create/Primitive";
import { invertGeometry } from "@orb_utils/three/Geometry";
import { PANEL_SCREENSHOT } from "@orb_UI/panels/Main";
import { ItemInput, ItemSelect } from "@orb_UI/controller/ControllerItems";
import { useViewport } from "src/store/Viewport";
import { MenuButtonProps } from "@orb_types";

import * as GEOMETRYUTILS from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const Tools = observer((props: MenuButtonProps) => {
    const { addObject, replaceObject, activatePanel } = useEditor();
    const { target } = useViewport();
    const { onclick } = props;
    return (
        <>
            <Dropdown
                trigger={["click"]}
                children={<Button children={"Tools"} />}
                onOpenChange={(b) => { onclick(b) }}
                menu={{
                    items: [
                        {
                            label: 'Object to Fragments',
                            key: '1',
                            icon: <ICONS.SketchOutlined />,
                            disabled: !(target instanceof THREE.Mesh),
                            onClick: () => {
                                const o = target as THREE.Mesh;
                                console.log(o, o.geometry);
                                const fragmentGroup = new THREE.Group();
                                fragmentGroup.name = o.name + "_group_fragments";
                                const options = new PINATA.FractureOptions({ fragmentCount: 25 });
                                const outMat = Array.isArray(o.material) ? o.material[0] : o.material; //new THREE.MeshStandardMaterial({ color: 0xffffff });
                                const inMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                                const g = GEOMETRYUTILS.mergeVertices(o.geometry);
                                PINATA.fracture(g, options).forEach((fragment, index) => {
                                    const fragmentMesh = new THREE.Mesh(fragment, [outMat, inMat]);

                                    fragment.computeBoundingBox();
                                    fragment.boundingBox?.getCenter(fragmentMesh.position);
                                    // Store fragment position in user data so it can be animated later
                                    fragmentMesh.userData.center = fragmentMesh.position.clone();
                                    fragmentGroup.add(fragmentMesh);
                                    fragmentMesh.position.set(0, 0, 0);
                                    fragmentMesh.name = "fragment_" + index;
                                });
                                replaceObject(o, fragmentGroup, true);
                            }
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
                }}
            />
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
            // CONVERTER.doConvertFileList(list, { type: res.type as EXPORTER.ExportType, name: res.name /*, maxTextureSize: res.textureSize*/ }, (blob) => {
            //     EXPORTER.save(blob, (res.name || "export") + "." + res.type)
            // });
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
