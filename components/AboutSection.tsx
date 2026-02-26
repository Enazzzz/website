import type { ProfileContent } from "@/data/types";

/**
 * About block with short profile details.
 */
export function AboutSection({ profile }: { profile: ProfileContent }) {
	return (
		<section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
			<div className="section-card">
				<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">About</p>
				<h2 className="mt-2 text-3xl font-bold text-white">A bit about me</h2>
				<p className="mt-4 text-sm leading-7 text-white/80">{profile.bio}</p>
				<div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
					<span>{profile.location}</span>
					<a className="hover:text-[color:var(--accent)]" href={`mailto:${profile.email}`}>
						{profile.email}
					</a>
				</div>
			</div>
		</section>
	);
}
