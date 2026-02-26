import { NextResponse } from "next/server";

import { saveContactSubmission } from "@/lib/content-store";
import type { ContactSubmission } from "@/data/types";

/**
 * Stores contact form messages in the chosen backend (JSON file).
 */
export async function POST(request: Request) {
	try {
		const payload = (await request.json()) as ContactSubmission;
		if (!payload.name || !payload.email || !payload.subject || !payload.message) {
			return NextResponse.json({ error: "All fields are required." }, { status: 400 });
		}

		await saveContactSubmission(payload);
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: "Unable to save submission." }, { status: 500 });
	}
}
