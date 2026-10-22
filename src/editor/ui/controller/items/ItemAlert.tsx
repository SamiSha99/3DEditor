
import { Alert } from "antd";
import { ItemRow } from "./ItemRow";

export const ItemInvalidAlert = (props: { object: object, variable: string }) => {
    const { variable, object } = props;

    console.error("Failed to get the key from variable! variable =>", variable, "\nObject:\n", object);
    return (<ItemRow label={variable} children={<Alert message={`Couldn't find ${variable} in ${object?.constructor.name}.`} type="error" showIcon />} />)
}

