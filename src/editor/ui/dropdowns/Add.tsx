import { Dropdown, Button, message } from "antd";
import { useStores } from "@orb_App";
import { Button3D } from "@orb_tools/create/Button3D";
import { Object3D } from "three";
import * as LIGHT from "@orb_tools/create/Light"
import * as GEOMETRY from "@orb_tools/create/Primitive"

export const Add = () => {
    const { addObject, addHelper } = useStores();

    const onCreate = (object: Object3D, helper?: Object3D) => {
        object && addObject(object);
        helper && addHelper(helper);
    }
    return (
        <Dropdown
            trigger={["click"]}
            children={<Button children={"Add"} />}
            menu={{
                items: [
                    {
                        label: 'Button',
                        key: 'Button',
                        onClick: () => onCreate(Button3D()),
                    },
                    {
                        type: "divider"
                    },
                    {
                        label: 'Geomtery',
                        key: 'Geomtery',
                        children: [
                            { label: 'Cube', key: 'Cube', onClick: () => onCreate(GEOMETRY.Box()) },
                            { label: 'Sphere', key: 'Sphere', onClick: () => onCreate(GEOMETRY.Sphere()) },
                            { label: 'Cylinder', key: 'Cylinder', onClick: () => onCreate(GEOMETRY.Cylinder()) },
                            { label: 'Cone', key: 'Cone', onClick: () => onCreate(GEOMETRY.Cone()) },
                            { label: 'Pyramid', key: 'Pyramid', onClick: () => onCreate(GEOMETRY.Pyramid()) },
                            { label: 'Plane', key: 'Plane', onClick: () => onCreate(GEOMETRY.Plane()) },
                            { label: 'Capsule', key: 'Capsule', onClick: () => onCreate(GEOMETRY.Capsule()) },
                            { label: 'Icosahedron', key: 'Icosahedron', onClick: () => onCreate(GEOMETRY.Icosahedron()) },
                            { label: 'Torus', key: 'Torus', onClick: () => onCreate(GEOMETRY.Torus()) }
                        ]
                    },
                    {
                        label: 'Light',
                        key: 'Light',
                        children: [
                            { label: 'Ambient Light', key: 'AmbientLight', onClick: () => { const o = LIGHT.AmbientLight(); onCreate(o.object, o.helper) } },
                            { label: 'Point Light', key: 'PointLight', onClick: () => { const o = LIGHT.PointLight(); onCreate(o.object, o.helper) } },
                            { label: 'Hemisphere Light', key: 'HemisphereLight', onClick: () => { const o = LIGHT.HemisphereLight(); onCreate(o.object, o.helper) } },
                            { label: 'Spot Light', key: 'SpotLight', onClick: () => { const o = LIGHT.SpotLight(); onCreate(o.object, o.helper) } },
                        ]
                    },
                ],
                onClick: (e) => {
                    message.success('Created ' + (e.domEvent.target as HTMLElement).innerText)
                }
            }}
            
        />
    )
}

export default Add