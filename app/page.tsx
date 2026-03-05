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
		<div className="page-content-bg min-h-screen">
			<Header
				links={content.links}
				siteTitle={content.site?.siteTitle ?? content.profile.name}
				iconText={content.site?.iconText}
				showConsoleLink={!process.env.VERCEL}
				showWinsLink={content.awards.length > 0}
			/>
			<main className="pb-24">
				<Hero profile={content.profile} github={content.github} />
				<div className="fade-in-up fade-in-up-delay-1">
					<AboutSection profile={content.profile} />
				</div>
				<div className="fade-in-up fade-in-up-delay-2">
					<ProjectsSection projects={content.projects} />
				</div>
				<div className="fade-in-up fade-in-up-delay-3">
					<SkillsSection categories={content.skills} />
				</div>
				<div className="fade-in-up fade-in-up-delay-4">
					<ExperienceSection items={content.experience} />
				</div>
				{content.awards.length > 0 ? (
					<div className="fade-in-up fade-in-up-delay-5">
						<AwardsSection awards={content.awards} />
					</div>
				) : null}
				<div className="fade-in-up fade-in-up-delay-6">
					<ContactForm />
				</div>
			</main>
			<Footer links={content.links} />
		</div>
	);
}
