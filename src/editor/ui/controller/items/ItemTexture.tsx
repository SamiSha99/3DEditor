import { Button, Form, Image, ImageProps } from "antd";
import React, { useRef, useState } from "react";
import { Item, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { CanvasTexture, Texture } from "three";
import { saveLink } from "@orb_tools/Exporter";

interface TextureInterface extends Item {
    onChange?: (value: string) => void
}

export const ItemTexture: React.FC<TextureInterface> = (
    { label, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    console.log(variable, ":", object[variable]);
    // const [v, setValue] = useState<string>(object[variable]);
    const [url, setURL] = useState<string>("");
    const imageRef = useRef<any>(null!);
    const t = (object[variable] as Texture);

    if (t && !url) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        canvas.width = t.image.width;
        canvas.height = t.image.height;
        ctx?.drawImage(t.image, 0, 0, t.image.width, t.image.height, 0, 0, t.image.width, t.image.height);
        canvas.toBlob((b) => {
            if (!b) return;
            URL.revokeObjectURL(url);
            setURL(URL.createObjectURL(b));
            imageRef.current.src = URL.createObjectURL(b);

        });
    }

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Button style={{ padding: 0, height: 32, width: 64 }}>
                {url && <Image
                    style={{ objectFit: "fill" }}
                    src={url}
                    itemType="failed"
                    preview={false}
                    height={"100%"}
                    width={"100%"}
                />}
            </Button>
        </Form.Item >
    )
}

export default ItemTexture;