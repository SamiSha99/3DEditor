import Icon, { DragOutlined, QqOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import { useCallback, useRef } from "react";

type DraggableButtonControllerInterface = {
    onStep?: (stepMultiplier: number) => void
}

export const DraggableButtonController: React.FC<DraggableButtonControllerInterface> = (
    { onStep }
) => {
    let stepPosition = -1;
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (ev: MouseEvent) => {
        if (!onStep) return;
        if (stepPosition == -1) return;
        if (stepPosition - ev.clientX >= 5) {
            onStep(1);
            stepPosition = (ev.clientX - ev.clientX % 5)
        }
        if (stepPosition - ev.clientX <= -5) {
            onStep(-1);
            stepPosition = (ev.clientX + ev.clientX % 5)
        }
    }

    const handleMouseDown = useCallback(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
    }, []);

    return (

        <Button
            size="small"
            ref={buttonRef}
            icon={<Icon component={undefined} />}
            style={{position:"absolute", left:0, background: "grey", width: "3px", cursor: "ew-resize"}}
            block
            onMouseDown={(e) => {
                e.preventDefault();
                stepPosition = (e.clientX);
                handleMouseDown();
            }}
        />

    )
}
