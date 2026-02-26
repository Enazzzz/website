"use client";

import type { ConsoleSectionId, ConsoleSectionOption } from "@/components/console/types";

/**
 * Left sidebar used to navigate editable console sections.
 */
export function ConsoleSidebar({
	options,
	activeSection,
	onSectionChange,
}: {
	options: ConsoleSectionOption[];
	activeSection: ConsoleSectionId;
	onSectionChange: (section: ConsoleSectionId) => void;
}) {
	return (
		<aside className="section-card h-fit md:sticky md:top-6">
			<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Sections</p>
			<nav className="mt-4 grid gap-2" aria-label="Console sections">
				{options.map((option) => (
					<button
						key={option.id}
						type="button"
						onClick={() => onSectionChange(option.id)}
						className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
							activeSection === option.id
								? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-white"
								: "border-white/15 text-white/75 hover:border-[color:var(--accent)]/70 hover:text-white"
						}`}
					>
						{option.label}
					</button>
				))}
			</nav>
		</aside>
	);
}
