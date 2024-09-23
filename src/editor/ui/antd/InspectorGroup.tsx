import { Collapse } from "antd"

type InspectorGroupInterface = {
    label: string,
    key: string,
    children?: React.ReactNode
}

export const InspectorGroup: React.FC<InspectorGroupInterface> = (
    { label, key, children }
) => {
    return (
        <Collapse
            style={{ width: "100%" }}
            items={[{ label: label, key: key, children: children }]}
        />
    )
}