"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ConsoleLogin } from "@/components/console/ConsoleLogin";
import { ConsoleSidebar } from "@/components/console/ConsoleSidebar";
import { SortableList } from "@/components/console/SortableList";
import { consoleSectionOptions, type ConsoleSectionId } from "@/components/console/types";
import type {
	Award,
	ExperienceEntry,
	GithubProfile,
	LinkEntry,
	NowEntry,
	ProfileContent,
	Project,
	ProjectType,
	SiteContent,
	SkillCategory,
	ThemeSettings,
} from "@/data/types";
import { projectTemplates, themePresets } from "@/lib/console-templates";

type SaveState = "idle" | "saving" | "success" | "error";
type LoadState = "loading" | "ready" | "error";

const authFlagStorageKey = "console_authenticated";
const authPasswordStorageKey = "console_password";

/**
 * Creates short stable ids for newly added items.
 */
function createClientId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Converts CSV input into a string array.
 */
function parseCommaValues(value: string): string[] {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

/**
 * Main console page with section-based form editors.
 */
export default function ConsolePage() {
	const [content, setContent] = useState<SiteContent | null>(null);
	const [activeSection, setActiveSection] = useState<ConsoleSectionId>("profile");
	const [loadState, setLoadState] = useState<LoadState>("loading");
	const [saveState, setSaveState] = useState<SaveState>("idle");
	const [saveMessage, setSaveMessage] = useState<string | null>(null);
	const [requiresPassword, setRequiresPassword] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");
	const [authError, setAuthError] = useState<string | null>(null);

	/**
	 * Loads content and determines whether password auth is required.
	 */
	useEffect(() => {
		void (async () => {
			try {
				const cachedPassword = sessionStorage.getItem(authPasswordStorageKey) ?? "";
				const cachedAuthFlag = sessionStorage.getItem(authFlagStorageKey) === "true";
				setAdminPassword(cachedPassword);

				const response = await fetch("/api/content");
				if (!response.ok) {
					throw new Error("Unable to load content.");
				}

				const nextContent = (await response.json()) as SiteContent;
				const passwordRequired = response.headers.get("x-console-password-required") === "true";
				setRequiresPassword(passwordRequired);
				setIsAuthenticated(passwordRequired ? cachedAuthFlag && cachedPassword.length > 0 : true);
				setContent(nextContent);
				setLoadState("ready");
			} catch {
				setLoadState("error");
				setSaveMessage("Unable to load content for the console.");
			}
		})();
	}, []);

	/**
	 * Updates content and clears stale save state messages.
	 */
	const updateContent = useCallback((updater: (current: SiteContent) => SiteContent) => {
		setContent((current) => {
			if (!current) {
				return current;
			}
			return updater(current);
		});
		setSaveState("idle");
		setSaveMessage(null);
	}, []);

	/**
	 * Verifies password access and unlocks the console.
	 */
	const handleLogin = useCallback(async () => {
		if (!adminPassword.trim()) {
			setAuthError("Please enter the admin password.");
			return;
		}
		setIsSigningIn(true);
		setAuthError(null);
		try {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"x-admin-password": adminPassword,
				},
			});
			if (!response.ok) {
				throw new Error("Incorrect password.");
			}
			sessionStorage.setItem(authFlagStorageKey, "true");
			sessionStorage.setItem(authPasswordStorageKey, adminPassword);
			setIsAuthenticated(true);
		} catch {
			setAuthError("Incorrect password. Please try again.");
		} finally {
			setIsSigningIn(false);
		}
	}, [adminPassword]);

	/**
	 * Clears local auth cache and returns to login view.
	 */
	const handleLogout = useCallback(() => {
		sessionStorage.removeItem(authFlagStorageKey);
		sessionStorage.removeItem(authPasswordStorageKey);
		setIsAuthenticated(false);
		setAuthError(null);
	}, []);

	/**
	 * Saves the complete content payload to runtime storage.
	 */
	const saveChanges = useCallback(async () => {
		if (!content) {
			return;
		}
		setSaveState("saving");
		setSaveMessage(null);
		try {
			const response = await fetch("/api/content", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-admin-password": adminPassword,
				},
				body: JSON.stringify(content),
			});

			if (response.status === 401) {
				handleLogout();
				setSaveState("error");
				setSaveMessage("Session expired. Log in again to save changes.");
				return;
			}
			if (!response.ok) {
				const payload = (await response.json()) as { error?: string };
				throw new Error(payload.error ?? "Unable to save changes.");
			}

			setSaveState("success");
			setSaveMessage("Saved successfully.");
		} catch (error) {
			setSaveState("error");
			setSaveMessage(error instanceof Error ? error.message : "Unable to save changes.");
		}
	}, [adminPassword, content, handleLogout]);

	/**
	 * Adds Ctrl/Cmd+S support to save from the keyboard.
	 */
	useEffect(() => {
		if (!isAuthenticated) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
				event.preventDefault();
				void saveChanges();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isAuthenticated, saveChanges]);

	const activeSectionLabel = useMemo(
		() => consoleSectionOptions.find((option) => option.id === activeSection)?.label ?? "Section",
		[activeSection],
	);

	if (loadState === "loading") {
		return (
			<div className="min-h-screen bg-[color:var(--bg)] px-6 py-12">
				<main className="mx-auto w-full max-w-2xl section-card">
					<p className="text-sm text-white/70">Loading console data...</p>
				</main>
			</div>
		);
	}

	if (loadState === "error" || !content) {
		return (
			<div className="min-h-screen bg-[color:var(--bg)] px-6 py-12">
				<main className="mx-auto w-full max-w-2xl section-card">
					<p className="text-sm text-red-300">{saveMessage ?? "Unable to load the console."}</p>
					<Link href="/" className="mt-4 inline-block text-sm text-[color:var(--accent-alt)] hover:underline">
						Return to website
					</Link>
				</main>
			</div>
		);
	}

	if (requiresPassword && !isAuthenticated) {
		return (
			<ConsoleLogin
				password={adminPassword}
				onPasswordChange={setAdminPassword}
				onSubmit={() => {
					void handleLogin();
				}}
				errorMessage={authError}
				isSubmitting={isSigningIn}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[color:var(--bg)] px-6 py-8">
			<main className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
				<ConsoleSidebar
					options={consoleSectionOptions}
					activeSection={activeSection}
					onSectionChange={setActiveSection}
				/>
				<section className="grid gap-4">
					<div className="section-card flex flex-wrap items-center justify-between gap-3">
						<div>
							<p className="text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Admin Console</p>
							<h1 className="mt-1 text-2xl font-bold text-white">{activeSectionLabel}</h1>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Link href="/" target="_blank" className="button-secondary">
								View site
							</Link>
							{requiresPassword ? (
								<button type="button" className="button-secondary" onClick={handleLogout}>
									Log out
								</button>
							) : null}
							<button type="button" className="button-main" onClick={() => void saveChanges()} disabled={saveState === "saving"}>
								{saveState === "saving" ? "Saving..." : "Save changes"}
							</button>
						</div>
					</div>
					{saveMessage ? (
						<p className={`text-sm ${saveState === "error" ? "text-red-300" : "text-green-300"}`}>{saveMessage}</p>
					) : null}

					{activeSection === "profile" ? (
						<ProfileSectionEditor
							value={content.profile}
							onChange={(value) => updateContent((current) => ({ ...current, profile: value }))}
						/>
					) : null}
					{activeSection === "github" ? (
						<GithubSectionEditor
							value={content.github}
							onChange={(value) => updateContent((current) => ({ ...current, github: value }))}
						/>
					) : null}
					{activeSection === "projects" ? (
						<ProjectsSectionEditor
							value={content.projects}
							onChange={(value) => updateContent((current) => ({ ...current, projects: value }))}
						/>
					) : null}
					{activeSection === "skills" ? (
						<SkillsSectionEditor
							value={content.skills}
							onChange={(value) => updateContent((current) => ({ ...current, skills: value }))}
						/>
					) : null}
					{activeSection === "experience" ? (
						<ExperienceSectionEditor
							value={content.experience}
							onChange={(value) => updateContent((current) => ({ ...current, experience: value }))}
						/>
					) : null}
					{activeSection === "awards" ? (
						<AwardsSectionEditor
							value={content.awards}
							onChange={(value) => updateContent((current) => ({ ...current, awards: value }))}
						/>
					) : null}
					{activeSection === "now" ? (
						<NowSectionEditor
							value={content.nowEntries}
							onChange={(value) => updateContent((current) => ({ ...current, nowEntries: value }))}
						/>
					) : null}
					{activeSection === "links" ? (
						<LinksSectionEditor
							value={content.links}
							onChange={(value) => updateContent((current) => ({ ...current, links: value }))}
						/>
					) : null}
					{activeSection === "theme" ? (
						<ThemeSectionEditor
							value={content.theme}
							onChange={(value) => updateContent((current) => ({ ...current, theme: value }))}
						/>
					) : null}
				</section>
			</main>
		</div>
	);
}

