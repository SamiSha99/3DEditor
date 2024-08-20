import { useStores } from "@orb_App";
import { observer } from "mobx-react-lite";
import { Button, Card, ConfigProvider } from "antd";
import { PanelsThemeConfig } from "@orb_UI/antd/ThemeConfigs";
import Draggable, { DraggableBounds } from "react-draggable";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

export const ActivePanels = observer(() => {
    const { activePanels } = useStores();

    return (
        <ConfigProvider theme={PanelsThemeConfig}>
            {activePanels.map(child => child.panel)}
        </ConfigProvider>
    )
})

type DraggablePanelInterface = {
    name: string
    identifier: string
    width?: number,
    height?: number,
    startingPositionNormalized?: { x: number, y: number }, // value is clamped between 0 - 1 for top/left - bottom/right
    children?: React.ReactNode
}

const getCanvasBounds = (width?: number, height?: number) => {
    const c = document.getElementsByTagName("canvas")[0];
    const bounds = c.getBoundingClientRect();
    const draggableBounds = { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom }
    if (width) draggableBounds.right -= width;
    if (height) draggableBounds.bottom -= height;
    return draggableBounds;
}

export const DraggablePanel: React.FC<DraggablePanelInterface> = observer(({ name, identifier, width, height, startingPositionNormalized, children }) => {
    const { removeActivePanel } = useStores();
    const ref = useRef<HTMLDivElement>(null); 
    const w = width ? width : ref.current?.offsetWidth;
    const h = height ? height : ref.current?.offsetHeight;

    const [bounds, setBounds] = useState<DraggableBounds>(getCanvasBounds(w, h));


    useEffect(() => {
        setBounds(getCanvasBounds(w, h));
    }, [ref.current]);

    window.onresize = () => {
        setBounds(getCanvasBounds(w, h));
    }

    const startPos = startingPositionNormalized ? startingPositionNormalized : { x: 0.05, y: 0.2 };

    return (
        <div ref={ref} style={{ position: "absolute", width: width, height: height }}>
             <Draggable bounds={bounds} handle=".handle" defaultPosition={{ x: (bounds.right - bounds.left) * startPos.x, y: (bounds.bottom - bounds.top) * startPos.y }}>
                <Card
                    title={
                        <div className="handle" style={{ cursor: "all-scroll" }}>{name}</div>
                    }
                    extra={
                        <Button style={{ margin: "auto" }} icon={<CloseOutlined />} danger type="text" onClick={() => {
                            removeActivePanel(identifier);
                        }} />
                    }
                    children={children}
                />
            </Draggable>
        </div>
    )
})