import React from "react";
import PanelOriginPoint from './PanelOriginPoint';
import PanelScreenshot from "./PanelScreenshot";
import { AppStore } from "@orb_AppStore";

export type ActivePanelType = {
    id: string,
    panel: React.ReactNode;
}

export const PANEL_ORIGIN_POINT: ActivePanelType = { id: "origin_point", panel: <PanelOriginPoint /> }
export const PANEL_SCREENSHOT: ActivePanelType = { id: "screenshot", panel: <PanelScreenshot />} 

export function isPanelActive(panel: ActivePanelType | string) {
    const id = (typeof panel === 'string' ? panel : panel.id);
    return !!AppStore.Instance.activePanels.find(x => x.id == id);
}