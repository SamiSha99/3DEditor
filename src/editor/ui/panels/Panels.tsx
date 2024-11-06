import React from "react";
// import PanelOriginPoint from './PanelOriginPoint';
import PanelScreenshot from "./PanelScreenshot";
import { Editor } from "@orb_Editor";

export type Panel = {
    id: string,
    panel: React.ReactNode,
    flags?: string[],
    parameters?: { [key: string]: any }
}

// export const PANEL_ORIGIN_POINT: Panel = { id: "origin_point", panel: <PanelOriginPoint />, flags: ["drag_object"] }
export const PANEL_SCREENSHOT: Panel = { id: "screenshot", panel: <PanelScreenshot /> }

/** Checks if the panel is currently active */
export function isPanelActive(panel: Panel | string) {
    const id = (typeof panel === 'string' ? panel : panel.id);
    return Editor.Instance.activePanels.find(x => x.id == id);
}

export function panelHasFlag(panel: Panel | string, flag: string) {
    return !!isPanelActive(panel)?.flags?.find(f => f == flag);
}