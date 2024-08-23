import { useStores } from "@orb_App";
import { Environments, environments } from "@orb_types";
import { Divider, Form, Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three"
import { ColorPickerItem, ItemNumber, ItemInput, ItemVector3, ItemEuler, SelectItem } from "./ui/controller/ControllerItems";
import { Color } from "antd/es/color-picker";

export const EditorInspector = observer(() => {
    const { controlsObject3D } = useStores();

    return (
        <div style={{ backgroundColor: "#212121", width: "20%" }}>
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
    const { environment, setEnvironmentByName, background, setbackground, scene } = useStores();
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


    return (
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} labelWrap>
            <SelectItem
                label="Environment"
                enabled={true}
                defaultValue={!environment ? "Custom" : environment}
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
                    setbackground(background, e.target.checked)
                }}
                onChangeColorPicker={(value: Color, hex: string) => {
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

    const translate = () => {
        (object as THREE.Mesh).geometry.translate(0, 0.1, 0);
        // setTimeout(translate, (1000));
    }
    // setTimeout(translate, (1000));

    return (
        <div style={{ margin: "auto", alignContent: "top" }}>
            {
                object &&
                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} colon={false} labelWrap>
                    <ItemInput object={object} variable="name" />
                    <ItemNumber object={object} variable="renderOrder" />
                    <ItemVector3 object={object} variable="position" />
                    <ItemEuler object={object} variable="rotation" isDegree />
                    <ItemVector3 object={object} variable="scale" />
                </Form>
            }

        </div>)
},)

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