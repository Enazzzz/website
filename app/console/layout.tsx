import { notFound } from "next/navigation";

/**
 * Console is only available when running locally (no VERCEL env).
 * On Vercel this route returns 404 so the admin UI is never exposed in production.
 */
export default function ConsoleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (process.env.VERCEL) {
		notFound();
	}
	return <>{children}</>;
}
