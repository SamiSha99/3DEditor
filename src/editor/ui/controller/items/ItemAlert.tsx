
import { Alert, Form } from "antd";
import React from "react";
import { Item } from "./Item";

export const ItemInvalidAlert: React.FC<Item> = (
    { variable, object }
) => {

    console.error("Failed to get the key from variable! variable =>", variable, "\nObject:\n", object);
    return (<Form.Item label={variable} children={<Alert message={`Couldn't find ${variable} in ${object?.constructor.name}.`} type="error" showIcon />} />)
}

export const invalidVariable = (object: { [key: string]: any; }, variable: string) => {
    return !Object.keys(object).find(key => key == variable);
}
