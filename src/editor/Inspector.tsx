import * as THREE from "three"
import { useEditor } from "@orb_Editor";
import { Button, Col, ConfigProvider, Form, Row, Splitter, Tooltip, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { InspectorTheme } from "@orb_UI/antd/ThemeConfigs";
import { InspectorScene } from "./data/Scene";
import { InspectorObject3D } from "@orb_data/Object3D";
import { InspectorMaterial } from "@orb_data/Material";
import { InspectorGeometry } from "@orb_data/Geometry";
import { ControlsBar } from "@orb_UI/ControlsBar";
import Canvas from './Canvas'
import AssetsMenu from './AssetsMenu'
import Overlay from "./Overlay";
import { useViewport } from "src/store/Viewport";
import { InspectorAnimation } from "./data/Animation";
import { IconAnimation, IconGeometry, IconMaterial, IconObject, IconScene } from "src/assets/icons";

export const Inspector = () => {
    return (
        <Splitter>
            {/* disabled being resizable */}
            <Splitter.Panel resizable={false} defaultSize={"70%"} min={"62.5%"} max={"77.5%"}>
                <Splitter layout="vertical">
                    <Splitter.Panel resizable={false} defaultSize={"75%"} style={{ display: "flex", position: "relative", overflow: "hidden" }}>
                        <Canvas />
                        <Overlay />
                        <ControlsBar />
                    </Splitter.Panel>
                    <Splitter.Panel style={{ backgroundColor: "#212121" }}>
                        <AssetsMenu />
                    </Splitter.Panel>
                </Splitter>
            </Splitter.Panel>
            <Splitter.Panel>
                <div style={{ backgroundColor: "#212121", height: "100vh" }}>
                    <ConfigProvider theme={InspectorTheme}>
                        <div style={{ height: "25%", padding: "0 10px" }}>
                            <HierarchyTree />
                        </div>
                        <div style={{ height: "calc(75% - 32px)" }}>
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

export const SelectedObject = observer(() => {
    const { target } = useViewport();
    const [tab, setTab] = useState(target ? "OBJECT" : "");
    const tabCSS: React.CSSProperties = { width: "50%" };

    useEffect(() => { target && setTab("OBJECT"); !target && setTab(""); }, [target]);

    return (
        <>
            {
                <>
                    <Row style={{ marginTop: 12, padding: "0 10px 0 0", background: "#212121", height: "100%", width: "100%", flexWrap: "nowrap" }}>
                        <Col span={1} style={{ minWidth: 40 }}>
                            <Tooltip title="Scene" placement="left">
                                <Button style={tabCSS} children={<IconScene />} onClick={() => setTab("SCENE")} />
                            </Tooltip>
                            <Tooltip title="Object" placement="left">
                                <Button style={tabCSS} disabled={target == null} children={<IconObject />} onClick={() => setTab("OBJECT")} />
                            </Tooltip>
                            <Tooltip title="Animation" placement="left">
                                <Button style={tabCSS} disabled={target == null} children={<IconAnimation />} onClick={() => setTab("ANIMATION")} />
                            </Tooltip>
                            <Tooltip title="Geometry" placement="left">
                                <Button style={tabCSS} disabled={target == null || !(target instanceof THREE.Mesh) || !target.geometry} children={<IconGeometry />} onClick={() => setTab("GEOMETRY")} />
                            </Tooltip>
                            <Tooltip title="Material" placement="left">
                                <Button style={tabCSS} disabled={target == null || !(target instanceof THREE.Mesh) || !target.material} children={<IconMaterial />} onClick={() => setTab("MATERIAL")} />
                            </Tooltip>
                        </Col>
                        <Col span={23} style={{ maxWidth: "calc(100% - 40px)" }}>
                            <div style={{ height: "calc(100% - 32px)", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarGutter: "auto" }}>
                                <Form labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                                    {tab == "SCENE" && <InspectorScene />}
                                    {tab == "OBJECT" && target && <InspectorObject3D object={target} />}
                                    {
                                        target instanceof THREE.Mesh &&
                                        <>
                                            {tab == "MATERIAL" && <InspectorMaterial material={target.material} />}
                                            {tab == "GEOMETRY" && <InspectorGeometry geometry={target.geometry} />}
                                        </>
                                    }
                                    {
                                        tab == "ANIMATION" && target instanceof THREE.Object3D &&
                                        <InspectorAnimation animations={target.animations} />
                                    }
                                </Form>
                            </div>
                        </Col>
                    </Row>
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