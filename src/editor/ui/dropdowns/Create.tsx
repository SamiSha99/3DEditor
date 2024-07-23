import { Dropdown, Button, message } from "antd";
import { useStores } from "@orb_App";
import { GenerateButton } from "@orb_tools/create/3DButton";
import * as LIGHT from "@orb_tools/create/light"
import * as GEOMETRY from "@orb_tools/create/primitive"

export const Create = () => {
    const { addObject } = useStores();

    return (
        <>
            <Dropdown
                children={<Button children={'Create'} />}
                trigger={['click']}
                menu={{
                    items: [
                        {
                            label: 'Button',
                            key: 'Button',
                            onClick: () => addObject(GenerateButton()),
                        },
                        {
                            type: "divider"
                        },
                        {
                            label: 'Geomtery',
                            key: 'Geomtery',
                            children: [
                                { label: 'Cube', key: 'Cube', onClick: () => addObject(GEOMETRY.GenerateBox()) },
                                { label: 'Sphere', key: 'Sphere', onClick: () => addObject(GEOMETRY.GenerateSphere()) },
                                { label: 'Cylinder', key: 'Cylinder', onClick: () => addObject(GEOMETRY.GenerateCylinder()) },
                                { label: 'Cone', key: 'Cone', onClick: () => addObject(GEOMETRY.GenerateCone()) },
                                { label: 'Pyramid', key: 'Pyramid', onClick: () => addObject(GEOMETRY.GeneratePyramid()) },
                                { label: 'Plane', key: 'Plane', onClick: () => addObject(GEOMETRY.GeneratePlane()) },
                                { label: 'Capsule', key: 'Capsule', onClick: () => addObject(GEOMETRY.GenerateCapsule()) },
                                { label: 'Torus', key: 'Torus', onClick: () => addObject(GEOMETRY.GenerateTorus()) }
                            ]
                        },
                        {
                            label: 'Light',
                            key: 'Light',
                            children: [
                                { label: 'Ambient Light', key: 'AmbientLight', onClick: () => addObject(LIGHT.GenerateAmbientLight()) },
                                { label: 'Point Light', key: 'PointLight', onClick: () => addObject(LIGHT.GeneratePointLight()) },
                            ]
                        },
                    ],
                    onClick: (e) => {
                        message.success('Created ' + (e.domEvent.target as HTMLElement).innerText)
                    }
                }}
            />
        </>
    )
}

export default Create