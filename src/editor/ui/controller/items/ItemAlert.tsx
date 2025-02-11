
import { Alert, Form } from "antd";

export const ItemInvalidAlert = (props: { object: Record<string, any>, variable: string }) => {
    let { variable, object } = props;

    console.error("Failed to get the key from variable! variable =>", variable, "\nObject:\n", object);
    return (<Form.Item label={variable} children={<Alert message={`Couldn't find ${variable} in ${object?.constructor.name}.`} type="error" showIcon />} />)
}

export const invalidVariable = (object: { [key: string]: any; }, variable: string) => {
    return !Object.keys(object).find(key => key == variable);
}
