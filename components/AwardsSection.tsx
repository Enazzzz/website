import type { Award } from "@/data/types";

/**
 * Shows awards as colorful badge-style cards.
 */
export function AwardsSection({ awards }: { awards: Award[] }) {
	return (
		<section id="wins" className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
			<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Wins</p>
			<h2 className="mt-2 text-3xl font-bold text-white">Awards and highlights</h2>
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				{awards.map((award) => (
					<article key={award.id} className="section-card border-[color:var(--accent)]/30">
						<div className="flex items-start justify-between gap-4">
							<h3 className="text-lg font-semibold text-white">{award.name}</h3>
							{award.date ? (
								<span className="rounded-full bg-[color:var(--accent)]/20 px-2 py-1 text-xs text-[color:var(--accent)]">
									{award.date}
								</span>
							) : null}
						</div>
						{award.issuer ? <p className="mt-2 text-sm text-white/70">{award.issuer}</p> : null}
						{award.description ? <p className="mt-3 text-sm leading-7 text-white/75">{award.description}</p> : null}
						{award.link ? (
							<a href={award.link} target="_blank" rel="noreferrer" className="link-action mt-4 inline-block">
								View details
							</a>
						) : null}
					</article>
				))}
			</div>
		</section>
	);
}
