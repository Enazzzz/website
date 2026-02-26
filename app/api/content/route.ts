import { NextResponse } from "next/server";

import { getSiteContent, saveSiteContent } from "@/lib/content-store";
import type { SiteContent } from "@/data/types";

/**
 * Reads public content with runtime fallback support.
 */
export async function GET() {
	const content = await getSiteContent();
	const response = NextResponse.json(content);
	response.headers.set("x-console-password-required", process.env.ADMIN_PASSWORD ? "true" : "false");
	return response;
}

/**
 * Verifies console access credentials without mutating content.
 */
export async function POST(request: Request) {
	const configuredPassword = process.env.ADMIN_PASSWORD;
	const providedPassword = request.headers.get("x-admin-password");

	if (configuredPassword && providedPassword !== configuredPassword) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({ ok: true });
}

/**
 * Handles full-content updates from the admin console.
 */
export async function PUT(request: Request) {
	const configuredPassword = process.env.ADMIN_PASSWORD;
	const providedPassword = request.headers.get("x-admin-password");

	if (configuredPassword && providedPassword !== configuredPassword) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const payload = (await request.json()) as SiteContent;
		await saveSiteContent(payload);
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
}
