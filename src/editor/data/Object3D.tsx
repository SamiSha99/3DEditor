import { ItemBoolean, ItemButton, ItemCollapse, ItemEuler, ItemGroup, ItemInput, ItemNumber, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import * as THREE from 'three';
import { EyeOutlined } from "@ant-design/icons";
import { Alert, message } from "antd";
import { useViewport } from "src/store/Viewport";

export const InspectorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    const { setTarget } = useViewport();

    const children = object.children.map((child) => {
        return {
            info: <ItemInput
                object={{ o: `${child.name}::${child.id}` }}
                variable="o"
                readonly />,
            action: <ItemButton size="small" buttonName={<EyeOutlined />} onClick={() => { setTarget(child) }} />
        }
    })

    return (
        <>
            <ItemCollapse label="Relationships">
                <ItemGroup label="Parent" sizes={["85%", "15%"]}>
                    <ItemInput
                        object={{
                            o: (object.parent instanceof THREE.Scene || !object.parent) ?
                                "undefined" :
                                (object.parent.name + "::" + object.parent.id)
                        }}
                        variable="o"
                        readonly />
                    <ItemButton size="small" buttonName={<EyeOutlined />} onClick={() => { setTarget(object.parent) }} disabled={object.parent instanceof THREE.Scene || !object.parent} />
                </ItemGroup>
                {
                    object.children.length > 0 &&
                    <ItemGroup label="Children" sizes={["85%", "15%"]}>
                        {children.map((child) => {
                            const info = child.info
                            const action = child.action
                            return (
                                <>
                                    {info}
                                    {action}
                                </>
                            )
                        })}
                    </ItemGroup>
                }
                {
                    object.children.length == 0 &&
                    <ItemGroup label="Children" sizes={["100%"]}>
                        <Alert type="info" showIcon message={`No children attached to object "${object.name}".`} />
                    </ItemGroup>
                }

            </ItemCollapse>
            <ItemCollapse label={"Object3D"} alwaysOpen>
                <ItemInput object={object} variable="name" labelInVariable />
                <ItemNumber object={{ id: object.id }} variable="id" label="ID" readonly />
                <ItemGroup label="UUID" sizes={["85%", "15%"]}>
                    <ItemInput object={object} variable="uuid" readonly />
                    <ItemButton buttonName="Regenerate" onClick={() => { object.uuid = THREE.MathUtils.generateUUID() }} size='small' />
                </ItemGroup>
                <ItemVector3 object={object} variable="position" labelInVariable />
                <ItemEuler object={object} variable="rotation" isDegree labelInVariable />
                <ItemVector3 object={object} variable="scale" labelInVariable />
                <ItemBoolean object={object} variable="visible" labelInVariable />
                <ItemNumber object={object} variable="renderOrder" label="Order" />
            </ItemCollapse>
        </>
    );
})

export const ChildObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    switch (object.constructor) {
        case THREE.Mesh: return <Mesh object={object as THREE.Mesh} />
        default: return <>{object.constructor.name}</>;
    }
})


export const Mesh: React.FC<{ object: THREE.Mesh }> = observer(({ object }) => {
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