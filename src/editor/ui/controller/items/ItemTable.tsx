import { Table } from "antd";
import { ItemBase } from "./Item";
import { ItemRow } from "./ItemRow";
import { TableProps } from "antd/es/table";

interface TableInterface extends Omit<TableProps, 'children'>, ItemBase { }

export const ItemTable = (props: TableInterface) => {
    const { label, tooltip, layout, columns, dataSource, showHeader, style, scroll } = props;

    return (
        <ItemRow label={label} tooltip={tooltip} layout={layout}>
            <Table
                style={style}
                showHeader={showHeader}
                pagination={false}
                tableLayout="auto"
                columns={columns}
                dataSource={dataSource}
                scroll={scroll}
            />
        </ItemRow>
    )
}

export default ItemTable;