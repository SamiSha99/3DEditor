import { DownOutlined } from "@ant-design/icons";
import { useStores } from "@orb_App";
import { Tree, TreeDataNode, TreeProps } from "antd";
import { observer } from "mobx-react-lite";
import { Children, useMemo } from "react";
import * as THREE from "three"


export const EditorInspector = observer(() => {
    // @ts-ignore
    const { sceneObjects, scene, onUpdateInspector, badForceUpdateInspector, setControlsTarget } = useStores();
    let treeData = getTreeDataNodes(sceneObjects as THREE.Object3D[]);
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

        console.log("Dropped on:", dropKey, "\nThat dragged item:", dragKey, "\nPosition:", dropPos, "|", dropPosition)

        const draggedObject = scene.getObjectById(dragKey as number);
        if (!draggedObject) return;

        // The fake scene in this tree is defined as -1, if we drop it on top of it, then we 
        if (dropKey == -1) {
            // Already defined, 
            if (sceneObjects?.includes(draggedObject)) return;
            draggedObject?.removeFromParent();
            sceneObjects?.push(draggedObject);

        }
        else {
            const otherObject = scene.getObjectById(dropKey as number);
            console.log(otherObject)

            if (draggedObject) {
                if (draggedObject.parent instanceof THREE.Scene) {
                    const indx = sceneObjects?.findIndex(i => i.id == draggedObject.id) || -1;
                    if (indx != -1)
                        sceneObjects?.splice(indx, 1);
                }
                otherObject?.attach(draggedObject);
            }
        }

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
        const data: TreeDataNode[] = [...treeData as TreeDataNode[]];

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
                console.log("loop res:", item)
            });
        } else {
            let ar: TreeDataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                // Drop on the top of the drop node
                ar.splice(i!, 0, dragObj!);
            } else {
                // Drop on the bottom of the drop node
                ar.splice(i! + 1, 0, dragObj!);
            }
        }
        badForceUpdateInspector();
    };

    useMemo(() => {

    }, [sceneObjects, scene.children])

    return (
        <div style={{ backgroundColor: "red", flex: "20%" }}>
            <Tree
                defaultExpandAll
                showLine
                draggable
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
            />
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

// Want to avoid showing the "Scene" node, so the first function is jus iterating the root objects before going deeper on each one.
function getTreeDataNodes(sceneObjects: THREE.Object3D[]) {
    let tree: TreeDataNode[] = [];
    sceneObjects.forEach(o => {
        const node = createTreeDataNode(o);
        if (node)
            tree.push(node);
    });
    console.log(tree);
    return [{ title: "Scene", key: -1, children: tree, selectable: false }] as TreeDataNode[];
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