import { CameraOutlined } from "@ant-design/icons";
import { Dropdown, message, Button } from "antd"

export const Tools = () => {
    return (
        <Dropdown
            children={<Button children={"Tools"} />}
            menu={{
                items: [
                {
                    label: 'Take a Screenshot',
                    key: '0',
                    icon: <CameraOutlined />,
                    onClick: () => {
                        message.success("Snip!");
                        
                    }
                }
                ]
            }}/>
    )
}