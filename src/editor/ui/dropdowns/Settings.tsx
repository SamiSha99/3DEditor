import { Dropdown, Button} from "antd"

export const Settings = () => {
    return (
        <>
            <Dropdown
                trigger={["click"]}
                children={<Button children={"Settings"} />}
                menu={{
                    items: [
                        {
                            label: 'Hotkeys',
                            key: '0',
                            onClick: () => {
                                
                            }
                        },
                        {
                            label: 'Preferences',
                            key: '1',
                            onClick: () => {
                            }
                        }
                    ]
                }} />
        </>
    )
}
export default Settings
