import * as THREE from 'three';
import { ItemBoolean, ItemButton, ItemCollapse, ItemColor, ItemEuler, ItemGroup, ItemInput, ItemNumber, ItemRow, ItemSelect, ItemTable, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { EyeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Alert, message, Tooltip } from "antd";
import { useViewport } from "src/store/Viewport";
import { useEditor } from "@orb_Editor";
import { ItemQuaternion } from "@orb_UI/controller/items/ItemQuaternion";
import { LIMIT_01, LIMIT_BIPOLAR } from "@orb_UI/controller/items/Item";

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
                        layout="stacked"
                        dataSource={[{ key: object.parent.id, name: `${object.parent.name}`, id: `${object.parent.id}`, action: <ItemButton size="small" buttonName={<EyeOutlined />} onClick={() => { setTarget(object.parent) }} /> }]}
                        columns={[
                            { dataIndex: 'id', title: 'id', width: 0 },
                            { dataIndex: 'name', title: 'parent', width: "85%" },
                            { dataIndex: 'action', title: 'view', width: "15%" }
                        ]} />
                }
                {
                    object.parent && object.parent instanceof THREE.Scene &&
                    <ItemRow label="Parent" layout="stacked">
                        {
                            object.parent == scene &&
                            <Alert type="info" showIcon message={<>Attached to Scene. <Tooltip title={"All objects are placed inside a scene, the top of each object's parent is always attached to the Scene."} children={<QuestionCircleOutlined />} /></>} />
                        }
                        {
                            object.parent == null &&
                            <Alert type="warning" showIcon message={`This object isn't attached to the active Scene, it will not be visible!`} />
                        }
                    </ItemRow>
                }
                {
                    object.children.length > 0 &&
                    <ItemTable
                        label="Children"
                        layout="stacked"
                        dataSource={children}
                        columns={[
                            { dataIndex: 'id', title: 'id', width: 0 },
                            { dataIndex: 'name', title: 'child', width: "85%" },
                            { dataIndex: 'actions', title: 'view', width: "15%" }
                        ]} />
                }
                {
                    object.children.length == 0 &&
                    <ItemRow label="Children" layout="stacked">
                        <Alert type="info" showIcon message={`No children attached to object "${object.name}".`} />
                    </ItemRow>
                }

            </ItemCollapse >
            <ChildObject3D object={object} />
            <ItemCollapse label={"Object3D"}>
                <ItemInput object={{ type: object.constructor.name }} variable="type" labelInVariable readonly />
                <ItemInput object={object} variable="name" labelInVariable />
                <ItemNumber object={{ id: object.id }} variable="id" label="ID" readonly />
                <ItemGroup label="UUID" sizes={["75%", "25%"]} tooltip={"Universally unique identifier"}>
                    <ItemInput object={object} variable="uuid" readonly />
                    <ItemButton buttonName="New UUID" onClick={() => { object.uuid = THREE.MathUtils.generateUUID() }} size='small' />
                </ItemGroup>
                <ItemVector3 object={object} variable="position" labelInVariable />
                <ItemEuler object={object} variable="rotation" isDegree labelInVariable tooltip="Syncs with Quaternion. Numbers are shown in Degrees." />
                <ItemVector3 object={object} variable="scale" labelInVariable />
                <ItemQuaternion object={object} variable="quaternion" labelInVariable limit={{ x: LIMIT_BIPOLAR, y: LIMIT_BIPOLAR, z: LIMIT_BIPOLAR, w: LIMIT_BIPOLAR }} tooltip="Syncs with Rotation, clamped between [-1, 1]." />
                <ItemBoolean object={object} variable="visible" labelInVariable />
                <ItemNumber object={object} variable="renderOrder" label="Order" />
            </ItemCollapse>
        </>
    );
})

export const ChildObject3D = observer((props: Object3D) => {
    const { object } = props;
    if (object.constructor == THREE.Group ||
        object.constructor.name == "_Object3D"
    ) return <></>
    return <ItemCollapse label={object.constructor.name}>
        {(() => {
            switch (object.constructor) {
                case THREE.Mesh: return <Mesh object={object as THREE.Mesh} />
                case THREE.PointLight: return <PointLight object={object as THREE.PointLight} />;
                case THREE.HemisphereLight: return <HemisphereLight object={object as THREE.HemisphereLight} />;
                case THREE.SpotLight: return <SpotLight object={object as THREE.SpotLight} />;
                case THREE.AmbientLight: return <AmbientLight object={object as THREE.AmbientLight} />;
                case THREE.DirectionalLight: return <DirectionalLight object={object as THREE.DirectionalLight} />;
                case THREE.SkinnedMesh: return <InspectorSkinnedMesh object={object as THREE.SkinnedMesh} />;
                default: return <Alert message={object.constructor.name + " is not defined!"} type="warning" />;
            }
        })()}
    </ItemCollapse>
})

