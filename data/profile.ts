import type { GithubProfile, ProfileContent } from "@/data/types";

/**
 * Primary profile content for Hero and About sections.
 */
export const profile: ProfileContent = {
	name: "Your Name",
	tagline: "I build colorful things on the internet.",
	bio: "This portfolio hub is where I collect projects, experiments, awards, and progress updates. Swap this with your own short story and current focus.",
	location: "Your City, Your Country",
	email: "you@example.com",
};

/**
 * GitHub metadata shown in the hero/about card.
 */
export const github: GithubProfile = {
	username: "your-github-username",
	profileUrl: "https://github.com/your-github-username",
	avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
	statsNote: "Open source fan. Shipping, learning, and sharing in public.",
};
