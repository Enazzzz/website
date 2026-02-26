import type { ThemeSettings } from "@/data/types";

/** Default background gradient orbs (accent-colored). */
const defaultBackgroundGradient: ThemeSettings["backgroundGradient"] = {
	enabled: true,
	radius1: 35,
	radius2: 32,
	position1: "10% -10%",
	position2: "90% -10%",
	opacity1: 0.35,
	opacity2: 0.28,
};

/**
 * Default theme palette used by the website.
 */
export const defaultTheme: ThemeSettings = {
	bg: "#06070e",
	surface: "#101423",
	text: "#f6f7ff",
	accent: "#8c7bff",
	accentAlt: "#27d8ff",
	border: "rgba(255, 255, 255, 0.12)",
	font: "geist",
	backgroundGradient: defaultBackgroundGradient,
};
