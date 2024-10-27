import { Dropdown, Button, Checkbox } from "antd"
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
export const View = observer(() => {
    const { setGrid, gridEnabled, setFPS, fpsEnabled } = useViewport();

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
                        }
                    ]
                }} />
        </>
    )
})
export default View
