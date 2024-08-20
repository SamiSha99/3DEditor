import React from "react";
import OriginPointPanel from './OriginPointPanel';

export type ActivePanelType = {
    id: string,
    panel: React.ReactNode;
}

export const PANEL_ORIGIN_POINT: ActivePanelType = { id: "origin_point", panel: <OriginPointPanel /> }