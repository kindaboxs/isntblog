"use client";

import { isValidElement, type HTMLAttributes, type ReactNode } from "react";
import Link from "next/link";

import { Highlight, themes } from "prism-react-renderer";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { markdownCustomPlugin } from "@/components/global/markdown-renderer/mardown-custom-plugin";
import { cn } from "@/lib/utils";

import { MarkdownHeaderCodeBlock } from "./markdown-header-code-block";

interface Props {
	content: string;
	className?: string;
}

const extractTextContent = (node: ReactNode): string => {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}
	if (isValidElement(node)) {
		const props = node.props as { children?: React.ReactNode };
		return props.children ? extractTextContent(props.children) : "";
	}
	if (Array.isArray(node)) {
		return node.map(extractTextContent).join("");
	}
	return "";
};

export const MarkdownRenderer = ({ content, className }: Props) => {
	return (
		<div className={cn("max-w-none", className)}>
			<ReactMarkdown
				remarkPlugins={[
					remarkGfm,
					remarkMath,
					remarkBreaks,
					markdownCustomPlugin,
				]}
				rehypePlugins={[rehypeKatex]}
				components={{
					code: ({
						className,
						children,
						title,
						...props
					}: HTMLAttributes<HTMLElement> &
						ExtraProps & {
							title?: string;
						}) => {
						const match = /language-(\w+)/.exec(className ?? "");
						const language = match ? match[1] : "";
						const codeContent = extractTextContent(children).replace(/\n$/, "");
						const codeId = `code-${Math.random().toString(36).slice(2)}`;

						if (!language) {
							return (
								<code
									className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm"
									{...props}
								>
									{children}
								</code>
							);
						}

						return (
							<div className="mb-4">
								<MarkdownHeaderCodeBlock
									code={codeContent}
									id={codeId}
									title={title}
									language={language}
								/>

								<Highlight
									theme={themes.oneDark}
									code={codeContent}
									language={language}
								>
									{({
										className,
										style,
										tokens,
										getLineProps,
										getTokenProps,
									}) => (
										<pre
											className={cn(
												`${className} bg-muted border-border overflow-x-auto rounded-t-none rounded-b-md border border-t-0 py-4 text-sm`
											)}
											style={style}
											{...props}
										>
											{tokens.map((line, i) => (
												<div key={i} {...getLineProps({ line })}>
													<span className="mr-4 inline-block w-8 text-right text-gray-500 select-none">
														{i + 1}
													</span>
													{line.map((token, key) => (
														<span key={key} {...getTokenProps({ token })} />
													))}
												</div>
											))}
										</pre>
									)}
								</Highlight>
							</div>
						);
					},

					h1: ({ ...props }) => (
						<h1
							className="text-foreground mt-8 mb-4 text-3xl font-bold"
							{...props}
						/>
					),

					h2: ({ ...props }) => (
						<h2
							className="text-foreground mt-6 mb-3 text-2xl font-semibold"
							{...props}
						/>
					),

					h3: ({ ...props }) => (
						<h3
							className="text-foreground mt-4 mb-2 text-xl font-medium"
							{...props}
						/>
					),

					p: ({ children, ...props }) => (
						<p className="text-foreground mb-4 leading-relaxed" {...props}>
							{children}
						</p>
					),

					ul: ({ children, ...props }) => (
						<ul className="text-foreground mb-4 ml-6 list-disc" {...props}>
							{children}
						</ul>
					),

					ol: ({ children, ...props }) => (
						<ol className="text-foreground mb-4 ml-6 list-decimal" {...props}>
							{children}
						</ol>
					),

					li: ({ children, ...props }) => (
						<li className="mb-1" {...props}>
							{children}
						</li>
					),

					blockquote: ({ children, ...props }) => (
						<blockquote
							className="border-muted-foreground/30 text-muted-foreground my-4 border-l-4 pl-4 italic"
							{...props}
						>
							{children}
						</blockquote>
					),

					a: ({
						children,
						href,
						...props
					}: HTMLAttributes<HTMLElement> & ExtraProps & { href?: string }) => (
						<Link
							href={href!}
							className="text-primary hover:text-primary/80 underline"
							{...props}
						>
							{children}
						</Link>
					),

					strong: ({ children, ...props }) => (
						<strong className="text-foreground font-semibold" {...props}>
							{children}
						</strong>
					),

					em: ({ children, ...props }) => (
						<em className="text-foreground italic" {...props}>
							{children}
						</em>
					),

					hr: (props) => <hr className="border-border my-8" {...props} />,
					// Table components for GFM support

					table: ({ children, ...props }) => (
						<div className="mb-4 overflow-x-auto">
							<table
								className="border-border border-collapse border"
								{...props}
							>
								{children}
							</table>
						</div>
					),

					thead: ({ children, ...props }) => (
						<thead className="bg-muted/50" {...props}>
							{children}
						</thead>
					),

					tbody: ({ children, ...props }) => (
						<tbody {...props}>{children}</tbody>
					),

					tr: ({ children, ...props }) => (
						<tr className="border-border border-b" {...props}>
							{children}
						</tr>
					),

					th: ({ children, ...props }) => (
						<th
							className="border-border border px-4 py-2 text-left font-semibold"
							{...props}
						>
							{children}
						</th>
					),

					td: ({ children, ...props }) => (
						<td className="border-border border px-4 py-2" {...props}>
							{children}
						</td>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};
