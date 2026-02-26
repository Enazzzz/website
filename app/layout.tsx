import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { getSiteContent } from "@/lib/content-store";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Portfolio Hub | Your Name",
		template: "%s | Portfolio Hub",
	},
	description: "A dark and colorful portfolio hub for projects, awards, updates, and contact.",
	openGraph: {
		title: "Portfolio Hub | Your Name",
		description: "Explore projects, awards, updates, and ways to connect.",
		type: "website",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;
	const content = await getSiteContent();
	const theme = content.theme;
	const themedVariables = {
		"--bg": theme.bg,
		"--surface": theme.surface,
		"--text": theme.text,
		"--accent": theme.accent,
		"--accent-alt": theme.accentAlt,
		"--border": theme.border,
	} as React.CSSProperties;

	return (
		<html lang="en">
			<body style={themedVariables} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
