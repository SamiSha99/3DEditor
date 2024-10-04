import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { Button, ConfigProvider, Divider, Form, Row, Tabs, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from "three"
import { ItemNumber, ItemInput, ItemVector3, ItemEuler, ItemSelect, ItemColorPicker, ItemBoolean, ItemTexture, ItemGroup, ItemVector2 } from "./ui/controller/ControllerItems";
import { Color } from "antd/es/color-picker";
import { AppStore } from "@orb_AppStore";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { InspectorTheme } from "@orb_UI/antd/ThemeConfigs";
import { InspectorMaterial } from "./data/Material";
import { InspectorObject3D } from "./data/Object3D";
import { MenuBar } from "@orb_UI/Menubar";
import { ControlsBar } from "@orb_UI/ControlsBar";
import { ActivePanels } from "@orb_UI/ActivePanels";
import { InspectorGeometry } from "./data/Geometry";

export const EditorInspector = observer(() => {
    const { controlsObject3D } = useStores();

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
            <div>
                <MenuBar />
                <ControlsBar />
            </div>
            <div style={{ alignSelf: "flex-end", backgroundColor: "#212121", width: "25vw" }}>
                <ConfigProvider theme={InspectorTheme}>
                    <div style={{ height: "20vh", padding: "0 10px" }}>
                        <HierarchyTree />
                    </div>
                    {/* <SceneConfigs /> */}
                    <div style={{ height: "calc(80vh - 32px)", padding: "0 10px" }}>
                        <SelectedObject key={controlsObject3D?.uuid} object={controlsObject3D} />
                    </div>
                </ConfigProvider>
            </div>
        </div >
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
        <div style={{ margin: "auto auto", height: "100%", alignContent: "top", overflow: "auto", scrollbarWidth: "thin", background: "#696969" }}>
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
    const [tab, setTab] = useState(object ? "OBJECT" : "");
    return (
        <>
            {
                object &&
                <>
                    <Row style={{ marginTop: 24 }}>
                        <Button disabled={object == null} children={"OBJECT"} onClick={() => setTab("OBJECT")} />
                        {
                            object instanceof THREE.Mesh &&
                            <>
                                <Button disabled={!object.material} children={"GEOMETRY"} onClick={() => setTab("GEOMETRY")} />
                                <Button disabled={!object.material} children={"MATERIAL"} onClick={() => setTab("MATERIAL")} />
                            </>
                        }
                        <Divider style={{ margin: 0 }} />
                    </Row>
                    {
                        tab &&
                        <div style={{ height: "calc(100% - 72px)", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin" }}>
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} labelWrap>
                                {tab == "OBJECT" && object && <InspectorObject3D object={object} />}
                                {
                                    object instanceof THREE.Mesh &&
                                    <>
                                        {tab == "MATERIAL" && <InspectorMaterial material={object.material} />}
                                        {tab == "GEOMETRY" && <InspectorGeometry geometry={object.geometry} />}
                                    </>
                                }
                            </Form>
                        </div >
                    }
                </>
            }
        </>
    )

},)

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