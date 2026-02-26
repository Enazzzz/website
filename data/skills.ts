import type { SkillCategory } from "@/data/types";

/**
 * Grouped skill categories displayed as pills.
 */
export const skills: SkillCategory[] = [
	{
		id: "frontend",
		title: "Frontend",
		skills: [
			{ id: "ts", name: "TypeScript", icon: "TS" },
			{ id: "react", name: "React", icon: "RE" },
			{ id: "next", name: "Next.js", icon: "NX" },
			{ id: "tailwind", name: "Tailwind CSS", icon: "TW" },
		],
	},
	{
		id: "backend",
		title: "Backend",
		skills: [
			{ id: "node", name: "Node.js", icon: "ND" },
			{ id: "api", name: "REST APIs", icon: "API" },
			{ id: "db", name: "Databases", icon: "DB" },
		],
	},
	{
		id: "tools",
		title: "Tools",
		skills: [
			{ id: "git", name: "Git", icon: "GT" },
			{ id: "figma", name: "Figma", icon: "FG" },
			{ id: "vercel", name: "Vercel", icon: "VC" },
		],
	},
];
