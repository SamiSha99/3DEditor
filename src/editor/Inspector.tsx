import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { ConfigProvider, Divider, Form, Tabs, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from "three"
import { ItemNumber, ItemInput, ItemVector3, ItemEuler, ItemSelect, ItemColorPicker, ItemBoolean, ItemTexture, ItemGroup, ItemVector2 } from "./ui/controller/ControllerItems";
import { Color } from "antd/es/color-picker";
import { AppStore } from "@orb_AppStore";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { InspectorTheme } from "@orb_UI/antd/ThemeConfigs";

export const EditorInspector = observer(() => {
    const { controlsObject3D } = useStores();

    return (
        <div style={{ backgroundColor: "#212121", width: "25%" }}>
            <ConfigProvider theme={InspectorTheme}>
                <div style={{ height: "20vh", paddingLeft: 10, paddingRight: 10 }}>
                    <HierarchyTree />
                </div>
                <SceneConfigs />
                <div style={{ height: "80vh", padding: "0 10px" }}>
                    <SelectedObject key={controlsObject3D?.uuid} object={controlsObject3D} />
                </div>
            </ConfigProvider>
        </div>
    )
})

export const HierarchyTree = observer(() => {
    // @ts-ignore
    const { sceneObjects, environment, spliceObject, scene, onUpdateInspector, badForceUpdateInspector, setControlsTarget, setEnvironmentByName } = useStores();

    let treeData = getTreeDataNodes(sceneObjects as THREE.Object3D[]);

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        const selectedObject = scene.getObjectById(selectedKeys[0] as number);
        if (selectedObject)
            setControlsTarget(selectedObject);
    };

    return (
        <div style={{ margin: "auto auto", height: "100%", alignContent: "top", overflow: "auto", background: "#696969" }}>
            <Tree defaultExpandAll showLine blockNode onSelect={onSelect} treeData={treeData} />
        </div>
    )
})

export const SceneConfigs = observer(() => {
    const { environment, setEnvironmentByName, background, setbackground, scene } = useStores();
    const [_backgroundEnabled, setBackgroundEnabled] = useState(false);

    const environmentList = () => {
        let options: { value: string, label: string }[] = [];
        environments.map((e) => {
            const obj = { value: e ? e : "undefined", label: e ? e.replace(/^./, e[0].toUpperCase()) : "Custom" };
            if (e)
                options.push(obj);
            else
                options.unshift(obj)
        })
        return options;
    }

    const list = environmentList();

    return (
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} labelWrap>
            <ItemSelect object={{ Environment: list }} variable="Environment" label="Environment"
                defaultValue={!environment ? "Custom" : environment.replace(/^./, environment[0].toUpperCase())}
                labelInValue={true}
                onChangeSelect={(select: { value: string, label: string }) => {
                    let v = undefined;
                    if (select.value != "undefined") v = select.value as Environments
                    setEnvironmentByName(v)
                }}
                options={list} />
            {/* to-do: finish this! */}
            <ItemColorPicker
                object={scene}
                variable="background"
                label="Background"
                allowAlpha={false}
                defaultValue={background ? background.getHexString().replace("#", "") : AppStore.DEFAULT_SCENE_BACKGROUND_COLOR.getHexString()}
                onChangeCheckbox={(e) => {
                    setBackgroundEnabled(e.target.checked);
                    setbackground(e.target.checked ? background : null, e.target.checked);
                    console.log("checking..")
                }}
                onChangeColorPicker={(_value: Color, hex: string) => {
                    scene.background = new THREE.Color(hex);
                }}
                onChangeCompleteColorPicker={(c) => {
                    const hex = c.toHexString().replace("#", "");
                    setbackground(new THREE.Color(parseInt(hex, 16)));
                }} />
        </Form>

    )
})

export const SelectedObject: React.FC<{ object: THREE.Object3D | null }> = observer(({ object }) => {
    return (
        <Tabs style={{ height: "85%", overflowY: "auto", overflowX: "hidden" }} items={[
            {
                key: '1',
                label: 'General',
                children:
                    <div style={{ height: "100%", margin: "auto", alignContent: "top" }}>
                        {
                            object &&
                            <Form style={{ overflow: "auto" }} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                                <ItemInput object={object} variable="name" />
                                <ItemNumber object={object} variable="renderOrder" />
                                <ItemBoolean object={object} variable="visible" icons={{ on: <EyeOutlined />, off: <EyeInvisibleOutlined /> }} />
                                <ItemVector3 object={object} variable="position" />
                                <ItemEuler object={object} variable="rotation" isDegree />
                                <ItemVector3 object={object} variable="scale" />
                            </Form>
                        }
                    </div>
            },
            {
                key: '2',
                label: 'Material',
                children:
                    <div style={{ height: "auto", margin: "auto", alignContent: "top" }}>
                        <div style={{ overflowY: "auto", overflowX: "hidden" }}>
                            {
                                object instanceof THREE.Mesh && object.material &&
                                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                                    {getMaterialByType(object.material)}
                                </Form>
                            }
                        </div>
                    </div>
            }
        ]}>

        </Tabs>
    )
},)

function getMaterialByType(material: THREE.Material) {
    console.log(material.type, material.type == 'MeshBasicMaterial');
    console.log(material);
    switch (material.type) {
        case 'MeshStandardMaterial':
            return (
                <div>
                    <ItemTexture object={material} variable="map" />
                    <ItemNumber object={material} variable="metalness" limit={{ min: 0, max: 1 }} />
                    <ItemNumber object={material} variable="roughness" limit={{ min: 0, max: 1 }} />
                    <ItemNumber object={material} variable="opacity" limit={{ min: 0, max: 1 }} />
                    <ItemNumber object={material} variable="_alphaTest" limit={{ min: 0, max: 1 }} label="Alpha Test" />
                    <ItemBoolean object={material} variable="wireframe" />
                    <ItemBoolean object={material} variable="transparent" />
                    <ItemBoolean object={material} variable="fog" />
                    <ItemBoolean object={material} variable="flatShading" />
                    <ItemGroup key={"1"} label={"Ambient Occlusion"}>
                        <ItemTexture object={material} variable="aoMap" label="Map" />
                        <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
                    </ItemGroup>
                    <ItemGroup key={"1"} label={"Normal"}>
                        <ItemTexture object={material} variable="normalMap" label="Map" />
                        <ItemVector2 object={material} variable="normalScale" label="Scale" />
                        <ItemNumber object={material} variable="aoMapIntensity" label="Intensity" />
                    </ItemGroup>
                </div >
            )
    }
    return <></>
}

// Want to avoid showing the "Scene" node, so the first function is just iterating the root objects before going deeper on each one.
function getTreeDataNodes(sceneObjects: THREE.Object3D[]) {
    let tree: TreeDataNode[] = [];
    sceneObjects.forEach(o => {
        const node = createTreeDataNode(o);
        if (node)
            tree.push(node);
    });
    return tree;
}

function createTreeDataNode(object: THREE.Object3D) {
    let nodeObject: TreeDataNode;
    if (object.children?.length > 0) {
        let childrenNodes: TreeDataNode[] = [];
        object.children.forEach(child => {
            const childNode = createTreeDataNode(child);
            if (childNode)
                childrenNodes.push(childNode);
        });
        nodeObject = { title: object.name, key: object.id, children: childrenNodes, icon: false }
    }
    else
        nodeObject = { title: object.name, key: object.id, icon: false }

    return nodeObject;
}

export default EditorInspector