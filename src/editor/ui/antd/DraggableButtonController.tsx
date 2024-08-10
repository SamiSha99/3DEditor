import Icon from "@ant-design/icons";
import { Button, Form } from "antd";
import { useCallback, useRef } from "react";

type DraggableButtonControllerInterface = {
    step: number,
    onStep?: (stepMultiplier: number, amount?: number) => void
}

export const DraggableButtonController: React.FC<DraggableButtonControllerInterface> = (
    { onStep, step }
) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    let stepPosition = -1;
    let stepRate = 0;
    
    const handleMouseMove = (ev: MouseEvent) => {
        if (!onStep) return;
        if (stepPosition == -1) return;
        if (stepPosition - ev.clientX >= 10) {
            stepRate--;
            onStep(stepRate * step, stepRate);
            stepPosition = (ev.clientX - ev.clientX % 5)
        }
        if (stepPosition - ev.clientX <= -10) {
            stepRate++;
            onStep(stepRate * step, stepRate);
            stepPosition = (ev.clientX - ev.clientX % 5)
        }
    }

    const handleMouseDown = useCallback(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleMouseMove);
            stepRate = 0;
        }, { once: true });
    }, []);

    return (

        <Button
            size="small"
            ref={buttonRef}
            icon={<Icon component={undefined} />}
            style={{ left: 0, background: "grey", width: "3px", cursor: "ew-resize" }}
            block
            onMouseDown={(e) => {
                e.preventDefault();
                stepPosition = (e.clientX);
                handleMouseDown();
            }}
        />

    )
}
