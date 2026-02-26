import { awards } from "@/data/awards";
import { experience } from "@/data/experience";
import { links } from "@/data/links";
import { nowEntries } from "@/data/now";
import { profile, github } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { defaultTheme } from "@/data/theme";
import type { SiteContent } from "@/data/types";

/** Default site branding (title + favicon). */
const defaultSite: SiteContent["site"] = {
	siteTitle: profile.name,
	iconText: "PH",
	faviconUrl: undefined,
};

/**
 * Default site content used when runtime overrides are unavailable.
 */
export const defaultSiteContent: SiteContent = {
	profile,
	github,
	projects,
	skills,
	experience,
	awards,
	nowEntries,
	links,
	theme: defaultTheme,
	site: defaultSite,
};
