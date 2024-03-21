import { ExportOutlined, ImportOutlined } from "@ant-design/icons";
import { MenuProps, Dropdown, Button, message } from "antd";
import { doExportGLTF, doExportUSDZ } from "../Exporters";
import { useStores } from "../../App";
import { doImport } from "../Importer";
import { GenerateBox, GenerateCylinder, GeneratePlane, GenerateSphere } from "../MeshCreator/Primitives";

export const FileDropDown = () => {
    const {controlsObject3D, pushComponentToScene} = useStores();
    return(
        <Dropdown
            children={<Button>File</Button>}
            menu={{
            items: [{
                label: 'Import',
                key: '1',
                icon: <ImportOutlined />,
                onClick: () => {
                    doImport(pushComponentToScene);
                }
            },
            {
                label: 'Export',
                key: '2',
                icon: <ExportOutlined />,
                // to-do better implemetation for gltf/glb instead of a bool?
                onClick: () => {doExportGLTF(controlsObject3D, false)}
            },
            {
                label: 'Export USDZ',
                key: '3',
                icon: <ExportOutlined />,
                onClick: () => {doExportUSDZ(controlsObject3D)}
            }]
        }}/>
    )
}

export const CreateDropDown = () => {
    const {pushComponentToScene} = useStores();

    return(
        <Dropdown 
            children={<Button>Create</Button>} 
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