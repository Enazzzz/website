/**
 * Shared type definitions for all portfolio content blocks.
 */
export type ProjectType = "code" | "design" | "writing" | "other";

/**
 * Links available for each project card.
 */
export interface ProjectLinks {
	repository?: string;
	demo?: string;
	article?: string;
}

/**
 * Structured data for project cards.
 */
export interface Project {
	id: string;
	title: string;
	description: string;
	type: ProjectType;
	tech: string[];
	imageUrl?: string;
	links: ProjectLinks;
}

/**
 * Skill item that supports an optional icon key.
 */
export interface Skill {
	id: string;
	name: string;
	icon?: string;
}

/**
 * Skill groups shown in the Skills section.
 */
export interface SkillCategory {
	id: string;
	title: string;
	skills: Skill[];
}

/**
 * Experience card shape.
 */
export interface ExperienceEntry {
	id: string;
	role: string;
	organization: string;
	period: string;
	description: string;
}

/**
 * Award or highlight badge data.
 */
export interface Award {
	id: string;
	name: string;
	issuer?: string;
	date?: string;
	description?: string;
	link?: string;
	imageUrl?: string;
}

/**
 * Dated updates for the Now page.
 */
export interface NowEntry {
	id: string;
	date: string;
	content: string;
}

/**
 * External profile links used across the site.
 */
export interface LinkEntry {
	id: string;
	label: string;
	url: string;
}

/**
 * GitHub block metadata shown in the Hero/About section.
 */
export interface GithubProfile {
	username: string;
	profileUrl: string;
	avatarUrl: string;
	statsNote: string;
}

/**
 * Personal profile content used for top sections.
 */
export interface ProfileContent {
	name: string;
	tagline: string;
	bio: string;
	location: string;
	email: string;
}

/**
 * Single content schema used by public pages and console CRUD.
 */
export interface ThemeSettings {
	bg: string;
	surface: string;
	text: string;
	accent: string;
	accentAlt: string;
	border: string;
}

/**
 * Single content schema used by public pages and console CRUD.
 */
export interface SiteContent {
	profile: ProfileContent;
	github: GithubProfile;
	projects: Project[];
	skills: SkillCategory[];
	experience: ExperienceEntry[];
	awards: Award[];
	nowEntries: NowEntry[];
	links: LinkEntry[];
	theme: ThemeSettings;
}

/**
 * Contact submission payload sent from the contact form.
 */
export interface ContactSubmission {
	name: string;
	email: string;
	subject: string;
	message: string;
}
