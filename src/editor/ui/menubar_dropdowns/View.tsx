import { Dropdown, Button } from "antd"
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
export const View = observer(() => {
    const {
        setGrid, gridEnabled,
        setFPS, fpsEnabled,
        setViewHelper, viewHelperEnabled,
        setBoundingBox, boundingBoxEnabled
    } = useViewport();

    return (
        <>
            <Dropdown trigger={["click"]} children={<Button children={"View"} />}
                menu={{
                    items: [
                        {
                            key: "0",
                            label: !gridEnabled ? "Show Grid" : "Hide Grid",
                            onClick: () => { setGrid(!gridEnabled) }
                        },
                        {
                            key: "1",
                            label: !fpsEnabled ? "Show FPS" : "Hide FPS",
                            onClick: () => { setFPS(!fpsEnabled) }
                        },
                        {
                            key: "2",
                            label: !viewHelperEnabled ? "Show View Helper" : "Hide View Helper",
                            onClick: () => { setViewHelper(!viewHelperEnabled) }
                        },
                        {
                            key: "3",
                            label: !boundingBoxEnabled ? "Show Bounding Box" : "Hide Bounding Box",
                            onClick: () => { setBoundingBox(!boundingBoxEnabled) }
                        }
                    ]
                }} />
        </>
    )
})
export default View
