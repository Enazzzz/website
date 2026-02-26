/**
 * Section keys used by the console sidebar and renderer.
 */
export type ConsoleSectionId =
	| "profile"
	| "github"
	| "projects"
	| "skills"
	| "experience"
	| "awards"
	| "now"
	| "links"
	| "theme";

/**
 * Sidebar option metadata.
 */
export interface ConsoleSectionOption {
	id: ConsoleSectionId;
	label: string;
}

/**
 * Default list of sections shown in the admin console.
 */
export const consoleSectionOptions: ConsoleSectionOption[] = [
	{ id: "profile", label: "Profile" },
	{ id: "github", label: "GitHub" },
	{ id: "projects", label: "Projects" },
	{ id: "skills", label: "Skills" },
	{ id: "experience", label: "Experience" },
	{ id: "awards", label: "Awards" },
	{ id: "now", label: "Now" },
	{ id: "links", label: "Links" },
	{ id: "theme", label: "Theme" },
];
