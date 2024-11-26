import { useEditor } from "@orb_Editor";
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
    // boundElement?: Element,
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
// to-do this should not hard lock to as the bound and its position should be handled accordingly when canvas changes too
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
        <Draggable
            bounds="parent"
            handle=".handle"
            cancel=".noHandle"
            defaultPosition={defaultPosition}
            onDrag={(_e, _d) => {
                // console.log("event:", e, "\n", "data:", d)
            }}
        >
            <div ref={ref} style={{ position: "absolute", width: width, height: height, pointerEvents: "all" }}>
                <Card
                    classNames={{ header: "handle" }}
                    styles={{ header: { cursor: "all-scroll" }, title: { marginRight: 20 } }}
                    title={name}
                    extra={<Button className="noHandle" icon={<CloseOutlined />} danger type="text" onClick={close} />}
                    children={children}
                />
            </div>
        </Draggable>
    )
})