import { Dropdown, Button, Checkbox } from "antd"
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
export const View = observer(() => {
    const { setGrid, gridEnabled } = useViewport();
    console.log("refreshed...", gridEnabled)
    return (
        <>
            <Dropdown trigger={["click"]} children={<Button children={"View"} />}
                menu={{
                    items: [
                        {
                            key: "0",
                            label: "Grid Helper",
                            onClick: () => { setGrid(!gridEnabled) }
                        }
                    ]
                }} />
        </>
    )
})
export default View
