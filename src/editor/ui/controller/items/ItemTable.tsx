import { Form, Table } from "antd";
import { ItemObjectless } from "./Item";
import { TableProps } from "antd/es/table";

interface TableInterface extends Omit<TableProps, 'children'>, ItemObjectless { };

export const ItemTable = (props: TableInterface) => {
    let { label, tooltip, columns, dataSource, showHeader, style, scroll } = props;

    return (
        <Form.Item label={label} tooltip={tooltip}>
            <Table
                style={style}
                showHeader={showHeader}
                pagination={false}
                tableLayout="auto"
                columns={columns}
                dataSource={dataSource}
                scroll={scroll}
            />
        </Form.Item>
    )
}

export default ItemTable;