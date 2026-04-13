import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

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
					width: "full",
					fontSize: { base: "3xl", md: "5xl" },
					fontWeight: "700",
					marginBottom: 2,
					lineHeight: "auto",
				},
			},
			muted: {
				value: {
					width: "full",
					color: "gray.600",
					fontSize: "md",
				},
			},
			label: {
				value: {
					width: "full",
					fontWeight: "500",
					fontSize: "sm",
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
