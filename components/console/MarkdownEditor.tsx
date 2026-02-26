"use client";

import { useCallback, useRef } from "react";

/**
 * Wraps the current selection in the textarea with before/after strings and restores cursor.
 */
function wrapSelection(
	textarea: HTMLTextAreaElement,
	before: string,
	after: string,
	onChange: (value: string) => void
): void {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const value = textarea.value;
	const selected = value.slice(start, end);
	const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
	onChange(newValue);
	// Restore focus and selection around the wrapped text
	requestAnimationFrame(() => {
		textarea.focus();
		textarea.setSelectionRange(start + before.length, end + before.length);
	});
}

/**
 * Inserts text at the cursor (or replaces selection) and places cursor after it.
 */
function insertAtCursor(
	textarea: HTMLTextAreaElement,
	toInsert: string,
	onChange: (value: string) => void,
	cursorOffset = toInsert.length
): void {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const value = textarea.value;
	const newValue = value.slice(0, start) + toInsert + value.slice(end);
	onChange(newValue);
	requestAnimationFrame(() => {
		textarea.focus();
		textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
	});
}

export interface MarkdownEditorProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	/** Min height for the textarea (e.g. "12rem"). */
	minHeight?: string;
	className?: string;
}

/**
 * Hybrid Markdown editor: toolbar (Bold, Italic, Link, Image) and keyboard shortcuts.
 * Content is stored as Markdown; use react-markdown to render on the Now page.
 */
export function MarkdownEditor({
	label,
	value,
	onChange,
	placeholder = "Write your update. Use the toolbar or **Ctrl+B** bold, **Ctrl+I** italic, **Ctrl+K** link.",
	minHeight = "10rem",
	className = "",
}: MarkdownEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (!textareaRef.current) return;
			// Ctrl+B: bold
			if (e.ctrlKey && e.key === "b") {
				e.preventDefault();
				wrapSelection(textareaRef.current, "**", "**", onChange);
				return;
			}
			// Ctrl+I: italic
			if (e.ctrlKey && e.key === "i") {
				e.preventDefault();
				wrapSelection(textareaRef.current, "*", "*", onChange);
				return;
			}
			// Ctrl+K: link (prompt for URL; selected text becomes link text)
			if (e.ctrlKey && e.key === "k") {
				e.preventDefault();
				const ta = textareaRef.current;
				const selected = ta.value.slice(ta.selectionStart, ta.selectionEnd);
				const linkText = selected || "link text";
				const url = window.prompt("Link URL:", "https://");
				if (url != null && url.trim()) {
					insertAtCursor(ta, `[${linkText}](${url.trim()})`, onChange);
				}
				return;
			}
		},
		[onChange]
	);

	const wrap = (before: string, after: string) => {
		if (textareaRef.current) wrapSelection(textareaRef.current, before, after, onChange);
	};

	const insertImage = () => {
		const url = window.prompt("Image URL (hosted image):", "https://");
		if (url != null && url.trim()) {
			const alt = window.prompt("Alt text (optional):", "");
			const insert = alt != null && alt.trim() ? `![${alt.trim()}](${url.trim()})` : `![](${url.trim()})`;
			if (textareaRef.current) insertAtCursor(textareaRef.current, insert, onChange);
		}
	};

	return (
		<div className={`grid gap-1 ${className}`}>
			<label className="text-sm text-white/75">{label}</label>
			<div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-white/20 bg-white/5 p-1.5">
				<button
					type="button"
					onClick={() => wrap("**", "**")}
					className="rounded px-2 py-1 text-sm font-bold text-white/90 hover:bg-white/10"
					title="Bold (Ctrl+B)"
				>
					B
				</button>
				<button
					type="button"
					onClick={() => wrap("*", "*")}
					className="rounded px-2 py-1 text-sm italic text-white/90 hover:bg-white/10"
					title="Italic (Ctrl+I)"
				>
					I
				</button>
				<button
					type="button"
					onClick={() => {
						if (textareaRef.current) {
							const ta = textareaRef.current;
							const selected = ta.value.slice(ta.selectionStart, ta.selectionEnd);
							const url = window.prompt("Link URL:", "https://");
							if (url != null && url.trim()) {
								insertAtCursor(ta, `[${selected || "link"}](${url.trim()})`, onChange);
							}
						}
					}}
					className="rounded px-2 py-1 text-sm text-white/90 hover:bg-white/10"
					title="Link (Ctrl+K)"
				>
					Link
				</button>
				<button
					type="button"
					onClick={insertImage}
					className="rounded px-2 py-1 text-sm text-white/90 hover:bg-white/10"
					title="Insert image (URL)"
				>
					Image
				</button>
				<span className="ml-2 text-xs text-white/50">Ctrl+B / Ctrl+I / Ctrl+K</span>
			</div>
			<textarea
				ref={textareaRef}
				className="input-field min-w-0 rounded-t-none"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				style={{ minHeight }}
			/>
		</div>
	);
}
