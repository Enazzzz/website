import { ImageResponse } from "next/og";

import { getSiteContent } from "@/lib/content-store";

/**
 * Generates a simple initials-based app icon. Text is editable via console (Site → Icon text).
 */
export const size = {
	width: 64,
	height: 64,
};

export const contentType = "image/png";

/**
 * Renders the site icon with theme accent gradient. Uses site.iconText and theme colors from content store.
 */
export default async function Icon() {
	const content = await getSiteContent();
	const text = (content.site?.iconText ?? "PH").slice(0, 3);
	const accent = content.theme?.accent ?? "#8c7bff";
	const accentAlt = content.theme?.accentAlt ?? "#27d8ff";
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: `linear-gradient(135deg, ${accent} 0%, ${accentAlt} 100%)`,
					color: "#06070e",
					fontSize: text.length > 2 ? 22 : 28,
					fontWeight: 800,
					fontFamily: "sans-serif",
				}}
			>
				{text || "PH"}
			</div>
		),
		{ ...size },
	);
}
