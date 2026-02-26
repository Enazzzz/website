import type { Project } from "@/data/types";

/**
 * Default project cards for the portfolio section.
 */
export const projects: Project[] = [
	{
		id: "project-hub",
		title: "Portfolio Hub",
		description: "A dark, colorful portfolio that collects projects, awards, and updates in one place.",
		type: "code",
		tech: ["Next.js", "TypeScript", "Tailwind"],
		links: {
			repository: "https://github.com/your-github-username/portfolio-hub",
			demo: "https://portfolio-hub.example.com",
		},
	},
	{
		id: "ui-study",
		title: "UI Color Study",
		description: "A design exploration focused on accessible neon-on-dark palettes and component contrast.",
		type: "design",
		tech: ["Figma", "Design Tokens"],
		links: {
			article: "https://example.com/ui-color-study",
		},
	},
	{
		id: "notes-on-shipping",
		title: "Shipping Notes",
		description: "A writing series on how I ship projects, track progress, and learn in public.",
		type: "writing",
		tech: ["Markdown", "Docs"],
		links: {
			article: "https://example.com/shipping-notes",
		},
	},
	{
		id: "community",
		title: "Community Sessions",
		description: "A mixed showcase of talks, mentoring sessions, and community event highlights.",
		type: "other",
		tech: ["Community", "Public Speaking"],
		links: {},
	},
];
