import { ImageResponse } from "next/og";

/**
 * Generates a simple initials-based app icon.
 */
export const size = {
	width: 64,
	height: 64,
};

export const contentType = "image/png";

/**
 * Renders the site icon with a colorful dark gradient.
 */
export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #8c7bff 0%, #27d8ff 100%)",
					color: "#06070e",
					fontSize: 28,
					fontWeight: 800,
					fontFamily: "sans-serif",
				}}
			>
				PH
			</div>
		),
		{
			...size,
		},
	);
}
