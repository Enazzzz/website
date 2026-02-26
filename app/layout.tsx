import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { getSiteContent } from "@/lib/content-store";
import type { ThemeFontId } from "@/data/types";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

/** Converts hex (e.g. #8c7bff) and opacity (0–1) to rgba string for gradient orbs. */
function hexToRgba(hex: string, opacity: number): string {
	const m = hex.replace(/^#/, "").match(/^(.)(.)(.)$/) ?? hex.replace(/^#/, "").match(/^(..)(..)(..)$/);
	if (!m) return hex;
	const r = m[1].length === 1 ? parseInt(m[1] + m[1], 16) : parseInt(m[1], 16);
	const g = m[2].length === 1 ? parseInt(m[2] + m[2], 16) : parseInt(m[2], 16);
	const b = m[3].length === 1 ? parseInt(m[3] + m[3], 16) : parseInt(m[3], 16);
	return `rgba(${r},${g},${b},${opacity})`;
}

/** Maps theme font id to the CSS variable name for the body font. */
const fontVariableMap: Record<ThemeFontId, string> = {
	geist: "var(--font-geist-sans)",
	inter: "var(--font-inter)",
	playfair: "var(--font-playfair)",
	"space-grotesk": "var(--font-space-grotesk)",
};

/** Build metadata from site content (title and optional favicon URL). */
export async function generateMetadata(): Promise<Metadata> {
	const content = await getSiteContent();
	const title = content.site?.siteTitle ?? content.profile.name ?? "Portfolio";
	const template = `%s | ${title}`;
	const faviconUrl = content.site?.faviconUrl;
	return {
		title: { default: title, template },
		description: "My portfolio website! Check out my projects and skills.",
		openGraph: {
			title,
			description: "My portfolio website! Check out my projects and skills.",
			type: "website",
		},
		...(faviconUrl && { icons: { icon: faviconUrl } }),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;
	const content = await getSiteContent();
	const theme = content.theme;
	const fontId = theme.font ?? "geist";
	const g = theme.backgroundGradient ?? {
		enabled: true,
		radius1: 35,
		radius2: 32,
		position1: "10% -10%",
		position2: "90% -10%",
		opacity1: 0.35,
		opacity2: 0.28,
	};
	// Gradient orb colors with opacity applied in JS so opacity controls work reliably
	const gradientColor1 = g.enabled ? hexToRgba(theme.accent, g.opacity1) : "transparent";
	const gradientColor2 = g.enabled ? hexToRgba(theme.accentAlt, g.opacity2) : "transparent";

	const themedVariables = {
		"--bg": theme.bg,
		"--surface": theme.surface,
		"--text": theme.text,
		"--accent": theme.accent,
		"--accent-alt": theme.accentAlt,
		"--border": theme.border,
		"--font-sans": fontVariableMap[fontId] ?? fontVariableMap.geist,
		"--gradient-radius1": `${g.radius1}%`,
		"--gradient-radius2": `${g.radius2}%`,
		"--gradient-position1": g.position1,
		"--gradient-position2": g.position2,
		"--gradient-color1": gradientColor1,
		"--gradient-color2": gradientColor2,
	} as React.CSSProperties;

	return (
		<html lang="en" style={themedVariables}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} antialiased`}
			>
				{children}
				<Analytics />
				{gaId ? (
					<>
						<Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
						<Script id="google-analytics" strategy="afterInteractive">
							{`
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${gaId}');
							`}
						</Script>
					</>
				) : null}
			</body>
		</html>
	);
}
