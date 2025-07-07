
import { Dropdown, Button } from "antd"
import { observer } from "mobx-react-lite";
import { Check, X } from "src/assets/icons";
import { useViewport } from "src/store/Viewport";
import { MenuButtonProps } from "@orb_types";
import { useState } from "react";

export const View = observer((props: MenuButtonProps) => {
    const {
        setGrid, gridEnabled,
        setFPS, fpsEnabled,
        setViewHelper, viewHelperEnabled,
        setBoundingBox, boundingBoxEnabled
    } = useViewport();
    const checkedIcon = (b: boolean) => b ? <Check /> : <X />;
    const { onclick } = props;

    return (
        <>
            <Dropdown
                trigger={["click"]}
                children={<Button children={"View"} />}
                onOpenChange={(b) => { onclick(b) }}
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
                            label: "Helper",
                            icon: checkedIcon(viewHelperEnabled),
                            onClick: () => { setViewHelper(!viewHelperEnabled) },
                        },
                        {
                            key: "2",
                            label: "Bounding Box",
                            icon: checkedIcon(boundingBoxEnabled),
                            onClick: () => { setBoundingBox(!boundingBoxEnabled) }
                        },
                        {
                            type: "divider"
                        },
                        {
                            key: "3",
                            label: "FPS",
                            disabled: true,
                            icon: checkedIcon(fpsEnabled),
                            onClick: () => { setFPS(!fpsEnabled) }
                        },
                    ]
                }}
            />
        </>
    )
})
export default View
