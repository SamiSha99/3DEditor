import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useStores } from "@orb_App";
import { ItemBoolean, ItemEuler, ItemInput, ItemNumber, ItemVector3 } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from 'three';

export const InspectorObject3D: React.FC<{ object: THREE.Object3D }> = observer(({ object }) => {
    const { controlsObject3D } = useStores();
    const [object3d, setobject3D] = useState(object);

    return (
        <>
            <ItemInput object={object} variable="name" labelInVariable />
            <ItemNumber object={object} variable="renderOrder" labelInVariable />
            <ItemBoolean object={object} variable="visible" icons={{ on: <EyeOutlined />, off: <EyeInvisibleOutlined /> }} labelInVariable />
            <ItemVector3 object={object} variable="position" labelInVariable />
            <ItemEuler object={object} variable="rotation" isDegree labelInVariable />
            <ItemVector3 object={object} variable="scale" labelInVariable />
        </>
    );
})