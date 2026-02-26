"use client";

import { useState } from "react";

type FormState = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

/**
 * Contact form that stores submissions through the API route.
 */
export function ContactForm() {
	const [form, setForm] = useState<FormState>({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

	/**
	 * Updates a single form field.
	 */
	function setField(field: keyof FormState, value: string): void {
		setForm((previous) => ({ ...previous, [field]: value }));
	}

	/**
	 * Sends the submission to the backend storage endpoint.
	 */
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("saving");
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!response.ok) {
				throw new Error("Request failed");
			}
			setStatus("success");
			setForm({ name: "", email: "", subject: "", message: "" });
		} catch {
			setStatus("error");
		}
	}

	return (
		<section id="say-hi" className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
			<div className="section-card">
				<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Say hi</p>
				<h2 className="mt-2 text-3xl font-bold text-white">Let us connect</h2>
				<p className="mt-2 text-sm text-white/70">Send a message. It gets saved so I can review it later.</p>
				<form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
					<input
						required
						value={form.name}
						onChange={(event) => setField("name", event.target.value)}
						placeholder="Name"
						className="input-field"
					/>
					<input
						required
						type="email"
						value={form.email}
						onChange={(event) => setField("email", event.target.value)}
						placeholder="Email"
						className="input-field"
					/>
					<input
						required
						value={form.subject}
						onChange={(event) => setField("subject", event.target.value)}
						placeholder="Subject"
						className="input-field"
					/>
					<textarea
						required
						value={form.message}
						onChange={(event) => setField("message", event.target.value)}
						placeholder="Message"
						rows={5}
						className="input-field"
					/>
					<button type="submit" className="button-main w-fit" disabled={status === "saving"}>
						{status === "saving" ? "Sending..." : "Send message"}
					</button>
					{status === "success" ? <p className="text-sm text-green-300">Message saved. Thanks!</p> : null}
					{status === "error" ? <p className="text-sm text-red-300">Unable to save. Please retry.</p> : null}
				</form>
			</div>
		</section>
	);
}
