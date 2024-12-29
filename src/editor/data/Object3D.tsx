import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { ItemBoolean, ItemCollapse, ItemEuler, ItemInput, ItemNumber, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import * as THREE from 'three';
import { GeometrySetter } from "./Geometry";
import { MaterialSetter } from "./Material";

export const InspectorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    const { target } = useViewport();
    return (
        <>
            {
                target && target.constructor != THREE.Object3D &&
                <ItemCollapse label={target.constructor.name}>
                    <ChildObject3D object={target} />
                </ItemCollapse>
            }
            <ItemCollapse label={"Object3D"}>
                <ItemInput object={object} variable="name" labelInVariable />
                <ItemNumber object={{ id: object.id }} variable="id" label="ID" readonly />
                <ItemVector3 object={object} variable="position" labelInVariable />
                <ItemEuler object={object} variable="rotation" isDegree labelInVariable />
                <ItemVector3 object={object} variable="scale" labelInVariable />
                <ItemBoolean object={object} variable="visible" /*icons={{ on: <EyeOutlined />, off: <EyeInvisibleOutlined /> }}*/ labelInVariable />
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
            <GeometrySetter geometry={object.geometry} allowNullType={true} />
            <MaterialSetter material={object.material} allowNullType={true} />
        </>
    )
})