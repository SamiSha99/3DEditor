import { Button, Form, Image, Popconfirm, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { ItemObject, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { DataTexture, Material, MeshBasicMaterial, Texture, WebGLRenderer } from "three";
import { saveLink } from "@orb_tools/Exporter";
import { CloudUploadOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { doImportTexture } from "@orb_tools/Importer";
import { useOnUnmount } from "src/store/Hooks";
import { FullScreenQuad } from "three/examples/jsm/Addons";
import { KeyToValueOfType } from "@orb_types";

type TextureTypes = Texture | null | undefined;

interface TextureInterface<T extends Record<string, any>, K extends KeyToValueOfType<T, TextureTypes>> extends ItemObject<T, K> {
    hdr?: boolean,
    size?: { width: number, height: number }
    onChange?: (value?: Texture) => void
    onDelete?: () => void
}

const DEFAULT_SIZE = { width: 64, height: 64 };

type TextureObject = {
    url: string,
    type: string
}

export const ItemTexture = <T extends Record<string, any>, K extends KeyToValueOfType<T, TextureTypes>>(props: TextureInterface<T, K>) => {
    let { label, labelInVariable, object, variable, hdr, readonly, size, onChange } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [textureObject, setTextureObject] = useState<TextureObject | undefined>(undefined);
    const [hoverUploadIcon, setHoverUploadIcon] = useState(false);

    if (!size) size = DEFAULT_SIZE;

    const makeImageObject = (t?: Texture | null) => {
        if (!t) return;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (!t.image) return;
        const width = t.image.width;
        const height = t.image.height;
        canvas.width = width;
        canvas.height = height;
        if (t instanceof DataTexture) {
            const c = renderToCanvas(t);
            ctx?.drawImage(c, 0, 0, width, height, 0, 0, width, height)
        } else {
            ctx?.drawImage(t.image, 0, 0, width, height, 0, 0, width, height);
        }
        canvas.toBlob((b) => {
            if (!b) return;
            textureObject && URL.revokeObjectURL(textureObject.url)
            const obj = { url: URL.createObjectURL(b), type: b.type } as TextureObject;
            setTextureObject(obj);
        });
    }


    const requestUploadTexture = () => {
        doImportTexture((texture) => {
            // to-do idk but maybe not?
            // !hdr && (texture.flipY = false);
            object[variable] = texture as T[K];
            (object[variable] as Texture).needsUpdate = true;
            if (object instanceof Material && object[variable])
                object.needsUpdate = true;
            makeImageObject(object[variable]);
            onChange && onChange(texture);
            setHoverUploadIcon(false);
        })
    }

    const requestDownloadTexture = () => {
        textureObject && saveLink(textureObject.url, variable, textureObject.type)
    }

    useEffect(() => { makeImageObject(object[variable]) }, []);
    // clean up 
    useOnUnmount(() => textureObject && URL.revokeObjectURL(textureObject.url), [textureObject])

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label}>
            <div style={{ display: "flex" }}>
                {
                    !readonly &&
                    <div style={{ width: "100%", padding: "0 5px" }}>
                        <div style={{ float: "right", backgroundColor: "#303030", border: "2px solid #404040" }}>
                            <Tooltip title="Upload Texture">
                                <Button icon={<CloudUploadOutlined />} onClick={requestUploadTexture} />
                            </Tooltip>
                            <Tooltip title="Download Texture">
                                <Button icon={<DownloadOutlined />} disabled={!object[variable]} onClick={requestDownloadTexture} />
                            </Tooltip>

                            <Popconfirm
                                title="Remove Texture"
                                description="This cannot be undone."
                                onConfirm={() => {
                                    const t = object[variable] as Texture;
                                    t.dispose();
                                    object[variable] = undefined as T[K];
                                    if (!hdr && object instanceof Material)
                                        object.needsUpdate = true;
                                    setTextureObject(undefined);
                                    onChange && onChange(undefined);
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger={object[variable]} disabled={!object[variable]} icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </div>
                    </div>
                }
                <div style={{ width: size.width, height: size.height, flexShrink: 0, backgroundColor: "#303030", border: "2px solid #404040", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={() => !textureObject && !readonly && setHoverUploadIcon(true)}
                    onMouseLeave={() => !textureObject && !readonly && setHoverUploadIcon(false)}>
                    {
                        !textureObject?.url &&
                        <div style={{ color: "darkgrey", width: hoverUploadIcon ? "100%" : undefined, height: hoverUploadIcon ? "100%" : undefined }}>
                            {hoverUploadIcon ? <Button style={{ width: "100%", height: "100%" }} icon={<CloudUploadOutlined style={{ fontSize: Math.min(size.height / 2, 64) }} />} onClick={requestUploadTexture} /> : "[empty]"}
                        </div>
                    }
                    {
                        textureObject?.url &&
                        <Image
                            style={{ objectFit: "cover" }}
                            src={textureObject.url}
                            preview={{ mask: <EyeOutlined style={{ fontSize: Math.min(size.height / 2, 64) }} /> }}
                        />
                    }
                </div>
            </div>
        </Form.Item >
    )
}

function renderToCanvas(texture: DataTexture) {

    const renderer = new WebGLRenderer();
    const fsQuad = new FullScreenQuad(new MeshBasicMaterial());

    const image = texture.image;

    renderer.setSize(image.width, image.height, false);

    (fsQuad.material as MeshBasicMaterial).map = texture;
    fsQuad.render(renderer);
    // fsQuad.dispose();
    return renderer.domElement;
}

export default ItemTexture;