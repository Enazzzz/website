import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultSiteContent } from "@/data/site";
import type { SiteContent } from "@/data/types";

const runtimeContentFilePath = path.join(process.cwd(), "data", "runtime-content.json");
const contactSubmissionFilePath = path.join(process.cwd(), "data", "contact-submissions.json");

const KV_SITE_CONTENT_KEY = "site-content";
const KV_CONTACT_SUBMISSIONS_KEY = "contact-submissions";

/** True when KV env vars are set (e.g. on Vercel with Redis/KV integration). */
function isKvConfigured(): boolean {
	return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/** Lazy KV client to avoid requiring env vars at build time. */
async function getKv() {
	const { kv } = await import("@vercel/kv");
	return kv;
}

/**
 * Reads runtime content from KV if configured, otherwise from file if it exists and is valid JSON.
 */
async function readRuntimeContent(): Promise<Partial<SiteContent> | null> {
	if (isKvConfigured()) {
		try {
			const kv = await getKv();
			const stored = await kv.get<Partial<SiteContent>>(KV_SITE_CONTENT_KEY);
			return stored ?? null;
		} catch {
			return null;
		}
	}
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
/** Merges theme so partial runtime overrides (e.g. font only) work. */
function mergeBackgroundGradient(
	base: SiteContent["theme"]["backgroundGradient"],
	override: Partial<SiteContent["theme"]["backgroundGradient"]> | undefined
): SiteContent["theme"]["backgroundGradient"] {
	if (!override) return base;
	return {
		enabled: override.enabled ?? base.enabled,
		radius1: override.radius1 ?? base.radius1,
		radius2: override.radius2 ?? base.radius2,
		position1: override.position1 ?? base.position1,
		position2: override.position2 ?? base.position2,
		opacity1: override.opacity1 ?? base.opacity1,
		opacity2: override.opacity2 ?? base.opacity2,
	};
}

function mergeTheme(base: SiteContent["theme"], override: Partial<SiteContent["theme"]> | undefined): SiteContent["theme"] {
	if (!override) return base;
	return {
		bg: override.bg ?? base.bg,
		surface: override.surface ?? base.surface,
		text: override.text ?? base.text,
		accent: override.accent ?? base.accent,
		accentAlt: override.accentAlt ?? base.accentAlt,
		border: override.border ?? base.border,
		font: override.font ?? base.font,
		backgroundGradient: mergeBackgroundGradient(base.backgroundGradient, override.backgroundGradient),
	};
}

function mergeSite(base: SiteContent["site"], override: Partial<SiteContent["site"]> | undefined): SiteContent["site"] {
	if (!override) return base;
	return {
		siteTitle: override.siteTitle ?? base.siteTitle,
		iconText: override.iconText ?? base.iconText,
		faviconUrl: override.faviconUrl ?? base.faviconUrl,
	};
}

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
		theme: mergeTheme(base.theme, override.theme),
		site: mergeSite(base.site, override.site),
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
 * Uses Vercel KV when KV_REST_API_URL + KV_REST_API_TOKEN are set (e.g. on Vercel); otherwise writes to data/runtime-content.json.
 */
export async function saveSiteContent(content: SiteContent): Promise<void> {
	if (isKvConfigured()) {
		const kv = await getKv();
		await kv.set(KV_SITE_CONTENT_KEY, content);
		return;
	}
	await fs.writeFile(runtimeContentFilePath, JSON.stringify(content, null, "\t"), "utf8");
}

/**
 * Writes contact submissions into KV (when configured) or data/contact-submissions.json.
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

	if (isKvConfigured()) {
		const kv = await getKv();
		const current = (await kv.get<unknown[]>(KV_CONTACT_SUBMISSIONS_KEY)) ?? [];
		current.push(submission);
		await kv.set(KV_CONTACT_SUBMISSIONS_KEY, current);
		return;
	}

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
