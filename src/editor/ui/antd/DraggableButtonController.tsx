import Icon from "@ant-design/icons";
import { DRAGGABLE_CONTROLLER_WIDTH } from "@orb_UI/controller/items/SharedItemOptions";
import { Button } from "antd";
import { useRef } from "react";

const DEFAULT_TRIGGER_SIZE = 10;
const DEFAULT_STEP = 1;

type DraggableButtonControllerInterface = {
    step?: number,
    triggerSize?: number
    onStep?: (value: number, rate: number, direction: number) => void
}

export const DraggableButtonController: React.FC<DraggableButtonControllerInterface> = (
    { step, triggerSize, onStep }
) => {
    if (!triggerSize) triggerSize = DEFAULT_TRIGGER_SIZE
    if (!step) step = DEFAULT_STEP;
    const buttonRef = useRef<HTMLButtonElement>(null);
    let stepPosition = -1;
    let stepRate = 0;

    const handleMouseMove = (ev: MouseEvent) => {
        if (!onStep) return;
        if (stepPosition == -1) return;
        if (stepPosition - ev.clientX >= triggerSize) {
            stepRate--;
            onStep(step, stepRate, -1);
            stepPosition = (ev.clientX - ev.clientX % triggerSize)
        }
        if (stepPosition - ev.clientX <= -triggerSize) {
            stepRate++;
            onStep(step, stepRate, 1);
            stepPosition = (ev.clientX - ev.clientX % triggerSize)
        }
    }

    return (

        <Button
            tabIndex={-1}
            size="small"
            ref={buttonRef}
            icon={<Icon component={undefined} />}
            style={{ left: 0, background: "grey", width: DRAGGABLE_CONTROLLER_WIDTH, cursor: "ew-resize" }}
            block
            onMouseDown={(e) => {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    stepRate = 0;
                }, { once: true });
                e.preventDefault();
                stepPosition = (e.clientX);
            }}
        />

    )
}
