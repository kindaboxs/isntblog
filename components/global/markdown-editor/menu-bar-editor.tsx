import {
	Bold,
	Code,
	Code2,
	Eye,
	FileText,
	Heading1,
	Heading2,
	Heading3,
	ImageIcon,
	Italic,
	Link,
	List,
	ListOrdered,
	Minus,
	Quote,
	Split,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuBarEditorProps {
	onFormat: (format: string, value?: string) => void;
	viewMode?: "editor" | "preview" | "split";
	onViewModeChange?: (mode: "editor" | "preview" | "split") => void;
}

export const MenuBarEditor = ({
	onFormat,
	viewMode = "editor",
	onViewModeChange,
}: MenuBarEditorProps) => {
	return (
		<div className="flex flex-wrap items-center justify-between gap-1 border-b p-2">
			<div className="flex flex-wrap items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Toggle
							size="sm"
							onClick={() => onFormat("bold")}
							aria-label="Bold"
						>
							<Bold className="size-4" />
						</Toggle>
					</TooltipTrigger>
					<TooltipContent>
						<p>Bold</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Toggle
							size="sm"
							onClick={() => onFormat("italic")}
							aria-label="Italic"
						>
							<Italic className="size-4" />
						</Toggle>
					</TooltipTrigger>
					<TooltipContent>
						<p>Italic</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Toggle
							size="sm"
							onClick={() => onFormat("code")}
							aria-label="Inline Code"
						>
							<Code className="size-4" />
						</Toggle>
					</TooltipTrigger>
					<TooltipContent>
						<p>Inline Code</p>
					</TooltipContent>
				</Tooltip>

				<div className="bg-border mx-1 h-6 w-px" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("heading1")}
							aria-label="Heading 1"
						>
							<Heading1 className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Heading 1</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("heading2")}
							aria-label="Heading 2"
						>
							<Heading2 className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Heading 2</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("heading3")}
							aria-label="Heading 3"
						>
							<Heading3 className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Heading 3</p>
					</TooltipContent>
				</Tooltip>

				<div className="bg-border mx-1 h-6 w-px" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("bulletList")}
							aria-label="Bullet List"
						>
							<List className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Bullet List</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("orderedList")}
							aria-label="Ordered List"
						>
							<ListOrdered className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Ordered List</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("quote")}
							aria-label="Quote"
						>
							<Quote className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Quote</p>
					</TooltipContent>
				</Tooltip>

				<div className="bg-border mx-1 h-6 w-px" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("link")}
							aria-label="Link"
						>
							<Link className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Link</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("image")}
							aria-label="Image"
						>
							<ImageIcon className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Image</p>
					</TooltipContent>
				</Tooltip>

				<div className="bg-border mx-1 h-6 w-px" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("horizontalRule")}
							aria-label="Horizontal Rule"
						>
							<Minus className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Horizontal Rule</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onFormat("codeBlock")}
							aria-label="Code Block"
						>
							<Code2 className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Code Block</p>
					</TooltipContent>
				</Tooltip>
			</div>

			{/* View Mode Buttons */}
			{onViewModeChange && (
				<div className="flex items-center gap-1">
					<div className="bg-border mr-2 h-6 w-px" />

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant={viewMode === "editor" ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewModeChange("editor")}
								aria-label="Editor Mode"
							>
								<FileText className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Editor</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant={viewMode === "preview" ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewModeChange("preview")}
								aria-label="Preview Mode"
							>
								<Eye className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Preview</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant={viewMode === "split" ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewModeChange("split")}
								aria-label="Split Mode"
							>
								<Split className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Split View</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</div>
	);
};