/**
 * Profile form editor.
 */
function ProfileSectionEditor({
	value,
	onChange,
}: {
	value: ProfileContent;
	onChange: (value: ProfileContent) => void;
}) {
	return (
		<div className="section-card grid gap-3">
			<EditorTextField label="Name" value={value.name} onChange={(next) => onChange({ ...value, name: next })} />
			<EditorTextField label="Tagline" value={value.tagline} onChange={(next) => onChange({ ...value, tagline: next })} />
			<EditorTextArea label="Bio" value={value.bio} onChange={(next) => onChange({ ...value, bio: next })} />
			<EditorTextField label="Location" value={value.location} onChange={(next) => onChange({ ...value, location: next })} />
			<EditorTextField label="Email" value={value.email} onChange={(next) => onChange({ ...value, email: next })} />
		</div>
	);
}

/**
 * GitHub profile form editor.
 */
function GithubSectionEditor({
	value,
	onChange,
}: {
	value: GithubProfile;
	onChange: (value: GithubProfile) => void;
}) {
	return (
		<div className="section-card grid gap-3">
			<EditorTextField
				label="Username"
				value={value.username}
				onChange={(next) => onChange({ ...value, username: next })}
			/>
			<EditorTextField
				label="Profile URL"
				value={value.profileUrl}
				onChange={(next) => onChange({ ...value, profileUrl: next })}
			/>
			<EditorTextField
				label="Avatar URL"
				value={value.avatarUrl}
				onChange={(next) => onChange({ ...value, avatarUrl: next })}
			/>
			<EditorTextArea
				label="Stats note"
				value={value.statsNote}
				onChange={(next) => onChange({ ...value, statsNote: next })}
			/>
		</div>
	);
}

