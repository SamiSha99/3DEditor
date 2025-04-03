import * as THREE from "three"
import { useEditor } from "@orb_Editor";
import { Button, Col, ConfigProvider, Divider, Form, Row, Splitter, Tooltip, Tree, TreeDataNode, TreeProps } from "antd";
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
import { TabIcon } from "src/assets/icons";

export const Inspector = () => {
    return (
        <Splitter>
            {/* disabled being resizable */}
            <Splitter.Panel resizable={false} defaultSize={"66.667%"} min={"33.3%"} max={"80%"}>
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
                        <div style={{ height: "25%" }}>
                            <HierarchyTree />
                        </div>
                        <Divider style={{ margin: 0 }} />
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
        <div style={{ height: "100%", alignContent: "top", overflow: "auto", scrollbarColor: "grey transparent", background: "#141414" }}>
            <h2 style={{ paddingLeft: 10 }}>Scene</h2>
            {/* <Divider variant="dashed" style={{margin: 0}}/> */}
            <Tree defaultExpandAll showLine blockNode onSelect={onSelect} treeData={treeData} />
        </div>
    )
})

interface TabButtonProps {
    type: TabIcon;
    disabled?: boolean;
    onClick?: () => void;
}

const TAB_BUTTON_SIZE = 48;

export const TabButton = observer((props: TabButtonProps) => {
    const tabCSS: React.CSSProperties = { width: "100%", height: TAB_BUTTON_SIZE };
    const { type, disabled, onClick } = props;
    const title = (type as string).charAt(0).toUpperCase() + (type as string).slice(1);
    return (
        <Tooltip title={title} placement="left" children={
            <Button style={tabCSS} disabled={disabled} children={<TabIcon iconType={type} />} onClick={() => onClick && onClick()} />
        } />
    );
})

export const SelectedObject = observer(() => {
    const { target } = useViewport();
    const [tab, setTab] = useState(target ? "Object" : "");

    useEffect(() => { target instanceof THREE.Object3D && setTab("Object"); !target && setTab(""); }, [target]);

    const isMesh = target != null && (target instanceof THREE.Mesh || (target.constructor.name == "Mesh" && (target as THREE.Mesh).isMesh));
    const material = isMesh ? (target as THREE.Mesh)?.material as THREE.Material : undefined;
    const geometry = (target as THREE.Mesh)?.geometry;

    return (
        <>
            {
                <Row style={{ background: "#212121", height: "100%", flexWrap: "nowrap" }}>
                    <Col style={{ width: TAB_BUTTON_SIZE, background: "#141414" }}>
                        <TabButton type="scene" onClick={() => setTab("Scene")} />
                        <TabButton type="object" disabled={target == null} onClick={() => setTab("Object")} />
                        <TabButton type="animation" disabled={target == null} onClick={() => setTab("Animation")} />
                        <TabButton type="geometry" disabled={!isMesh || !geometry} onClick={() => setTab("Geometry")} />
                        <TabButton type="material" disabled={!isMesh || !geometry} onClick={() => setTab("Material")} />
                    </Col>
                    <Col style={{ width: "100%"}}>
                        <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden", scrollbarColor: "grey transparent" }}>
                            <Form key={Math.random().toString() + target?.uuid} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                                {tab == "Scene" && <InspectorScene />}
                                {tab == "Object" && target && <InspectorObject3D object={target} />}
                                {
                                    isMesh &&
                                    <>
                                        {tab == "Material" && <InspectorMaterial material={material} />}
                                        {tab == "Geometry" && <InspectorGeometry geometry={geometry} />}
                                    </>
                                }
                                {
                                    tab == "Animation" && target instanceof THREE.Object3D &&
                                    <InspectorAnimation animations={target.animations} />
                                }
                            </Form>
                        </div>
                    </Col>
                </Row>
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