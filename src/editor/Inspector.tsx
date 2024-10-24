import { useEditor } from "@orb_Editor";
import { Button, ConfigProvider, Divider, Form, Row, Splitter, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { InspectorTheme } from "@orb_UI/antd/ThemeConfigs";
import { InspectorScene } from "./data/Scene";
import { InspectorObject3D } from "./data/Object3D";
import { InspectorMaterial } from "./data/Material";
import { InspectorGeometry } from "./data/Geometry";
import { ControlsBar } from "@orb_UI/ControlsBar";
import Canvas from './Canvas'
import * as THREE from "three"
import Overlay from "./Overlay";

export const Inspector = () => {
    const { controlsObject3D } = useEditor();

    return (
        <Splitter>
            <Splitter.Panel defaultSize={"70%"} min={"60%"} max={"80%"}>
                <div style={{ display: "flex", position: "relative" }}>
                    <Canvas />
                    <ControlsBar />
                    <Overlay />
                </div>
            </Splitter.Panel>
            <Splitter.Panel>
                <div style={{ backgroundColor: "#212121", height: "100vh" }}>
                    <ConfigProvider theme={InspectorTheme}>
                        <div style={{ height: "25%", padding: "0 10px" }}>
                            <HierarchyTree />
                        </div>
                        <div style={{ height: "calc(75% - 32px)", padding: "0 10px" }}>
                            <SelectedObject key={controlsObject3D?.uuid} object={controlsObject3D} />
                        </div>
                    </ConfigProvider>
                </div>
            </Splitter.Panel>
        </Splitter>

    )
}

export const HierarchyTree = observer(() => {
    const { sceneObjects, scene, setControlsTarget } = useEditor();

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

export const SelectedObject: React.FC<{ object: THREE.Object3D | null }> = observer(({ object }) => {
    const [tab, setTab] = useState(object ? "OBJECT" : "");
    return (
        <>
            {
                <>
                    <Row style={{ marginTop: 24 }}>
                        <Button children={"SCENE"} onClick={() => setTab("SCENE")} />
                        <Button disabled={object == null} children={"OBJECT"} onClick={() => setTab("OBJECT")} />
                        {
                            object && object instanceof THREE.Mesh &&
                            <>
                                <Button disabled={!object.material} children={"GEOMETRY"} onClick={() => setTab("GEOMETRY")} />
                                <Button disabled={!object.material} children={"MATERIAL"} onClick={() => setTab("MATERIAL")} />
                            </>
                        }
                        <Divider style={{ margin: 0 }} />
                    </Row>
                    {
                        tab &&
                        <div style={{ height: "calc(100% - 72px)", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarGutter: "auto" }}>
                            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} colon={false} labelWrap>
                                {tab == "SCENE" && <InspectorScene />}
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

export default Inspector