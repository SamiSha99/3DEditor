import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useEditor } from "@orb_Editor";
import { ItemBoolean, ItemCollapse, ItemEuler, ItemInput, ItemNumber, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import * as THREE from 'three';

export const InspectorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    const { target } = useViewport();
    return (
        <>
            <ItemCollapse label={"Object3D"}>
                <ItemInput object={object} variable="name" labelInVariable />
                <ItemNumber object={{ id: object.id }} variable="id" label="ID" readonly />
                <ItemVector3 object={object} variable="position" labelInVariable />
                <ItemEuler object={object} variable="rotation" isDegree labelInVariable />
                <ItemVector3 object={object} variable="scale" labelInVariable />
                <ItemBoolean object={object} variable="visible" icons={{ on: <EyeOutlined />, off: <EyeInvisibleOutlined /> }} labelInVariable />
                <ItemNumber object={object} variable="renderOrder" label="Order" />
            </ItemCollapse>
            {
                target && target.constructor != THREE.Object3D &&
                <ItemCollapse label={target.constructor.name}>
                    <ChildObject3D object={target} />
                </ItemCollapse>
            }
        </>
    );
})

export const ChildObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    switch (object.constructor) {
        default: return <>{object.constructor.name}</>;
    }
})


