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
/** Font family key used for body/sans (e.g. geist, inter, playfair). */
export type ThemeFontId = "geist" | "inter" | "playfair" | "space-grotesk";

/** Background gradient orbs (accent-colored). Toggleable and customizable in Theme. */
export interface BackgroundGradientSettings {
	/** Whether the page background gradient orbs are visible. */
	enabled: boolean;
	/** Size of first orb as % of container (e.g. 35). */
	radius1: number;
	/** Size of second orb as % of container (e.g. 32). */
	radius2: number;
	/** Position of first orb (e.g. "10% -10%" or "left top"). */
	position1: string;
	/** Position of second orb (e.g. "90% -10%"). */
	position2: string;
	/** Opacity of first orb 0–1 (e.g. 0.35). */
	opacity1: number;
	/** Opacity of second orb 0–1 (e.g. 0.28). */
	opacity2: number;
}

export interface ThemeSettings {
	bg: string;
	surface: string;
	text: string;
	accent: string;
	accentAlt: string;
	border: string;
	/** Which font to use site-wide. */
	font: ThemeFontId;
	/** Page background gradient orbs (uses accent colors). */
	backgroundGradient: BackgroundGradientSettings;
}

/**
 * Site-wide branding (browser title and favicon). Editable in console.
 */
export interface SiteBranding {
	/** Default browser tab title (e.g. "Portfolio | Jane Doe"). */
	siteTitle: string;
	/** Text shown on the generated favicon (e.g. "PH", "ZD"). Max ~2–3 chars. */
	iconText: string;
	/** Optional: custom favicon URL. If set, overrides the generated icon. */
	faviconUrl?: string;
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
	/** Browser title and favicon. */
	site: SiteBranding;
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
