import React from "react";
import PanelOriginPoint from './PanelOriginPoint';
import PanelScreenshot from "./PanelScreenshot";

export type ActivePanelType = {
    id: string,
    panel: React.ReactNode;
}

export const PANEL_ORIGIN_POINT: ActivePanelType = { id: "origin_point", panel: <PanelOriginPoint /> }
export const PANEL_SCREENSHOT: ActivePanelType = { id: "screenshot", panel: <PanelScreenshot />} 