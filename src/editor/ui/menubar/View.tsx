import { Dropdown, Button } from "antd"
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Check, X } from "src/assets/icons";
import { useViewport } from "src/store/Viewport";

export const View = observer(() => {
    const {
        setGrid, gridEnabled,
        setFPS, fpsEnabled,
        setViewHelper, viewHelperEnabled,
        setBoundingBox, boundingBoxEnabled
    } = useViewport();

    const [open, setOpen] = useState(false);
    const checkedIcon = (b: boolean) => b ? <Check /> : <X />;

    return (
        <>
            <Dropdown
                open={open}
                trigger={["click"]}
                children={<Button children={"View"} />}
                onOpenChange={() => { setOpen(true) }}
                menu={{
                    items: [
                        {
                            key: "0",
                            label: "Grid",
                            icon: checkedIcon(gridEnabled),
                            onClick: () => { setGrid(!gridEnabled) }
                        },
                        {
                            key: "1",
                            label: "FPS",
                            icon: checkedIcon(fpsEnabled),
                            onClick: () => { setFPS(!fpsEnabled) }
                        },
                        {
                            key: "2",
                            label: "Helper",
                            icon: checkedIcon(viewHelperEnabled),
                            onClick: () => { setViewHelper(!viewHelperEnabled) },
                        },
                        {
                            key: "3",
                            label: "Bounding Box",
                            icon: checkedIcon(boundingBoxEnabled),
                            onClick: () => { setBoundingBox(!boundingBoxEnabled) }
                        }
                    ],
                    onClick: () => { setOpen(true) },
                    onMouseLeave: () => { setOpen(false) }

                }} />
        </>
    )
})
export default View
