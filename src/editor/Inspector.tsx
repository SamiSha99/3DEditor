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
import { useViewport } from "src/store/Viewport";

export const Inspector = () => {
    return (
        <Splitter>
            <Splitter.Panel defaultSize={"70%"} min={"62.5%"} max={"77.5%"}>
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
                            <SelectedObject />
                        </div>
                    </ConfigProvider>
                </div>
            </Splitter.Panel>
        </Splitter>

    )
}

export const HierarchyTree = observer(() => {
    const { sceneObjects, scene } = useEditor();
    const { setTarget } = useViewport();
    let treeData = getTreeDataNodes(sceneObjects as THREE.Object3D[]);

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        const selectedObject = scene.getObjectById(selectedKeys[0] as number);
        if (selectedObject)
            setTarget(selectedObject);
    };

    return (
        <div style={{ margin: "auto auto", height: "100%", alignContent: "top", overflow: "auto", scrollbarWidth: "thin", background: "#696969" }}>
            <Tree defaultExpandAll showLine blockNode onSelect={onSelect} treeData={treeData} />
        </div>
    )
})

export const SelectedObject: React.FC = observer(() => {
    const { controlsTarget } = useViewport();
    const [tab, setTab] = useState(controlsTarget ? "OBJECT" : "");
    return (
        <>
            {
                <>
                    <Row style={{ marginTop: 24 }}>
                        <Button children={"SCENE"} onClick={() => setTab("SCENE")} />
                        <Button disabled={controlsTarget == null} children={"OBJECT"} onClick={() => setTab("OBJECT")} />
                        {
                            controlsTarget && controlsTarget instanceof THREE.Mesh &&
                            <>
                                <Button disabled={!controlsTarget.material} children={"GEOMETRY"} onClick={() => setTab("GEOMETRY")} />
                                <Button disabled={!controlsTarget.material} children={"MATERIAL"} onClick={() => setTab("MATERIAL")} />
                            </>
                        }
                        <Divider style={{ margin: 0 }} />
                    </Row>
                    {
                        tab &&
                        <div style={{ height: "calc(100% - 72px)", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarGutter: "auto" }}>
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} labelWrap>
                                {tab == "SCENE" && <InspectorScene />}
                                {tab == "OBJECT" && controlsTarget && <InspectorObject3D object={controlsTarget} />}
                                {
                                    controlsTarget instanceof THREE.Mesh &&
                                    <>
                                        {tab == "MATERIAL" && <InspectorMaterial material={controlsTarget.material} />}
                                        {tab == "GEOMETRY" && <InspectorGeometry geometry={controlsTarget.geometry} />}
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