import { QuestionCircleOutlined } from "@ant-design/icons";
import { theme, Tooltip, TooltipProps } from "antd";
import React, { isValidElement, useRef } from "react";
import styled from "styled-components";
import { ItemRowLayout, ItemTooltip } from "./Item";
import { ItemRowContext, LABEL_WIDTH_VARIABLE, useInsideItemRow, useLabelResize } from "./ItemContext";

const ROW_MARGIN_BOTTOM = 5;
const LABEL_WIDTH = `var(${LABEL_WIDTH_VARIABLE}, 25%)`;

interface ItemRowInterface {
    label?: React.ReactNode
    tooltip?: ItemTooltip
    // Defaults to "inline" when there's a label, otherwise "full".
    layout?: ItemRowLayout
    children?: React.ReactNode
}

export const ItemRow = (props: ItemRowInterface) => {
    const { label, tooltip, children } = props;
    const layout = props.layout ?? (label ? "inline" : "full");
    const nested = useInsideItemRow();
    const rowRef = useRef<HTMLDivElement>(null);
    const { token } = theme.useToken();

    if (nested) return <>{children}</>;

    return (
        <div ref={rowRef} style={{
            display: "grid",
            gridTemplateColumns: layout == "inline" ? `${LABEL_WIDTH} minmax(0, 1fr)` : "minmax(0, 1fr)",
            alignItems: "start",
            marginBottom: ROW_MARGIN_BOTTOM
        }}>
            {layout != "full" && <ItemLabel label={label} tooltip={tooltip} stacked={layout == "stacked"} rowRef={rowRef} />}
            <div style={{ display: "flex", alignItems: "center", minHeight: token.controlHeight, minWidth: 0 }}>
                <div style={{ flex: "auto", minWidth: 0 }}>
                    {/* A full row is free space, rows placed inside it render normally. */}
                    <ItemRowContext.Provider value={layout != "full"}>{children}</ItemRowContext.Provider>
                </div>
            </div>
        </div>
    )
}

// Rows inside render as rows again, even when the boundary itself sits in another row's value.
export const ItemRowBoundary = (props: { children?: React.ReactNode }) => {
    return <ItemRowContext.Provider value={false}>{props.children}</ItemRowContext.Provider>
}

interface ItemLabelInterface {
    label: React.ReactNode
    tooltip?: ItemTooltip
    stacked: boolean
    rowRef: React.RefObject<HTMLDivElement | null>
}

const ItemLabel = (props: ItemLabelInterface) => {
    const { label, tooltip, stacked, rowRef } = props;
    const { token } = theme.useToken();
    const resize = useLabelResize();

    return (
        <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            minHeight: stacked ? undefined : token.controlHeight,
            marginBottom: stacked ? token.marginXXS : undefined,
            paddingRight: token.paddingXS,
            color: token.colorTextHeading,
            fontSize: token.fontSize,
            overflowWrap: "anywhere"
        }}>
            <span>
                {label}
                {tooltip && <ItemLabelTooltip tooltip={tooltip} />}
            </span>
            {resize && !stacked && <LabelResizeHandle rowRef={rowRef} onResize={resize} />}
        </div>
    )
}

const ItemLabelTooltip = (props: { tooltip: ItemTooltip }) => {
    const { token } = theme.useToken();
    const { icon, ...tooltipProps } = typeof props.tooltip == "object" && !isValidElement(props.tooltip)
        ? props.tooltip as TooltipProps & { icon?: React.ReactElement }
        : { title: props.tooltip, icon: undefined };

    return (
        <Tooltip {...tooltipProps}>
            <span style={{ color: token.colorTextDescription, marginInlineStart: token.marginXXS, cursor: "help" }}>
                {icon ?? <QuestionCircleOutlined />}
            </span>
        </Tooltip>
    )
}

const ResizeHandle = styled.div<{ $hover: string }>`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 6px;
    cursor: col-resize;
    &:hover { background: ${({ $hover }) => $hover}; }
`

// Dragging sets the label width as a % of this row, every row in the ItemList follows.
const LabelResizeHandle = (props: { rowRef: React.RefObject<HTMLDivElement | null>, onResize: (percent: number) => void }) => {
    const { rowRef, onResize } = props;
    const { token } = theme.useToken();

    return (
        <ResizeHandle
            $hover={token.colorFill}
            onMouseDown={(e) => {
                const row = rowRef.current?.getBoundingClientRect();
                if (!row) return;
                e.preventDefault();
                const onMove = (ev: MouseEvent) => onResize((ev.clientX - row.left) / row.width * 100);
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", () => {
                    document.removeEventListener("mousemove", onMove);
                    document.body.style.cursor = "";
                }, { once: true });
                document.body.style.cursor = "col-resize";
            }}
        />
    )
}

export default ItemRow;
