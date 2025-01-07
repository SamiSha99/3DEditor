import { Form, Table } from "antd";
import { Item, labelFromVariable } from "./Item";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";
import { TableProps } from "antd/es/table";

interface TableInterface extends Omit<TableProps, 'children'>, Item { };

export const ItemTable = (props: TableInterface) => {
    let { label, labelInVariable, object, variable, tooltip, columns, dataSource, showHeader, style } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <Table
                style={style}
                showHeader={showHeader}
                pagination={false}
                tableLayout="auto"
                columns={columns}
                dataSource={dataSource} />
        </Form.Item>
    )
}

export default ItemTable;