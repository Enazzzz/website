import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NowMarkdownContent } from "@/components/NowMarkdownContent";
import { getSiteContent } from "@/lib/content-store";

/**
 * Dedicated page for dated status updates.
 */
export default async function NowPage() {
	const content = await getSiteContent();
	const entries = [...content.nowEntries].sort((a, b) => b.date.localeCompare(a.date));

	return (
		<div className="page-content-bg min-h-screen">
			<Header
				links={content.links}
				siteTitle={content.site?.siteTitle ?? content.profile.name}
				iconText={content.site?.iconText}
			/>
			<main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-20">
				<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Now</p>
				<h1 className="mt-2 text-4xl font-black text-white md:text-5xl">What I am doing now</h1>
				<p className="mt-3 text-base text-white/70">Short dated updates. Newest entries show first.</p>
				<div className="mt-12 grid gap-6 md:gap-8">
					{entries.map((entry, i) => (
						<article
							key={entry.id}
							className="section-card min-h-[180px] p-6 md:min-h-[220px] md:p-8"
						>
							<p className="text-sm uppercase tracking-[0.12em] text-white/60">{entry.date}</p>
							<div className="mt-4 text-base leading-8 text-white/90 md:text-lg md:leading-9 [&>*]:text-inherit [&>*]:leading-inherit">
								<NowMarkdownContent content={entry.content} />
							</div>
						</article>
					))}
				</div>
				<Link href="/" className="mt-12 inline-block text-sm text-[color:var(--accent-alt)] hover:underline">
					Back to portfolio home
				</Link>
			</main>
			<Footer links={content.links} />
		</div>
	);
}
