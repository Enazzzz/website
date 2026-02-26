import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content-store";

/**
 * Dedicated page for dated status updates.
 */
export default async function NowPage() {
	const content = await getSiteContent();
	const entries = [...content.nowEntries].sort((a, b) => b.date.localeCompare(a.date));

	return (
		<div className="min-h-screen bg-[color:var(--bg)]">
			<Header links={content.links} />
			<main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
				<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Now</p>
				<h1 className="mt-2 text-4xl font-black text-white">What I am doing now</h1>
				<p className="mt-3 text-sm text-white/70">Short dated updates. Newest entries show first.</p>
				<div className="mt-8 grid gap-4">
					{entries.map((entry) => (
						<article key={entry.id} className="section-card">
							<p className="text-xs uppercase tracking-[0.12em] text-white/60">{entry.date}</p>
							<p className="mt-3 text-sm leading-7 text-white/80">{entry.content}</p>
						</article>
					))}
				</div>
				<Link href="/" className="mt-8 inline-block text-sm text-[color:var(--accent-alt)] hover:underline">
					Back to portfolio home
				</Link>
			</main>
			<Footer links={content.links} />
		</div>
	);
}
