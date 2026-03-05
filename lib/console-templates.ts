import { defaultTheme } from "@/data/theme";
import type { Project, ThemeSettings } from "@/data/types";

/**
 * Metadata for project templates offered in the console.
 */
export interface ProjectTemplate {
	id: string;
	label: string;
	createProject: () => Project;
}

/**
 * Creates a unique identifier for new entities.
 */
function createId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Starter templates used by the Projects editor.
 */
export const projectTemplates: ProjectTemplate[] = [
	{
		id: "code",
		label: "Code project",
		createProject: () => ({
			id: createId("project"),
			title: "New code project",
			description: "Describe what this project solves and why it matters.",
			type: "code",
			tech: ["TypeScript", "Next.js"],
			links: {
				repository: "",
				demo: "",
			},
		}),
	},
	{
		id: "design",
		label: "Design project",
		createProject: () => ({
			id: createId("project"),
			title: "New design project",
			description: "Describe the design challenge, process, and outcome.",
			type: "design",
			tech: ["Figma"],
			links: {
				article: "",
			},
		}),
	},
	{
		id: "writing",
		label: "Writing project",
		createProject: () => ({
			id: createId("project"),
			title: "New writing piece",
			description: "Share the topic, audience, and goal of this piece.",
			type: "writing",
			tech: ["Markdown"],
			links: {
				article: "",
			},
		}),
	},
	{
		id: "other",
		label: "Other project",
		createProject: () => ({
			id: createId("project"),
			title: "New showcase item",
			description: "Document this highlight and why it is worth featuring.",
			type: "other",
			tech: [],
			links: {},
		}),
	},
];

/**
 * Predefined color themes for quick visual switching.
 */
export const themePresets: Array<{ id: string; label: string; theme: ThemeSettings }> = [
	{
		id: "default",
		label: "Default",
		theme: { ...defaultTheme, bg: "#06070e", surface: "#101423", text: "#f6f7ff", accent: "#8c7bff", accentAlt: "#27d8ff", border: "rgba(255, 255, 255, 0.12)", font: "geist" },
	},
	{
		id: "ocean",
		label: "Ocean",
		theme: { ...defaultTheme, bg: "#041018", surface: "#0d2230", text: "#eaf9ff", accent: "#2ec4ff", accentAlt: "#6ef3d6", border: "rgba(160, 234, 255, 0.24)", font: "geist" },
	},
	{
		id: "sunset",
		label: "Sunset",
		theme: { ...defaultTheme, bg: "#13060d", surface: "#26101e", text: "#fff2f8", accent: "#ff7ab6", accentAlt: "#ffb14d", border: "rgba(255, 168, 214, 0.24)", font: "geist" },
	},
];

/** Font options for body and heading dropdowns. */
export const fontOptions: Array<{ id: ThemeSettings["font"]; label: string }> = [
	{ id: "geist", label: "Geist" },
	{ id: "inter", label: "Inter" },
	{ id: "dm-sans", label: "DM Sans" },
	{ id: "outfit", label: "Outfit" },
	{ id: "syne", label: "Syne" },
	{ id: "space-grotesk", label: "Space Grotesk" },
	{ id: "playfair", label: "Playfair Display (serif)" },
];
