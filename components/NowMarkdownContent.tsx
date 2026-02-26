"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders markdown content for Now entries. Supports bold, italic, links, and images (by URL).
 * Images are rendered as regular img tags (any hosted URL).
 */
export function NowMarkdownContent({ content }: { content: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				// Allow images from any URL (user-provided hosted image)
				img: ({ src, alt, ...props }) =>
					src ? (
						<span className="my-3 block">
							<img
								src={src}
								alt={alt ?? ""}
								className="max-h-80 w-auto max-w-full rounded-lg border border-white/10 object-contain"
								loading="lazy"
								{...props}
							/>
						</span>
					) : null,
				p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
				a: ({ href, children }) => (
					<a href={href} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
						{children}
					</a>
				),
				strong: ({ children }) => <strong className="font-bold">{children}</strong>,
				ul: ({ children }) => <ul className="my-3 list-inside list-disc space-y-1">{children}</ul>,
				ol: ({ children }) => <ol className="my-3 list-inside list-decimal space-y-1">{children}</ol>,
			}}
		>
			{content}
		</ReactMarkdown>
	);
}
