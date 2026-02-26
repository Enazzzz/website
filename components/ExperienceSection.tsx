import type { ExperienceEntry } from "@/data/types";

/**
 * Renders experience content as cards, not a timeline.
 */
export function ExperienceSection({ items }: { items: ExperienceEntry[] }) {
	return (
		<section id="the-journey" className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
			<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">The Journey</p>
			<h2 className="mt-2 text-3xl font-bold text-white">Experience cards</h2>
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				{items.map((item) => (
					<article key={item.id} className="section-card">
						<p className="text-xs uppercase tracking-[0.12em] text-white/60">{item.period}</p>
						<h3 className="mt-2 text-xl font-semibold text-white">{item.role}</h3>
						<p className="mt-1 text-sm text-white/70">{item.organization}</p>
						<p className="mt-4 text-sm leading-7 text-white/75">{item.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}
