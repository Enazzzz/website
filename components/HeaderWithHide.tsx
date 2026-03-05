"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import type { LinkEntry } from "@/data/types";

const SCROLL_THRESHOLD = 80;
/** Height of the visible strip when collapsed; also the hover-to-expand zone. */
const PEEK_PX = 20;

export type HeaderWithHideProps = {
	links: LinkEntry[];
	siteTitle?: string;
	iconText?: string;
	showConsoleLink?: boolean;
	showWinsLink?: boolean;
};

/**
 * Wraps Header: when scrolled, header tucks up to a small peek strip at the top;
 * hovering that strip pulls the full header down so nav stays reachable.
 */
export function HeaderWithHide(props: HeaderWithHideProps) {
	const [collapsed, setCollapsed] = useState(false);

	const handleScroll = useCallback(() => {
		if (typeof window === "undefined") return;
		setCollapsed(window.scrollY > SCROLL_THRESHOLD);
	}, []);

	useEffect(() => {
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return (
		<>
			<div className="header-spacer" aria-hidden />
			<div
				className={`header-hide-wrapper ${collapsed ? "collapsed" : ""}`}
				style={{ ["--header-peek-px" as string]: `${PEEK_PX}px` }}
			>
				{/* Visible strip when collapsed: signals that the bar can be pulled down */}
				<div
					className="header-peek-strip"
					aria-hidden
					style={{ pointerEvents: collapsed ? "auto" : "none", opacity: collapsed ? 1 : 0 }}
				>
					<svg
						className="header-peek-strip-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden
					>
						<title>Pull down to open menu</title>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</div>
				<Header {...props} />
			</div>
		</>
	);
}
