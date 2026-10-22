import { Switch } from "antd";
import React, { useState } from "react";
import { ItemObject, resolveLabel, AnyObject, invalidVariable } from "./Item";
import { ItemRow } from "./ItemRow";
import { ItemInvalidAlert } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";
import { KeyToValueOfType } from "@orb_types";

interface BooleanInterface<T extends AnyObject, K extends KeyToValueOfType<T, boolean>> extends ItemObject<T, K> {
    onChange?: (value: boolean) => void
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
}

export const ItemBoolean = <T extends AnyObject, K extends KeyToValueOfType<T, boolean>>(props: BooleanInterface<T, K>) => {
    const { object, variable, icons, onChange, tooltip, layout } = props;
    const [v, setValue] = useState<boolean>(object[variable]);

    useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;

    return (
        <ItemRow label={resolveLabel(props)} tooltip={tooltip} layout={layout}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Switch
                    style={{ margin: "2px 5px" }}
                    defaultChecked={object[variable]}
                    checkedChildren={icons?.on}
                    unCheckedChildren={icons?.off}
                    onChange={(e) => {
                        setValue(e);
                        object[variable] = e as T[K];
                        onChange && onChange(e);
                    }} />
            </div>
        </ItemRow>
    )
}

export default ItemBoolean;