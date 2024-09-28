import { Collapse } from "antd"

type ItemGroupInterface = {
    label: string,
    children?: React.ReactNode
    collapsed?: boolean;
}

export const ItemGroup: React.FC<ItemGroupInterface> = (
    { label, children, collapsed }
) => {
    return (
        <Collapse
            defaultActiveKey={!collapsed ? ["1"] : undefined}
            style={{ width: "100%" }}
            items={[{ label: label, key: "1", children: children }]}
        />
    )
}

export default ItemGroup;