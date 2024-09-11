import { Scene, Object3D, Mesh, Vector3, Euler } from 'three';

type ItemArgs = {
    type: any,
    var: string,
}

type InspectorDataInterface = {
    items: ItemArgs[];
    inherit?: InspectorDataInterface;
}

type InspectorData = {
    type: any,
    data: InspectorDataInterface
}

export const Object3DData: InspectorDataInterface = {
    items: [
        { type: String, var: "name" },
        { type: Vector3, var: "position" },
        { type: Vector3, var: "scale" },
        { type: Euler, var: "rotation" },
    ]
}

export const MeshData: InspectorDataInterface = {
    items: [
        /** do stuff */
    ],
    inherit: Object3DData
}

export const InspectorData: InspectorData[] = [
    { type: Object3D, data: Object3DData },
    { type: Mesh, data: MeshData },
]

export default InspectorData;