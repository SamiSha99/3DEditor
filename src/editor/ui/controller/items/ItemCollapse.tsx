import { Collapse } from "antd"

type ItemCollapseInterface = {
    label: string,
    children?: React.ReactNode
    collapsed?: boolean;
}

export const ItemCollapse: React.FC<ItemCollapseInterface> = (
    { label, children, collapsed }
) => {
    return (
        <Collapse
            defaultActiveKey={!collapsed ? ["1"] : undefined}
            style={{ width: "100%", paddingLeft: 5, borderLeft: "5px solid #212121" }}
            items={[{ label: label, key: "1", children: <div>{children}</div> }]}
        />
    )
}

export default ItemCollapse;