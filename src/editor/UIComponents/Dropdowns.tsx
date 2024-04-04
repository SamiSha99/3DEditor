import { ExportOutlined, ImportOutlined } from "@ant-design/icons";
import { Dropdown, Button, message } from "antd";
import { doExportGLTF, doExportUSDZ } from "../Exporters";
import { useStores } from "../../App";
import { doImport } from "../Importers";
import { GenerateBox, GenerateCylinder, GeneratePlane, GenerateSphere } from "../MeshCreator/Primitives";

export const FileDropDown = () => {
    const {scene, pushComponentToScene} = useStores();
    return(
        <Dropdown
            children={<Button children={"File"} />}
            menu={{
            items: [{
                label: 'Import Scene',
                key: '1',
                icon: <ImportOutlined />,
                onClick: () => {
                    doImport(pushComponentToScene, (res) => {
                        if(res)
                        {
                            message.success("Import successful!");
                        }
                        else
                        {
                            message.error("Import failed!");
                        }
                    });
                }
            },
            {
                label: 'Export Scene',
                key: '2',
                icon: <ExportOutlined />,
                // to-do better implemetation for gltf/glb instead of a bool?
                onClick: () => {
                    const sceneClone = scene.clone();
                    const editorHelpers = sceneClone.getObjectByName('EDITOR_HELPER_DO_NOT_MODIFY');
                    console.log(editorHelpers);
                    if(editorHelpers)
                        sceneClone.remove(editorHelpers);
                    doExportGLTF(sceneClone, false)
                }
            },
            {
                label: 'Export Scene (GLB)',
                key: '3',
                icon: <ExportOutlined />,
                // to-do better implemetation for gltf/glb instead of a bool?
                onClick: () => {
                    const sceneClone = scene.clone();
                    const editorHelpers = sceneClone.getObjectByName('EDITOR_HELPER_DO_NOT_MODIFY');
                    console.log(editorHelpers);
                    if(editorHelpers)
                        sceneClone.remove(editorHelpers);
                    doExportGLTF(sceneClone, true)
                }
            },
            {
                label: 'Export Scene (USDZ)',
                key: '4',
                icon: <ExportOutlined />,
                onClick: () => {
                    const sceneClone = scene.clone();
                    const editorHelpers = sceneClone.getObjectByName('EDITOR_HELPER_DO_NOT_MODIFY');
                    if(editorHelpers)
                        sceneClone.remove(editorHelpers);
                    doExportUSDZ(sceneClone)
                }
            }]
        }}/>
    )
}

export const CreateDropDown = () => {
    const {pushComponentToScene} = useStores();

    return(
        <Dropdown 
            children={<Button children={"Create"} />} 
            menu={{
                items: [{
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