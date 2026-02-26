import { AboutSection } from "@/components/AboutSection";
import { AwardsSection } from "@/components/AwardsSection";
import { ContactForm } from "@/components/ContactForm";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { getSiteContent } from "@/lib/content-store";

/**
 * Renders the landing page with all portfolio sections.
 */
export default async function Home() {
	const content = await getSiteContent();

	return (
		<div className="min-h-screen bg-[color:var(--bg)]">
			<Header links={content.links} />
			<main>
				<Hero profile={content.profile} github={content.github} />
				<AboutSection profile={content.profile} />
				<ProjectsSection projects={content.projects} />
				<SkillsSection categories={content.skills} />
				<ExperienceSection items={content.experience} />
				<AwardsSection awards={content.awards} />
				<ContactForm />
			</main>
			<Footer links={content.links} />
		</div>
	);
}
