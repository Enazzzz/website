import Image from "next/image";

import type { GithubProfile, ProfileContent } from "@/data/types";

/**
 * Hero section with optional GitHub profile card.
 */
export function Hero({
	profile,
	github,
}: {
	profile: ProfileContent;
	github: GithubProfile;
}) {
	return (
		<section id="top" className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 md:grid-cols-[2fr_1fr] md:py-20">
			<div className="section-card fade-in-up">
				<p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">Hey, welcome</p>
				<h1 className="mt-3 text-4xl font-black text-white md:text-6xl">{profile.name}</h1>
				<p className="mt-4 max-w-2xl text-lg text-white/85">{profile.tagline}</p>
				<p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">{profile.bio}</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<a href="#what-i-build" className="button-main">
						View my work
					</a>
					<a href="#say-hi" className="button-secondary">
						Say hi
					</a>
				</div>
			</div>
			<aside className="section-card fade-in-up" aria-label="GitHub profile">
				<div className="flex items-center gap-3">
					<Image
						src={github.avatarUrl}
						alt={`${github.username} avatar`}
						width={56}
						height={56}
						className="rounded-full border border-white/20"
					/>
					<div>
						<p className="text-xs uppercase tracking-[0.12em] text-white/60">GitHub</p>
						<p className="font-semibold text-white">{github.username}</p>
					</div>
				</div>
				<p className="mt-4 text-sm text-white/75">{github.statsNote}</p>
				<a
					href={github.profileUrl}
					target="_blank"
					rel="noreferrer"
					className="mt-5 inline-block text-sm font-medium text-[color:var(--accent)] hover:underline"
				>
					Open profile
				</a>
			</aside>
		</section>
	);
}
