import type { SkillCategory } from "@/data/types";

/**
 * Displays grouped skills with optional mini icon labels.
 */
export function SkillsSection({ categories }: { categories: SkillCategory[] }) {
	return (
		<section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
			<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Toolbox</p>
			<h2 className="mt-2 text-3xl font-bold text-white">What I reach for often</h2>
			<div className="mt-6 grid gap-4 md:grid-cols-3">
				{categories.map((category) => (
					<div key={category.id} className="section-card">
						<h3 className="text-lg font-semibold text-white">{category.title}</h3>
						<div className="mt-4 flex flex-wrap gap-2">
							{category.skills.map((skill) => (
								<span key={skill.id} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
									{skill.icon ? (
										<span className="rounded-md bg-black/30 px-1.5 py-0.5 text-[10px] tracking-wide text-[color:var(--accent)]">
											{skill.icon}
										</span>
									) : null}
									{skill.name}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