/**
 * Projects editor with templates, CRUD, and reorder.
 */
function ProjectsSectionEditor({
	value,
	onChange,
}: {
	value: Project[];
	onChange: (value: Project[]) => void;
}) {
	const [draft, setDraft] = useState<Project | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [techCsv, setTechCsv] = useState("");

	/**
	 * Opens the editor with a fresh project created from template.
	 */
	function startNewProject(templateId?: string): void {
		const template = projectTemplates.find((candidate) => candidate.id === templateId);
		const nextDraft = template
			? template.createProject()
			: {
					id: createClientId("project"),
					title: "",
					description: "",
					type: "code" as ProjectType,
					tech: [],
					links: {},
			  };
		setEditingId(null);
		setDraft(nextDraft);
		setTechCsv(nextDraft.tech.join(", "));
	}

	/**
	 * Opens the editor with an existing project.
	 */
	function startEditingProject(project: Project): void {
		setEditingId(project.id);
		setDraft({ ...project, links: { ...project.links } });
		setTechCsv(project.tech.join(", "));
	}

	/**
	 * Saves the project draft into the collection.
	 */
	function commitProjectDraft(): void {
		if (!draft) {
			return;
		}
		const normalizedDraft: Project = {
			...draft,
			tech: parseCommaValues(techCsv),
			links: {
				repository: draft.links.repository?.trim() || undefined,
				demo: draft.links.demo?.trim() || undefined,
				article: draft.links.article?.trim() || undefined,
			},
			imageUrl: draft.imageUrl?.trim() || undefined,
		};

		if (editingId) {
			onChange(value.map((project) => (project.id === editingId ? normalizedDraft : project)));
		} else {
			onChange([...value, normalizedDraft]);
		}
		setDraft(null);
		setEditingId(null);
		setTechCsv("");
	}

	/**
	 * Removes a project after user confirmation.
	 */
	function removeProject(projectId: string): void {
		if (!window.confirm("Delete this project? This cannot be undone.")) {
			return;
		}
		onChange(value.filter((project) => project.id !== projectId));
	}

	return (
		<div className="section-card grid gap-4">
			<div className="flex flex-wrap items-center gap-2">
				<button type="button" className="button-main" onClick={() => startNewProject()}>
					Add project
				</button>
				{projectTemplates.map((template) => (
					<button
						key={template.id}
						type="button"
						className="button-secondary"
						onClick={() => startNewProject(template.id)}
					>
						Template: {template.label}
					</button>
				))}
			</div>
			<SortableList
				items={value}
				onReorder={onChange}
				emptyLabel="No projects yet. Add one with a template."
				renderItem={(project) => (
					<div className="grid gap-2">
						<p className="text-sm font-semibold text-white">{project.title || "Untitled project"}</p>
						<p className="text-xs uppercase tracking-[0.12em] text-white/60">{project.type}</p>
						<p className="text-sm text-white/75">{project.description}</p>
						<div className="flex flex-wrap gap-2">
							<button type="button" className="button-secondary" onClick={() => startEditingProject(project)}>
								Edit
							</button>
							<button type="button" className="button-secondary" onClick={() => removeProject(project.id)}>
								Delete
							</button>
						</div>
					</div>
				)}
			/>
			{draft ? (
				<div className="rounded-xl border border-white/15 bg-black/20 p-4">
					<p className="text-sm font-semibold text-white">{editingId ? "Edit project" : "Add project"}</p>
					<div className="mt-3 grid gap-3">
						<EditorTextField
							label="Title"
							value={draft.title}
							onChange={(next) => setDraft((current) => (current ? { ...current, title: next } : current))}
						/>
						<EditorTextArea
							label="Description"
							value={draft.description}
							onChange={(next) => setDraft((current) => (current ? { ...current, description: next } : current))}
						/>
						<EditorSelectField
							label="Type"
							value={draft.type}
							options={[
								{ id: "code", label: "Code" },
								{ id: "design", label: "Design" },
								{ id: "writing", label: "Writing" },
								{ id: "other", label: "Other" },
							]}
							onChange={(next) =>
								setDraft((current) => (current ? { ...current, type: next as ProjectType } : current))
							}
						/>
						<EditorTextField label="Tech (comma separated)" value={techCsv} onChange={setTechCsv} />
						<EditorTextField
							label="Image URL (optional)"
							value={draft.imageUrl ?? ""}
							onChange={(next) =>
								setDraft((current) => (current ? { ...current, imageUrl: next } : current))
							}
						/>
						<EditorTextField
							label="Repository URL (optional)"
							value={draft.links.repository ?? ""}
							onChange={(next) =>
								setDraft((current) =>
									current ? { ...current, links: { ...current.links, repository: next } } : current,
								)
							}
						/>
						<EditorTextField
							label="Demo URL (optional)"
							value={draft.links.demo ?? ""}
							onChange={(next) =>
								setDraft((current) =>
									current ? { ...current, links: { ...current.links, demo: next } } : current,
								)
							}
						/>
						<EditorTextField
							label="Article URL (optional)"
							value={draft.links.article ?? ""}
							onChange={(next) =>
								setDraft((current) =>
									current ? { ...current, links: { ...current.links, article: next } } : current,
								)
							}
						/>
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						<button type="button" className="button-main" onClick={commitProjectDraft}>
							Save project
						</button>
						<button
							type="button"
							className="button-secondary"
							onClick={() => {
								setDraft(null);
								setEditingId(null);
								setTechCsv("");
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}

/**
 * Skills editor with nested categories and nested reorder support.
 */
function SkillsSectionEditor({
	value,
	onChange,
}: {
	value: SkillCategory[];
	onChange: (value: SkillCategory[]) => void;
}) {
	/**
	 * Updates a specific category.
	 */
	function updateCategory(categoryId: string, updater: (category: SkillCategory) => SkillCategory): void {
		onChange(value.map((category) => (category.id === categoryId ? updater(category) : category)));
	}

	/**
	 * Removes a category after confirmation.
	 */
	function removeCategory(categoryId: string): void {
		if (!window.confirm("Delete this category and all its skills?")) {
			return;
		}
		onChange(value.filter((category) => category.id !== categoryId));
	}

	/**
	 * Adds a new skill category with one starter skill.
	 */
	function addCategory(): void {
		onChange([
			...value,
			{
				id: createClientId("skills"),
				title: "New Category",
				skills: [
					{
						id: createClientId("skill"),
						name: "New skill",
						icon: "",
					},
				],
			},
		]);
	}

	return (
		<div className="section-card grid gap-4">
			<button type="button" className="button-main w-fit" onClick={addCategory}>
				Add category
			</button>
			<SortableList
				items={value}
				onReorder={onChange}
				emptyLabel="No skill categories yet."
				renderItem={(category) => (
					<div className="grid gap-3">
						<div className="flex flex-wrap items-center gap-2">
							<EditorTextField
								label="Category title"
								value={category.title}
								onChange={(next) => updateCategory(category.id, (current) => ({ ...current, title: next }))}
							/>
							<button type="button" className="button-secondary" onClick={() => removeCategory(category.id)}>
								Delete category
							</button>
						</div>
						<button
							type="button"
							className="button-secondary w-fit"
							onClick={() =>
								updateCategory(category.id, (current) => ({
									...current,
									skills: [...current.skills, { id: createClientId("skill"), name: "New skill", icon: "" }],
								}))
							}
						>
							Add skill
						</button>
						<SortableList
							items={category.skills}
							onReorder={(skills) => updateCategory(category.id, (current) => ({ ...current, skills }))}
							emptyLabel="No skills in this category."
							renderItem={(skill) => (
								<div className="grid gap-2">
									<EditorTextField
										label="Skill name"
										value={skill.name}
										onChange={(next) =>
											updateCategory(category.id, (current) => ({
												...current,
												skills: current.skills.map((candidate) =>
													candidate.id === skill.id ? { ...candidate, name: next } : candidate,
												),
											}))
										}
									/>
									<EditorTextField
										label="Icon text (optional)"
										value={skill.icon ?? ""}
										onChange={(next) =>
											updateCategory(category.id, (current) => ({
												...current,
												skills: current.skills.map((candidate) =>
													candidate.id === skill.id ? { ...candidate, icon: next } : candidate,
												),
											}))
										}
									/>
									<button
										type="button"
										className="button-secondary w-fit"
										onClick={() =>
											updateCategory(category.id, (current) => ({
												...current,
												skills: current.skills.filter((candidate) => candidate.id !== skill.id),
											}))
										}
									>
										Delete skill
									</button>
								</div>
							)}
						/>
					</div>
				)}
			/>
		</div>
	);
}

/**
 * Experience editor with CRUD and reorder support.
 */
function ExperienceSectionEditor({
	value,
	onChange,
}: {
	value: ExperienceEntry[];
	onChange: (value: ExperienceEntry[]) => void;
}) {
	return (
		<ItemCollectionEditor
			title="Experience"
			items={value}
			onChange={onChange}
			createItem={() => ({
				id: createClientId("experience"),
				role: "New role",
				organization: "Organization",
				period: "2026 - Present",
				description: "Describe your role and impact.",
			})}
			renderSummary={(item) => (
				<div className="grid gap-1">
					<p className="font-semibold text-white">{item.role}</p>
					<p className="text-sm text-white/70">{item.organization}</p>
					<p className="text-xs uppercase tracking-[0.12em] text-white/60">{item.period}</p>
				</div>
			)}
			renderEditor={(item, setItem) => (
				<div className="grid gap-2">
					<EditorTextField label="Role" value={item.role} onChange={(next) => setItem({ ...item, role: next })} />
					<EditorTextField
						label="Organization"
						value={item.organization}
						onChange={(next) => setItem({ ...item, organization: next })}
					/>
					<EditorTextField
						label="Period"
						value={item.period}
						onChange={(next) => setItem({ ...item, period: next })}
					/>
					<EditorTextArea
						label="Description"
						value={item.description}
						onChange={(next) => setItem({ ...item, description: next })}
					/>
				</div>
			)}
		/>
	);
}

/**
 * Awards editor with CRUD and reorder support.
 */
function AwardsSectionEditor({
	value,
	onChange,
}: {
	value: Award[];
	onChange: (value: Award[]) => void;
}) {
	return (
		<ItemCollectionEditor
			title="Awards"
			items={value}
			onChange={onChange}
			createItem={() => ({
				id: createClientId("award"),
				name: "New award",
				issuer: "",
				date: "",
				description: "",
				link: "",
				imageUrl: "",
			})}
			renderSummary={(item) => (
				<div className="grid gap-1">
					<p className="font-semibold text-white">{item.name}</p>
					{item.issuer ? <p className="text-sm text-white/70">{item.issuer}</p> : null}
				</div>
			)}
			renderEditor={(item, setItem) => (
				<div className="grid gap-2">
					<EditorTextField label="Name" value={item.name} onChange={(next) => setItem({ ...item, name: next })} />
					<EditorTextField label="Issuer" value={item.issuer ?? ""} onChange={(next) => setItem({ ...item, issuer: next })} />
					<EditorTextField label="Date" value={item.date ?? ""} onChange={(next) => setItem({ ...item, date: next })} />
					<EditorTextArea
						label="Description"
						value={item.description ?? ""}
						onChange={(next) => setItem({ ...item, description: next })}
					/>
					<EditorTextField label="Link URL" value={item.link ?? ""} onChange={(next) => setItem({ ...item, link: next })} />
					<EditorTextField
						label="Image URL"
						value={item.imageUrl ?? ""}
						onChange={(next) => setItem({ ...item, imageUrl: next })}
					/>
				</div>
			)}
		/>
	);
}

/**
 * Now entries editor with CRUD and reorder support.
 */
function NowSectionEditor({
	value,
	onChange,
}: {
	value: NowEntry[];
	onChange: (value: NowEntry[]) => void;
}) {
	return (
		<ItemCollectionEditor
			title="Now updates"
			items={value}
			onChange={onChange}
			createItem={() => ({
				id: createClientId("now"),
				date: new Date().toISOString().slice(0, 10),
				content: "Write a short update.",
			})}
			renderSummary={(item) => (
				<div className="grid gap-1">
					<p className="font-semibold text-white">{item.date}</p>
					<p className="text-sm text-white/70">{item.content}</p>
				</div>
			)}
			renderEditor={(item, setItem) => (
				<div className="grid gap-2">
					<EditorTextField label="Date (YYYY-MM-DD)" value={item.date} onChange={(next) => setItem({ ...item, date: next })} />
					<EditorTextArea label="Content" value={item.content} onChange={(next) => setItem({ ...item, content: next })} />
				</div>
			)}
		/>
	);
}

/**
 * Links editor with CRUD and reorder support.
 */
function LinksSectionEditor({
	value,
	onChange,
}: {
	value: LinkEntry[];
	onChange: (value: LinkEntry[]) => void;
}) {
	return (
		<ItemCollectionEditor
			title="Links"
			items={value}
			onChange={onChange}
			createItem={() => ({
				id: createClientId("link"),
				label: "New link",
				url: "https://",
			})}
			renderSummary={(item) => (
				<div className="grid gap-1">
					<p className="font-semibold text-white">{item.label}</p>
					<p className="text-sm text-white/70">{item.url}</p>
				</div>
			)}
			renderEditor={(item, setItem) => (
				<div className="grid gap-2">
					<EditorTextField label="Label" value={item.label} onChange={(next) => setItem({ ...item, label: next })} />
					<EditorTextField label="URL" value={item.url} onChange={(next) => setItem({ ...item, url: next })} />
				</div>
			)}
		/>
	);
}

/**
 * Theme editor with palette presets and color controls.
 */
function ThemeSectionEditor({
	value,
	onChange,
}: {
	value: ThemeSettings;
	onChange: (value: ThemeSettings) => void;
}) {
	return (
		<div className="section-card grid gap-4">
			<div className="flex flex-wrap gap-2">
				{themePresets.map((preset) => (
					<button key={preset.id} type="button" className="button-secondary" onClick={() => onChange({ ...preset.theme })}>
						Preset: {preset.label}
					</button>
				))}
			</div>
			<EditorColorField label="Background" value={value.bg} onChange={(next) => onChange({ ...value, bg: next })} />
			<EditorColorField label="Surface" value={value.surface} onChange={(next) => onChange({ ...value, surface: next })} />
			<EditorColorField label="Text" value={value.text} onChange={(next) => onChange({ ...value, text: next })} />
			<EditorColorField label="Accent" value={value.accent} onChange={(next) => onChange({ ...value, accent: next })} />
			<EditorColorField
				label="Accent Alt"
				value={value.accentAlt}
				onChange={(next) => onChange({ ...value, accentAlt: next })}
			/>
			<EditorTextField
				label="Border (hex or rgba)"
				value={value.border}
				onChange={(next) => onChange({ ...value, border: next })}
			/>
		</div>
	);
}

/**
 * Generic list editor shared by multiple sections.
 */
function ItemCollectionEditor<T extends { id: string }>({
	title,
	items,
	onChange,
	createItem,
	renderSummary,
	renderEditor,
}: {
	title: string;
	items: T[];
	onChange: (items: T[]) => void;
	createItem: () => T;
	renderSummary: (item: T) => React.ReactNode;
	renderEditor: (item: T, setItem: (item: T) => void) => React.ReactNode;
}) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<T | null>(null);

	/**
	 * Opens a new item draft editor.
	 */
	function addNewItem(): void {
		setEditingId(null);
		setDraft(createItem());
	}

	/**
	 * Opens an existing item in the draft editor.
	 */
	function editItem(item: T): void {
		setEditingId(item.id);
		setDraft(structuredClone(item));
	}

	/**
	 * Removes an item after confirmation.
	 */
	function deleteItem(itemId: string): void {
		if (!window.confirm(`Delete this ${title.toLowerCase()} item?`)) {
			return;
		}
		onChange(items.filter((item) => item.id !== itemId));
	}

	/**
	 * Commits the active draft into the list.
	 */
	function saveDraft(): void {
		if (!draft) {
			return;
		}
		if (editingId) {
			onChange(items.map((item) => (item.id === editingId ? draft : item)));
		} else {
			onChange([...items, draft]);
		}
		setEditingId(null);
		setDraft(null);
	}

	return (
		<div className="section-card grid gap-4">
			<button type="button" className="button-main w-fit" onClick={addNewItem}>
				Add {title}
			</button>
			<SortableList
				items={items}
				onReorder={onChange}
				emptyLabel={`No ${title.toLowerCase()} items yet.`}
				renderItem={(item) => (
					<div className="grid gap-2">
						{renderSummary(item)}
						<div className="flex flex-wrap gap-2">
							<button type="button" className="button-secondary" onClick={() => editItem(item)}>
								Edit
							</button>
							<button type="button" className="button-secondary" onClick={() => deleteItem(item.id)}>
								Delete
							</button>
						</div>
					</div>
				)}
			/>
			{draft ? (
				<div className="rounded-xl border border-white/15 bg-black/20 p-4">
					<p className="text-sm font-semibold text-white">{editingId ? `Edit ${title}` : `Add ${title}`}</p>
					<div className="mt-3">{renderEditor(draft, setDraft)}</div>
					<div className="mt-4 flex flex-wrap gap-2">
						<button type="button" className="button-main" onClick={saveDraft}>
							Save
						</button>
						<button
							type="button"
							className="button-secondary"
							onClick={() => {
								setEditingId(null);
								setDraft(null);
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}

/**
 * Shared single-line text field.
 */
function EditorTextField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="grid gap-1">
			<label className="text-sm text-white/75">{label}</label>
			<input className="input-field" value={value} onChange={(event) => onChange(event.target.value)} />
		</div>
	);
}

/**
 * Shared textarea field for longer text.
 */
function EditorTextArea({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="grid gap-1">
			<label className="text-sm text-white/75">{label}</label>
			<textarea className="input-field min-h-28" value={value} onChange={(event) => onChange(event.target.value)} />
		</div>
	);
}

/**
 * Shared select field wrapper.
 */
function EditorSelectField({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: string;
	options: Array<{ id: string; label: string }>;
	onChange: (value: string) => void;
}) {
	return (
		<div className="grid gap-1">
			<label className="text-sm text-white/75">{label}</label>
			<select className="input-field" value={value} onChange={(event) => onChange(event.target.value)}>
				{options.map((option) => (
					<option key={option.id} value={option.id}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}

/**
 * Combined color picker and text field for theme tokens.
 */
function EditorColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const safeColor = /^#([0-9a-fA-F]{3}){1,2}$/.test(value) ? value : "#000000";

	return (
		<div className="grid gap-1">
			<label className="text-sm text-white/75">{label}</label>
			<div className="flex items-center gap-2">
				<input type="color" value={safeColor} onChange={(event) => onChange(event.target.value)} />
				<input className="input-field flex-1" value={value} onChange={(event) => onChange(event.target.value)} />
			</div>
		</div>
	);
}
