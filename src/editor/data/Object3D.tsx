import { ItemBoolean, ItemButton, ItemCollapse, ItemEuler, ItemGroup, ItemInput, ItemNumber, ItemTable, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';
import { EyeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Alert, message, Tooltip } from "antd";
import { useViewport } from "src/store/Viewport";
import { useEditor } from "@orb_Editor";
import { ItemQuaternion } from "@orb_UI/controller/items/ItemQuaternion";

interface Object3D {
    object: THREE.Object3D
}

export const InspectorObject3D = observer((props: Object3D) => {
    const { object } = props;
    const { scene } = useEditor();
    const { setTarget } = useViewport();

    const children = object.children.map((child, i) => {
        return {
            key: i,
            index: i,
            name: `${child.name}`,
            id: `${child.id}`,
            actions: <ItemButton size="small" buttonName={<EyeOutlined />} onClick={() => { setTarget(child) }} />
        }
    })

    return (
        <>
            <ItemCollapse label="Relations" collapsed>
                {
                    object.parent && !(object.parent instanceof THREE.Scene) &&
                    <ItemTable
                        label="Parent"
                        dataSource={[{ name: `${object.parent.name}`, id: `${object.parent.id}`, action: <ItemButton size="small" buttonName={<EyeOutlined />} onClick={() => { setTarget(object.parent) }} /> }]}
                        columns={[
                            { dataIndex: 'id', title: 'id', width: 0 },
                            { dataIndex: 'name', title: 'parent', width: "85%" },
                            { dataIndex: 'action', title: 'view', width: "15%" }
                        ]} />
                }
                {
                    object.parent == scene &&
                    <ItemGroup label="Parent" sizes={["100%"]}>
                        <Alert type="info" showIcon message={<>Object is attached to the current Scene. <Tooltip title={"All objects are placed inside a scene, the top of each object's parent is always attached to the Scene."} children={<QuestionCircleOutlined />} /></>} />
                    </ItemGroup>
                }
                {
                    object.parent == null &&
                    <ItemGroup label="Parent" sizes={["100%"]}>
                        <Alert type="warning" showIcon message={`Object isn't attached to the active Scene!`} />
                    </ItemGroup>
                }
                {
                    object.children.length > 0 &&
                    <ItemTable
                        label="Children"
                        dataSource={children}
                        columns={[
                            { dataIndex: 'id', title: 'id', width: 0 },
                            { dataIndex: 'name', title: 'child', width: "85%" },
                            { dataIndex: 'actions', title: 'view', width: "15%" }
                        ]} />
                }
                {
                    object.children.length == 0 &&
                    <ItemGroup label="Children" sizes={["100%"]}>
                        <Alert type="info" showIcon message={`No children attached to object "${object.name}".`} />
                    </ItemGroup>
                }

            </ItemCollapse >
            <ItemCollapse label={"Object3D"} alwaysOpen>
                <ItemInput object={{ type: object.constructor.name }} variable="type" labelInVariable readonly />
                <ItemInput object={object} variable="name" labelInVariable />
                <ItemNumber object={{ id: object.id }} variable="id" label="ID" readonly />
                <ItemGroup label="UUID" sizes={["66.666%", "33.334%"]}>
                    <ItemInput object={object} variable="uuid" readonly />
                    <ItemButton buttonName="Generate" onClick={() => { object.uuid = THREE.MathUtils.generateUUID() }} size='small' />
                </ItemGroup>
                <ItemVector3 object={object} variable="position" labelInVariable />
                <ItemEuler object={object} variable="rotation" isDegree labelInVariable tooltip="Syncs with Quaternion." />
                <ItemVector3 object={object} variable="scale" labelInVariable />
                <ItemQuaternion object={object} variable="quaternion" labelInVariable limit={{ x: { min: -1, max: 1 }, y: { min: -1, max: 1 }, z: { min: -1, max: 1 }, w: { min: -1, max: 1 } }} tooltip="Syncs with Rotation, clamped between [-1, 1]." />
                <ItemBoolean object={object} variable="visible" labelInVariable />
                <ItemNumber object={object} variable="renderOrder" label="Order" />
            </ItemCollapse>
        </>
    );
})

export const ChildObject3D = observer((props: Object3D) => {
    const { object } = props;
    switch (object.constructor) {
        case THREE.Mesh: return <Mesh object={object as THREE.Mesh} />
        default: return <>{object.constructor.name}</>;
    }
})

interface Mesh {
    object: THREE.Mesh
}

export const Mesh = observer((props: Mesh) => {
    const { object } = props;
    return (
        <>
            <ItemGroup label="Geometry" sizes={["85%", "15%"]}>
                <ItemInput object={{ geometry: object.geometry.constructor.name.replace("_", "") }} variable="geometry" readonly />
                <ItemButton buttonName={<EyeOutlined />} onClick={() => { message.info("Implement viewing geometry tab!") }} />
            </ItemGroup>
            <ItemGroup label="Material" sizes={["85%", "15%"]}>
                <ItemInput object={{ material: object.material.constructor.name.replace("_", "") }} variable="material" readonly />
                <ItemButton buttonName={<EyeOutlined />} onClick={() => { message.info("Implement viewing material tab!") }} />
            </ItemGroup>
        </>
    )
})