import { observer } from "mobx-react-lite"
import { Image } from "antd";

const AssetsMenu = observer(() => {
    return (
        <div style={{ backgroundColor: "#696969", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "80%", display: "flex", justifyContent: "start", flexWrap: "wrap" }}>
                {
                    [...Array(20)].map(() => {
                        return (
                            <div style={{ width: 64, height: 64, padding: "0.5%" }}>
                                <Image
                                    style={{ objectFit: "cover" }}
                                    src={"./logo.jpg"}
                                    preview={false}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
})

export default AssetsMenu;