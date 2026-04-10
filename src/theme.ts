import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"


const config = defineConfig({
    globalCss: {
        body: {
            fontFamily: "Inter, sans-serif",
        },
    },
    theme: {
        textStyles: {
            title: {

                value: {
                    fontSize: {base: '3xl', md: '5xl'},
                    fontWeight: "700",
                    marginBottom: {base: 2, md: 6},
                    lineHeight: 1
                }
            },
            muted: {
                value: {
                    color: "gray.600",
                    fontSize: "md",
                }
            },
            label: {
                value: {
                    fontWeight: "500",
                    fontSize: "sm",
                }
            },
        },
    },

})

export const system = createSystem(defaultConfig, config)