"use client";

import { useMemo, useState } from "react";

import type { Project, ProjectType } from "@/data/types";

const filters: Array<{ id: ProjectType | "all"; label: string }> = [
	{ id: "all", label: "All" },
	{ id: "code", label: "Code" },
	{ id: "design", label: "Design" },
	{ id: "writing", label: "Writing" },
	{ id: "other", label: "Other" },
];

/**
 * Project grid with type-based tab filtering.
 */
export function ProjectsSection({ projects }: { projects: Project[] }) {
	const [selected, setSelected] = useState<ProjectType | "all">("all");

	const visibleProjects = useMemo(() => {
		if (selected === "all") {
			return projects;
		}
		return projects.filter((project) => project.type === selected);
	}, [projects, selected]);

	return (
		<section id="what-i-build" className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">What I Build</p>
					<h2 className="mt-2 text-3xl font-bold text-white">Projects in every format</h2>
				</div>
				<div className="flex flex-wrap gap-2">
					{filters.map((filter) => (
						<button
							key={filter.id}
							type="button"
							onClick={() => setSelected(filter.id)}
							className={`rounded-full border px-3 py-1 text-sm transition ${
								selected === filter.id
									? "border-[color:var(--accent)] bg-[color:var(--accent)]/20 text-[color:var(--accent)]"
									: "border-white/20 text-white/80 hover:border-[color:var(--accent)]"
							}`}
						>
							{filter.label}
						</button>
					))}
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				{visibleProjects.map((project) => (
					<article key={project.id} className="section-card">
						<div className="mb-4 flex items-start justify-between gap-3">
							<h3 className="text-xl font-semibold text-white">{project.title}</h3>
							<span className="rounded-full border border-white/20 px-2 py-1 text-xs uppercase text-white/70">
								{project.type}
							</span>
						</div>
						{project.imageUrl ? (
							<img
								src={project.imageUrl}
								alt={`${project.title} preview`}
								className="mb-4 h-36 w-full rounded-lg object-cover"
							/>
						) : null}
						<p className="text-sm leading-7 text-white/75">{project.description}</p>
						<div className="mt-4 flex flex-wrap gap-2">
							{project.tech.map((item) => (
								<span
									key={`${project.id}-${item}`}
									className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80"
								>
									{item}
								</span>
							))}
						</div>
						<div className="mt-4 flex flex-wrap gap-3 text-sm">
							{project.links.repository ? (
								<a href={project.links.repository} target="_blank" rel="noreferrer" className="link-action">
									Repo
								</a>
							) : null}
							{project.links.demo ? (
								<a href={project.links.demo} target="_blank" rel="noreferrer" className="link-action">
									Demo
								</a>
							) : null}
							{project.links.article ? (
								<a href={project.links.article} target="_blank" rel="noreferrer" className="link-action">
									Article
								</a>
							) : null}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