export const Mesh = observer((props: { object: THREE.Mesh }) => {
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
            <ItemBoolean object={object} variable="castShadow" labelInVariable />
            <ItemBoolean object={object} variable="receiveShadow" labelInVariable />
        </>
    )
})

export const PointLight = observer((props: { object: THREE.PointLight }) => {
    const { object } = props;
    const power = { value: object.intensity * 4 * Math.PI };

    return (
        <>
            <ItemNumber object={object} variable="intensity" labelInVariable onChange={(v) => power.value = v * 4 * Math.PI} />
            <ItemNumber
                object={power}
                variable="value"
                label="Power"
                onChange={(v) => { object.intensity = v / (4 * Math.PI) }}
            />
            <ItemColor object={object} variable="color" labelInVariable />
            <ItemNumber object={object} variable="distance" labelInVariable />
            <ItemBoolean object={object} variable="castShadow" labelInVariable />
            <ItemNumber object={object} variable="decay" labelInVariable />
        </>
    )
})

export const HemisphereLight = observer((props: { object: THREE.HemisphereLight }) => {
    const { object } = props;

    return (
        <>
            <ItemColor object={object} variable="color" label="Sky Color" />
            <ItemColor object={object} variable="groundColor" labelInVariable />
            <ItemNumber object={object} variable="intensity" labelInVariable />
        </>
    )
})

export const SpotLight = observer((props: { object: THREE.SpotLight }) => {
    const { object } = props;

    return (
        <>
            <ItemColor object={object} variable="color" labelInVariable />
            <ItemNumber object={object} variable="intensity" labelInVariable />
            <ItemNumber object={object} variable="distance" labelInVariable />
            <ItemNumber object={object} variable="angle" labelInVariable />
            <ItemNumber object={object} variable="penumbra" labelInVariable limit={LIMIT_01} />
            <ItemNumber object={object} variable="decay" labelInVariable limit={LIMIT_01} />
            <ItemVector3 object={object.target} variable="position" label="Target" labelInVariable />
        </>
    )
})

export const AmbientLight = observer((props: { object: THREE.AmbientLight }) => {
    const { object } = props;
    const power = { value: object.intensity * 4 * Math.PI };
    return (
        <>
            <ItemColor object={object} variable="color" labelInVariable />
            <ItemNumber object={object} variable="intensity" labelInVariable />
            <ItemNumber
                object={power}
                variable="value"
                label="Power"
                onChange={(v) => { object.intensity = v / (4 * Math.PI) }}
            />
            <ItemColor object={object} variable="color" labelInVariable />
            <ItemBoolean object={object} variable="castShadow" labelInVariable />
        </>
    )
})

export const DirectionalLight = observer((props: { object: THREE.DirectionalLight }) => {
    const { object } = props;
    const power = { value: object.intensity * 4 * Math.PI };
    return (
        <>
            <ItemColor object={object} variable="color" labelInVariable />
            <ItemNumber object={object} variable="intensity" labelInVariable />
            <ItemNumber
                object={power}
                variable="value"
                label="Power"
                onChange={(v) => { object.intensity = v / (4 * Math.PI) }}
            />
            <ItemColor object={object} variable="color" labelInVariable />
            <ItemBoolean object={object} variable="castShadow" labelInVariable />
        </>
    )
})

export const InspectorSkinnedMesh = observer((props: { object: THREE.SkinnedMesh }) => {
    const { object } = props;

    const BindModeSelect = [
        { value: THREE.AttachedBindMode, label: "attached" },
        { value: THREE.DetachedBindMode, label: "dettached" }
    ]

    return (
        <>
            <ItemSelect
                object={{ BindMode: BindModeSelect }}
                variable="BindMode"
                labelInVariable
                defaultValue={object.bindMode}
                tooltip={`"attached" means the skinned mesh shares the same world space as the skeleton.
                This is not true when using "dettached" which is useful when sharing a skeleton across multiple skinned meshes.`} />
        </>
    )
})