"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { SiteContent } from "@/data/types";

/**
 * Basic admin console for full content CRUD using JSON editing.
 */
export default function ConsolePage() {
	const [adminPassword, setAdminPassword] = useState("");
	const [contentText, setContentText] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const parsedState = useMemo(() => {
		try {
			JSON.parse(contentText);
			return { isValid: true };
		} catch {
			return { isValid: false };
		}
	}, [contentText]);

	/**
	 * Loads current content from the API route.
	 */
	useEffect(() => {
		void (async () => {
			try {
				const response = await fetch("/api/content");
				if (!response.ok) {
					throw new Error("Unable to load content");
				}
				const payload = (await response.json()) as SiteContent;
				setContentText(JSON.stringify(payload, null, "\t"));
				setStatus("idle");
			} catch {
				setErrorMessage("Could not load content.");
				setStatus("error");
			}
		})();
	}, []);

	/**
	 * Saves edited JSON back to runtime content storage.
	 */
	async function saveChanges() {
		setErrorMessage(null);
		if (!parsedState.isValid) {
			setErrorMessage("JSON is invalid. Fix formatting before saving.");
			setStatus("error");
			return;
		}
		setStatus("saving");
		try {
			const response = await fetch("/api/content", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-admin-password": adminPassword,
				},
				body: contentText,
			});

			if (!response.ok) {
				const payload = (await response.json()) as { error?: string };
				throw new Error(payload.error ?? "Save failed");
			}
			setStatus("success");
		} catch (error) {
			setStatus("error");
			setErrorMessage(error instanceof Error ? error.message : "Save failed");
		}
	}

	return (
		<div className="min-h-screen bg-[color:var(--bg)]">
			<main className="mx-auto w-full max-w-5xl px-6 py-12">
				<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Admin Console</p>
				<h1 className="mt-2 text-4xl font-bold text-white">Content editor (Phase 2)</h1>
				<p className="mt-3 text-sm leading-7 text-white/75">
					Edit all content in one place, then save to runtime storage. This avoids rebuilds for normal content updates.
				</p>
				<div className="mt-6 grid gap-3 section-card">
					<label className="text-sm text-white/75" htmlFor="admin-password">
						Admin password (only required if ADMIN_PASSWORD is configured)
					</label>
					<input
						id="admin-password"
						type="password"
						value={adminPassword}
						onChange={(event) => setAdminPassword(event.target.value)}
						className="input-field"
						placeholder="Enter admin password"
					/>
					<textarea
						value={contentText}
						onChange={(event) => setContentText(event.target.value)}
						className="input-field min-h-[420px] font-mono text-xs"
						aria-label="Site content JSON"
					/>
					<div className="flex flex-wrap items-center gap-3">
						<button type="button" onClick={saveChanges} className="button-main" disabled={status === "saving" || status === "loading"}>
							{status === "saving" ? "Saving..." : "Save content"}
						</button>
						<span className="text-xs text-white/60">
							JSON status: {parsedState.isValid ? "valid" : "invalid"}
						</span>
					</div>
					{status === "success" ? <p className="text-sm text-green-300">Saved successfully.</p> : null}
					{errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}
				</div>
				<Link href="/" className="mt-8 inline-block text-sm text-[color:var(--accent-alt)] hover:underline">
					Back to portfolio home
				</Link>
			</main>
		</div>
	);
}
