import Icon from "@ant-design/icons";
import { DRAGGABLE_CONTROLLER_WIDTH } from "@orb_UI/controller/items/Item";
import { Button, ButtonProps } from "antd";
import { useRef } from "react";

const DEFAULT_TRIGGER_SIZE = 10;
const DEFAULT_STEP = 1;

const buttonProps: ButtonProps = {
    tabIndex: -1,
    size: "small",
    // a hack to remove all inner padding of the button by making an empty icon
    icon: <Icon component={undefined} />,
    style: { left: 0, background: "grey", width: DRAGGABLE_CONTROLLER_WIDTH, cursor: "ns-resize" },
    block: true
}

type DraggableButtonControllerInterface = {
    step?: number,
    triggerSize?: number
    onStep?: (value: number, rate: number, direction: number) => void
    onDragEnd?: () => void
}

export const DraggableButtonController = (props: DraggableButtonControllerInterface) => {
    let { step, triggerSize, onStep, onDragEnd } = props;
    if (!triggerSize) triggerSize = DEFAULT_TRIGGER_SIZE
    if (!step) step = DEFAULT_STEP;
    const buttonRef = useRef<HTMLButtonElement>(null);
    let stepPosition = -1;
    let stepRate = 0;

    const handleMouseMove = (ev: MouseEvent) => {
        if (!onStep) return;
        if (stepPosition == -1) return;
        if (stepPosition - ev.clientY >= triggerSize) {
            stepRate++;
            onStep(step, stepRate, 1);
            stepPosition = (ev.clientY - ev.clientY % triggerSize)
        }
        if (stepPosition - ev.clientY <= -triggerSize) {
            stepRate--;
            onStep(step, stepRate, -1);
            stepPosition = (ev.clientY - ev.clientY % triggerSize)
        }
    }

    return (
        <Button
            ref={buttonRef}
            {...buttonProps}
            onMouseDown={(e) => {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    stepRate = 0;
                    document.body.style.cursor = "";
                    onDragEnd && onDragEnd();
                }, { once: true });
                e.preventDefault();
                stepPosition = (e.clientY);
                document.body.style.cursor = "ns-resize";
            }}
        />

    )
}
