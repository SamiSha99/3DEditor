import { useEditor } from "@orb_App";
import { observer } from "mobx-react-lite";
import { Button, Card } from "antd";
import Draggable, { DraggableBounds } from "react-draggable";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

type DraggablePanelInterface = {
    name: string
    identifier: string
    width?: number,
    height?: number,
    startingPositionNormalized?: { x: number, y: number }, // value is clamped between 0 - 1 for top/left - bottom/right
    children?: React.ReactNode,
    onClose?: () => void
}

const getCanvasBounds = (width?: number, height?: number) => {
    const c = document.getElementsByTagName("canvas")[0];
    const bounds = c.getBoundingClientRect();
    const draggableBounds = { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom }
    if (width) draggableBounds.right -= width;
    if (height) draggableBounds.bottom -= height;
    return draggableBounds;
}

export const DraggablePanel: React.FC<DraggablePanelInterface> = observer(({ name, identifier, width, height, startingPositionNormalized, children, onClose }) => {
    const { removeActivePanel } = useEditor();
    const ref = useRef<HTMLDivElement>(null);
    const w = width ? width : ref.current?.offsetWidth;
    const h = height ? height : ref.current?.offsetHeight;

    const [bounds, setBounds] = useState<DraggableBounds>(getCanvasBounds(w, h));

    const close = () => {
        removeActivePanel(identifier);
        onClose && onClose()
    }
    onresize = () => setBounds(getCanvasBounds(w, h));
    useEffect(() => setBounds(getCanvasBounds(w, h)), [ref.current]);


    const startPos = startingPositionNormalized ? startingPositionNormalized : { x: 0.05, y: 0.2 };
    const boundsWidth = (bounds.right ? bounds.right : window.screen.width) - (bounds.left ? bounds.left : 0);
    const boundsHeight = (bounds.bottom ? bounds.bottom : window.screen.height) - (bounds.top ? bounds.top : 0);
    const defaultPosition = { x: boundsWidth * startPos.x, y: boundsHeight * startPos.y };

    return (
        <div ref={ref} style={{ position: "absolute", width: width, height: height }}>
            <Draggable bounds={bounds} handle=".handle" cancel=".noHandle" defaultPosition={defaultPosition}>
                <Card
                    classNames={{ header: "handle" }}
                    styles={{ header: { cursor: "all-scroll" }, title: { marginRight: 20 } }}
                    title={name}
                    extra={<Button className="noHandle" icon={<CloseOutlined />} danger type="text" onClick={close} />}
                    children={children}
                />
            </Draggable>
        </div>
    )
})