import { forwardRef, useRef, useState } from "react";

import { MenuBarEditor } from "@/components/global/markdown-editor/menu-bar-editor";
import { MarkdownRenderer } from "@/components/global/markdown-renderer";
import { Textarea } from "@/components/ui/textarea";

type ViewMode = "editor" | "preview" | "split";

interface MarkdownEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const MarkdownEditor = forwardRef<
	HTMLTextAreaElement,
	MarkdownEditorProps
>(({ value, onChange, placeholder, disabled, className }, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("editor");

	const insertText = (text: string, wrap = false) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const currentValue = value ?? "";
		let newValue: string;
		let newCursorPos: number;

		if (wrap && start !== end) {
			// Wrap selected text
			const selectedText = currentValue.substring(start, end);
			newValue =
				currentValue.substring(0, start) +
				text +
				selectedText +
				text +
				currentValue.substring(end);
			newCursorPos = start + text.length + selectedText.length + text.length;
		} else {
			// Insert at cursor
			newValue =
				currentValue.substring(0, start) + text + currentValue.substring(end);
			newCursorPos = start + text.length;
		}

		onChange?.(newValue);

		// Update cursor position after state update
		setTimeout(() => {
			textarea.selectionStart = newCursorPos;
			textarea.selectionEnd = newCursorPos;
			textarea.focus();
		}, 0);
	};

	const insertBlock = (prefix: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const currentValue = value ?? "";
		const lines = currentValue.split("\n");
		const currentLineIndex =
			currentValue.substring(0, start).split("\n").length - 1;
		const currentLine = lines[currentLineIndex];

		if (currentLine.trim() === "") {
			// Empty line, just insert prefix
			lines[currentLineIndex] = prefix;
		} else {
			// Insert prefix at start of line
			lines[currentLineIndex] = prefix + currentLine;
		}

		const newValue = lines.join("\n");
		onChange?.(newValue);

		setTimeout(() => {
			const newPos =
				currentValue.substring(0, start).replace(/\n/g, "").length +
				prefix.length;
			textarea.selectionStart = newPos;
			textarea.selectionEnd = newPos;
			textarea.focus();
		}, 0);
	};

	const handleFormat = (format: string) => {
		switch (format) {
			case "bold":
				insertText("**", true);
				break;
			case "italic":
				insertText("*", true);
				break;
			case "code":
				insertText("`", true);
				break;
			case "heading1":
				insertBlock("# ");
				break;
			case "heading2":
				insertBlock("## ");
				break;
			case "heading3":
				insertBlock("### ");
				break;
			case "bulletList":
				insertBlock("- ");
				break;
			case "orderedList":
				insertBlock("1. ");
				break;
			case "quote":
				insertBlock("> ");
				break;
			case "link":
				insertText("[Link Text](https://example.com)");
				break;
			case "image":
				insertText("![Alt Text](https://example.com/image.jpg)");
				break;
			case "horizontalRule":
				insertText("\n---\n");
				break;
			case "codeBlock":
				insertText("\n```\n\n```\n");
				break;
		}
	};

	const renderEditorContent = () => {
		switch (viewMode) {
			case "editor":
				return (
					<Textarea
						ref={(el) => {
							textareaRef.current = el;
							if (typeof ref === "function") ref(el);
							else if (ref) ref.current = el;
						}}
						value={value}
						onChange={(e) => onChange?.(e.target.value)}
						placeholder={placeholder}
						disabled={disabled}
						className="min-h-[400px] resize-none rounded-none border-0 sm:min-h-[500px]"
					/>
				);
			case "preview":
				return (
					<div className="grid max-h-[500px] min-h-[400px] grid-cols-1 overflow-y-auto p-4 sm:min-h-[500px]">
						<MarkdownRenderer content={value ?? ""} />
					</div>
				);
			case "split":
				return (
					<div className="grid min-h-32 grid-cols-2">
						<Textarea
							ref={(el) => {
								textareaRef.current = el;
								if (typeof ref === "function") ref(el);
								else if (ref) ref.current = el;
							}}
							value={value}
							onChange={(e) => onChange?.(e.target.value)}
							placeholder={placeholder}
							disabled={disabled}
							className="min-h-[400px] resize-none rounded-none border-0 border-r sm:min-h-[500px]"
						/>
						<div className="max-h-[500px] min-h-[400px] overflow-y-auto p-4 sm:min-h-[500px]">
							<MarkdownRenderer content={value ?? ""} />
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className={`rounded-md border ${className}`}>
			<MenuBarEditor
				onFormat={handleFormat}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>
			{renderEditorContent()}
		</div>
	);
});

MarkdownEditor.displayName = "MarkdownEditor";
