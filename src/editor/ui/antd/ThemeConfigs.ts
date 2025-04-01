import { theme, ThemeConfig } from "antd";

export const MainTheme: ThemeConfig = {
    algorithm: [theme.darkAlgorithm,],
    components: {
        Form: {
            itemMarginBottom: 0
        },
        InputNumber: {
            size: 10,
            inputFontSizeSM: 12,
            inputFontSize: 12,
            inputFontSizeLG: 12,
            paddingBlock: 2,
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Input: {
            size: 10,
            inputFontSizeSM: 12,
            inputFontSize: 12,
            inputFontSizeLG: 12,
            paddingBlock: 2,
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Select: {
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Button: {
            defaultBg: "#212121",
            defaultHoverBg: "#323232",
            defaultActiveBg: "#323232",
            colorBorder: "none",
        },
        Radio: {
            colorBorderSecondary: "none",
            colorPrimaryBorder: "none",
            buttonBg: "none",
            colorBorder: "rgb(0,0,0,0)",
        }
    },
    token: {
        borderRadius: 0,
        borderRadiusSM: 0,
        borderRadiusLG: 0,
        borderRadiusOuter: 0,
        borderRadiusXS: 0,
        motion: true
    }
}

export const InspectorTheme: ThemeConfig = {
    token: {
        colorTextDisabled: "rgba(255, 255, 255, 0.6)",
        // colorBgContainerDisabled: "rgba(128, 128, 128, 0.20)"
    },
    components: {
        Collapse: {
            contentBg: "#212121",
            headerBg: "rgb(0,0,0,0.5)",
            contentPadding: "12px",
            headerPadding: "10px",
            colorBorder: "none",
        },
        Slider: {
            controlHeight: 0
        },
        Divider: {
            colorSplit: "rgb(255, 255, 255, 0.5)",
            lineWidth: 2,
            fontSize: 28
        },
        Checkbox: {
            controlInteractiveSize: 18
        },
        Form: {
            itemMarginBottom: 5
        },
        Button: {
            defaultBg: "#141414",
            defaultBorderColor: "none",
            defaultShadow: "none",
            defaultHoverBg: "#141414",
            defaultActiveBg: "#141414",
            colorBgContainerDisabled: "transparent",
            colorTextDisabled: "#666", // 😰😰😰
        },
        Radio: {
            colorBorderSecondary: "none",
            colorPrimaryBorder: "none",
            buttonBg: "rgb(0,0,0,0.2)",
            colorBorder: "rgb(0,0,0,0)",
        },
        Table: {
            cellPaddingInline: 8,
            cellPaddingBlock: 0,
        }
    }
}

export const PanelsThemeConfig: ThemeConfig = {
    components: {
        Divider: {
            margin: 0,
        },
        Button: {
            defaultBg: "#3d3d3d"
        },
        Card: {
            // headerFontSize: "1vw"
        }
    },
    token: {
        motion: false
    }
}