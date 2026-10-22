import React, { useCallback, useRef } from "react";
import { MathUtils } from "three";
import { LABEL_WIDTH_VARIABLE, LabelResizeContext } from "./ItemContext";

// % of a row the label column can be resized to, past 35% the three and four axis rows get too narrow to read.
const LABEL_WIDTH_LIMIT = { min: 15, max: 35 };

interface ItemListInterface {
    // Label column width of every row inside, e.g "40%" or "120px". Rows default to 25%.
    labelWidth?: string
    // The label column can be resized by dragging the right edge of any label.
    resizable?: boolean
    children?: React.ReactNode
}

// Container for rows, replaces the antd Form that used to hold the label/value columns.
export const ItemList = (props: ItemListInterface) => {
    const { labelWidth, resizable, children } = props;
    const ref = useRef<HTMLDivElement>(null);

    // Written straight to the CSS variable, so dragging doesn't re-render the items.
    const resize = useCallback((percent: number) => {
        ref.current?.style.setProperty(LABEL_WIDTH_VARIABLE, `${MathUtils.clamp(percent, LABEL_WIDTH_LIMIT.min, LABEL_WIDTH_LIMIT.max)}%`);
    }, []);

    return (
        <div ref={ref} style={{ [LABEL_WIDTH_VARIABLE]: labelWidth } as React.CSSProperties}>
            <LabelResizeContext.Provider value={resizable ? resize : undefined}>{children}</LabelResizeContext.Provider>
        </div>
    )
}

export default ItemList;
