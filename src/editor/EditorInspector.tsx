import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { Divider, Form, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three"
import { ColorPickerItem, Input3Item, SelectItem } from "./ui/controls/ControlItem";
import { Color } from "antd/es/color-picker";

export const EditorInspector = observer(() => {
    return (
        <div style={{ backgroundColor: "#212121", width: "20%" }}>
            <div style={{ width: "100%", height: "25%" }}>
                <HierarchyTree />
                <Divider />
                <SceneConfigs />
                <Divider />
            </div>
        </div>
    )
})

export const HierarchyTree = observer(() => {
    // @ts-ignore
    const { sceneObjects, environment, spliceObject, scene, onUpdateInspector, badForceUpdateInspector, setControlsTarget, setEnvironmentByName } = useStores();

    let treeData = getTreeDataNodes(sceneObjects as THREE.Object3D[]);
    // const [treeData, setGData] = useState(getTreeDataNodes(sceneObjects as THREE.Object3D[]))

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        const selectedObject = scene.getObjectById(selectedKeys[0] as number);
        if (selectedObject)
            setControlsTarget(selectedObject);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => console.log('onCheck', checkedKeys, info);
    const onDragEnter: TreeProps['onDragEnter'] = (info) => console.log(info);;

    const onDrop: TreeProps['onDrop'] = (info) => {
        console.log(info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

        console.log("Dropped on:", dropKey, "\nThat dragged item:", dragKey, "\nPosition:", dropPos, "|", dropPosition);

        const loop = (
            data: TreeDataNode[],
            key: React.Key,
            callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback);
                }
            }
        };
        const data = [...treeData];

        // Find dragObject
        let dragObj: TreeDataNode;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj);
                const obj3D = scene.getObjectById(item.key as number);
                const dragObj3D = scene.getObjectById(dragObj.key as number);
                if (dragObj3D) {
                    obj3D?.add(dragObj3D);
                    if (sceneObjects.includes(dragObj3D)) {
                        const find = sceneObjects.findIndex(o => o.id == dragObj3D.id)
                        if (find != -1) spliceObject(find, 1);
                    }
                    else {
                        dragObj3D.removeFromParent();
                    }
                }
            });
        } else {
            let ar: TreeDataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            // dropPosition either 1 OR -1
            if (dropPosition === -1) {
                // Drop on the top of the drop node
                console.log("dropkey:", dropKey);
                const dragObj3D = scene.getObjectById(dragObj!.key as number);
                if (dragObj3D && sceneObjects.includes(dragObj3D)) {
                    const find = sceneObjects.findIndex(o => o.id == dragObj3D.id);
                    if (find != -1) spliceObject(find, 1);
                    spliceObject(i!, 0, dragObj3D);
                }
                else {
                    // dropped on ID
                    // const dropObj3D = scene.getObjectById(dropKey as number);
                    dragObj3D?.parent?.children.splice(i!, 0, dragObj3D!);

                }
                ar.splice(i!, 0, dragObj!);
                console.log(ar);
            } else {
                // Drop on the bottom of the drop node
                const dragObj3D = scene.getObjectById(dragObj!.key as number);
                if (dragObj3D && sceneObjects.includes(dragObj3D)) {
                    const find = sceneObjects.findIndex(o => o.id == dragObj3D.id);
                    if (find != -1) spliceObject(find, 1);
                    spliceObject(i! + 1, 0, dragObj3D);
                }
                else {
                    dragObj3D?.parent?.children.splice(i! + 1, 0, dragObj3D!);
                }
                ar.splice(i! + 1, 0, dragObj!);
            }
        }
        badForceUpdateInspector();
    };

    return (
        <div style={{ margin: "auto auto", width: "90%", height: "90%", alignContent: "top", overflow: "auto", background: "#696969" }}>
            <Tree
                defaultExpandAll
                showLine
                draggable
                blockNode
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
            />
        </div>
    )
})

export const SceneConfigs = observer(() => {
    const { environment, setEnvironmentByName, background, setbackground, scene, controlsObject3D } = useStores();
    const [backgroundEnabled, setBackgroundEnabled] = useState(false);

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

    useEffect(() => {
        console.log("position updated?")
    }, [controlsObject3D, controlsObject3D?.position])


    return (
        <div style={{ margin: "auto", width: "90%", alignContent: "top" }}>
            <Form>
                <SelectItem
                    label="Environment"
                    enabled={true}
                    defaultValue={environment}
                    labelInValue={true}
                    onChangeSelect={(select: { value: string, label: string }) => {
                        let v = undefined;
                        if (select.value != "undefined") v = select.value as Environments
                        setEnvironmentByName(v)
                    }}
                    options={environmentList()} />
                <ColorPickerItem
                    label="Background"
                    enabled={backgroundEnabled}
                    allowAlpha={false}
                    defaultValue={"001029"}
                    onChangeCheckbox={(e) => {
                        setBackgroundEnabled(e.target.checked);
                        setbackground(background[0], e.target.checked)
                    }}
                    onChangeColorPicker={(value: Color, hex: string) => {
                        scene.background = new THREE.Color(hex);
                    }}
                    onChangeCompleteColorPicker={(c) => {
                        const hex = c.toHexString().replace("#", "");
                        setbackground(new THREE.Color(parseInt(hex, 16)));
                    }} />
                {controlsObject3D && <Input3Item
                    listenerVariable={controlsObject3D.position}
                    x={controlsObject3D?.position.x}
                    y={controlsObject3D?.position.y}
                    z={controlsObject3D?.position.z}
                    onChangeX={(v) => {
                        if (v != null) controlsObject3D?.position.setX(v);
                    }}
                    onChangeY={(v) => {
                        if (v != null) controlsObject3D?.position.setY(v)
                    }}
                    onChangeZ={(v) => {
                        if (v != null) controlsObject3D?.position.setZ(v);
                    }} />}
            </Form>
        </div>
    )
})

export const ObjectElement: React.FC<{ object: THREE.Object3D }> = ({ object }) => {
    let hierarchy = object.children?.map((child) => <ObjectElement object={child} />);
    useMemo(() => {
        hierarchy = object.children?.map((child) => <ObjectElement object={child} />);
    }, [hierarchy, object, object.children])
    return (
        <div>
            {object.name}
        </div>
    )
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