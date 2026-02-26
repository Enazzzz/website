import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultSiteContent } from "@/data/site";
import type { SiteContent } from "@/data/types";

const runtimeContentFilePath = path.join(process.cwd(), "data", "runtime-content.json");
const contactSubmissionFilePath = path.join(process.cwd(), "data", "contact-submissions.json");

/**
 * Reads runtime content if it exists and is valid JSON.
 */
async function readRuntimeContent(): Promise<Partial<SiteContent> | null> {
	try {
		const raw = await fs.readFile(runtimeContentFilePath, "utf8");
		return JSON.parse(raw) as Partial<SiteContent>;
	} catch {
		return null;
	}
}

/**
 * Deep-ish merge for site content arrays and top-level objects.
 */
function mergeSiteContent(base: SiteContent, override: Partial<SiteContent>): SiteContent {
	return {
		profile: override.profile ?? base.profile,
		github: override.github ?? base.github,
		projects: override.projects ?? base.projects,
		skills: override.skills ?? base.skills,
		experience: override.experience ?? base.experience,
		awards: override.awards ?? base.awards,
		nowEntries: override.nowEntries ?? base.nowEntries,
		links: override.links ?? base.links,
		theme: override.theme ?? base.theme,
	};
}

/**
 * Returns content used by public routes with runtime fallback support.
 */
export async function getSiteContent(): Promise<SiteContent> {
	const runtimeContent = await readRuntimeContent();
	if (!runtimeContent) {
		return defaultSiteContent;
	}
	return mergeSiteContent(defaultSiteContent, runtimeContent);
}

/**
 * Persists a complete content payload for console-driven updates.
 */
export async function saveSiteContent(content: SiteContent): Promise<void> {
	await fs.writeFile(runtimeContentFilePath, JSON.stringify(content, null, "\t"), "utf8");
}

/**
 * Writes contact submissions into a JSON file as the chosen storage backend.
 */
export async function saveContactSubmission(payload: {
	name: string;
	email: string;
	subject: string;
	message: string;
}): Promise<void> {
	const submission = {
		...payload,
		submittedAt: new Date().toISOString(),
	};

	let current: unknown[] = [];
	try {
		const raw = await fs.readFile(contactSubmissionFilePath, "utf8");
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			current = parsed;
		}
	} catch {
		current = [];
	}

	current.push(submission);
	await fs.writeFile(contactSubmissionFilePath, JSON.stringify(current, null, "\t"), "utf8");
}
