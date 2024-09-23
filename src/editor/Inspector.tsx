import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { Divider, Form, Tabs, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from "three"
import { ItemNumber, ItemInput, ItemVector3, ItemEuler, ItemSelect, ItemColorPicker, ItemBoolean, ItemTexture, ItemGroup } from "./ui/controller/ControllerItems";
import { Color } from "antd/es/color-picker";
import { AppStore } from "@orb_AppStore";

export const EditorInspector = observer(() => {
    const { controlsObject3D } = useStores();

    return (
        <div style={{ backgroundColor: "#212121", width: "25%" }}>
            <div style={{ width: "100%", height: "20%" }}>
                <HierarchyTree />
                <Divider />
                <SceneConfigs />
                <Divider />
                <SelectedObject key={controlsObject3D?.uuid} object={controlsObject3D} />
            </div>
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
        <div style={{ margin: "auto auto", width: "90%", height: "90%", alignContent: "top", overflow: "auto", background: "#696969" }}>
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
        <Tabs items={[
            {
                key: '1',
                label: 'General',
                children:
                    <div style={{ margin: "auto", alignContent: "top" }}>
                        {
                            object &&
                            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                                <ItemInput object={object} variable="name" />
                                <ItemNumber object={object} variable="renderOrder" />
                                <ItemBoolean object={object} variable="visible" />
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
                    <div style={{ margin: "auto", alignContent: "top" }}>
                        {
                            object instanceof THREE.Mesh && object.material &&
                            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                                {getMaterialByType(object.material)}
                            </Form>
                        }
                    </div>
            }
        ]}>

        </Tabs>
    )
},)

function getMaterialByType(material: THREE.Material) {
    console.log(material.type, material.type == 'MeshBasicMaterial');
    switch (material.type) {
        case 'MeshStandardMaterial':
            return (
                <>
                    <ItemGroup key={"0"} label={"General"}>
                        <ItemTexture object={material} variable="map" />
                        <ItemBoolean object={material} variable="wireframe" />
                        <ItemNumber object={material} variable="metalness" limit={{ min: 0, max: 1 }} />
                        <ItemBoolean object={material} variable="fog" />
                        <ItemBoolean object={material} variable="flatShading" />
                    </ItemGroup>
                    <ItemGroup key={"1"} label={"Ambient Occlusion"}>
                        <ItemTexture object={material} variable="aoMap" />
                        <ItemNumber object={material} variable="aoMapIntensity" />
                    </ItemGroup>
                    <ItemTexture object={material} variable="normalMap" />
                </>
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