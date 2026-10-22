import { createContext, useContext } from "react";

// Width of the label column, set it on any parent element (see ItemList), it inherits through Collapse and other wrappers.
export const LABEL_WIDTH_VARIABLE = "--item-label-width";

export const ItemRowContext = createContext(false);
// True when rendered inside another row's value (e.g. ItemGroup), where an item should only render its control.
export const useInsideItemRow = () => useContext(ItemRowContext);

// Set by a resizable ItemList, takes the label column width in % of a row.
export const LabelResizeContext = createContext<((percent: number) => void) | undefined>(undefined);
export const useLabelResize = () => useContext(LabelResizeContext);
