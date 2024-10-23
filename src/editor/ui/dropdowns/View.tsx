import { useEditor } from "@orb_App"
import { Dropdown, Button, Checkbox } from "antd"
import { observer } from "mobx-react-lite";
export const View = observer(() => {
    const { setGrid, grid } = useEditor();

    return (
        <>
            <Dropdown trigger={["click"]} children={<Button children={"View"} />}
                menu={{
                    items: [
                        {
                            key: "0",
                            label: "Grid",
                            // TO-DO: Doesn't update!
                            icon: <Checkbox defaultChecked={grid.enabled} onClick={(e) => e.stopPropagation()} onChange={(e) => { e.stopPropagation(), setGrid(e.target.checked) }} />,
                            onClick: () => { setGrid(!grid.enabled) }
                        }
                    ]
                }} />
        </>
    )
})
export default View
