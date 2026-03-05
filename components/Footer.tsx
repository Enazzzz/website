import type { LinkEntry } from "@/data/types";

/**
 * Footer section with external links.
 */
export function Footer({ links }: { links: LinkEntry[] }) {
	return (
		<footer className="footer-frosted border-t border-white/10 py-8">
			<div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
				<p className="text-sm text-white/60">Built with Next.js and a lot of color.</p>
				<div className="flex flex-wrap gap-3">
					{links.map((link) => (
						<a
							key={link.id}
							href={link.url}
							target="_blank"
							rel="noreferrer"
							className="text-sm text-white/80 transition hover:text-[color:var(--accent)]"
						>
							{link.label}
						</a>
					))}
				</div>
			</div>
		</footer>
	);
}
