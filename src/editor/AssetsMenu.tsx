import { observer } from "mobx-react-lite"
import { Image } from "antd";
import { useEditor } from "@orb_Editor";

const AssetsMenu = observer(() => {
    const { storageModels } = useEditor();

    console.log(storageModels);

    return (
        <div style={{width: "90%", margin: "auto", height: "100%"}}>
            Assets
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "start", flexWrap: "wrap", border: "2px solid grey", marginTop: "10px" }}>
                    {
                        storageModels.map((model) => {
                            return (
                                <div style={{ width: 64, height: 64, padding: "0.5%" }}>
                                    <Image
                                        crossOrigin="anonymous"
                                        style={{
                                            border: "3px solid white",
                                            boxShadow: "5px 5px 2px 1px rgba(0, 0, 0, 0.2)",
                                            backgroundColor: "#696969"
                                        }}
                                        src={model.fileThumbnail}
                                        typeof="png"
                                        preview={false}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
})

export default AssetsMenu;