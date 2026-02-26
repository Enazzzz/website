import type { LinkEntry } from "@/data/types";

/**
 * Top navigation with creative section labels.
 * Uses siteTitle and iconText from console (Site section) so the header updates without rebuild.
 */
export function Header({
	links,
	siteTitle = "Portfolio Hub",
	iconText = "PH",
}: {
	links: LinkEntry[];
	/** Browser/site name shown next to the logo (editable in Console → Site). */
	siteTitle?: string;
	/** 1–3 chars shown in the logo badge (editable in Console → Site). */
	iconText?: string;
}) {
	const badge = (iconText || "PH").slice(0, 3);
	return (
		<header className="header-bar sticky top-0 z-30 border-b border-white/10">
			<div className="header-bar-inner" aria-hidden />
			<div className="header-bar-content mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
				<a href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
					<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-alt)] text-[11px] font-black text-black">
						{badge}
					</span>
					{siteTitle}
				</a>
				<nav aria-label="Primary" className="hidden gap-4 text-sm text-white/80 md:flex">
					<a href="#what-i-build" className="transition hover:text-[color:var(--accent)]">
						What I Build
					</a>
					<a href="#the-journey" className="transition hover:text-[color:var(--accent)]">
						The Journey
					</a>
					<a href="#wins" className="transition hover:text-[color:var(--accent)]">
						Wins
					</a>
					<a href="#say-hi" className="transition hover:text-[color:var(--accent)]">
						Say hi
					</a>
					<a href="/now" className="transition hover:text-[color:var(--accent)]">
						Now
					</a>
					<a href="/console" className="transition hover:text-[color:var(--accent)]">
						Console
					</a>
				</nav>
				<div className="flex items-center gap-2">
					{links.slice(0, 2).map((link) => (
						<a
							key={link.id}
							href={link.url}
							target="_blank"
							rel="noreferrer"
							className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
						>
							{link.label}
						</a>
					))}
					{/* Resume placeholder: uncomment and set href when the resume is ready. */}
					{/* <a href="/resume.pdf" className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">Resume</a> */}
				</div>
			</div>
		</header>
	);
}
