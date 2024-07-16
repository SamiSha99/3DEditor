import { Dropdown, Button, message } from "antd";
import { useStores } from "@orb_App";
import { GenerateButton } from "@orb_tools/create/3DButton";
import * as LIGHT from "@orb_tools/create/light"
import * as GEOMETRY from "@orb_tools/create/primitive"

export const Create = () => {
    const { pushComponentToScene } = useStores();

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
                            onClick: () => pushComponentToScene(GenerateButton()),
                        },
                        {
                            type: "divider"
                        },
                        {
                            label: 'Geomtery',
                            key: 'Geomtery',
                            children: [
                                { label: 'Cube', key: 'Cube', onClick: () => pushComponentToScene(GEOMETRY.GenerateBox()) },
                                { label: 'Sphere', key: 'Sphere', onClick: () => pushComponentToScene(GEOMETRY.GenerateSphere()) },
                                { label: 'Cylinder', key: 'Cylinder', onClick: () => pushComponentToScene(GEOMETRY.GenerateCylinder()) },
                                { label: 'Cone', key: 'Cone', onClick: () => pushComponentToScene(GEOMETRY.GenerateCone()) },
                                { label: 'Pyramid', key: 'Pyramid', onClick: () => pushComponentToScene(GEOMETRY.GeneratePyramid()) },
                                { label: 'Plane', key: 'Plane', onClick: () => pushComponentToScene(GEOMETRY.GeneratePlane()) },
                                { label: 'Capsule', key: 'Capsule', onClick: () => pushComponentToScene(GEOMETRY.GenerateCapsule()) },
                                { label: 'Torus', key: 'Torus', onClick: () => pushComponentToScene(GEOMETRY.GenerateTorus()) }
                            ]
                        },
                        {
                            label: 'Light',
                            key: 'Light',
                            children: [
                                { label: 'Ambient Light', key: 'AmbientLight', onClick: () => pushComponentToScene(LIGHT.GenerateAmbientLight()) },
                                { label: 'Point Light', key: 'PointLight', onClick: () => pushComponentToScene(LIGHT.GeneratePointLight()) },
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