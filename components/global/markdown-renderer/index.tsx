"use client";

import React, { useEffect, useState } from "react";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { Highlight, themes } from "prism-react-renderer";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

type MDXComponentProps = {
	children?: React.ReactNode;
	[key: string]: unknown;
};

export const MarkdownRenderer = ({
	content,
	className,
}: MarkdownRendererProps) => {
	const [serializedContent, setSerializedContent] =
		useState<MDXRemoteSerializeResult | null>(null);

	useEffect(() => {
		const serializeContent = async () => {
			if (!content) {
				setSerializedContent(null);
				return;
			}

			try {
				const mdxSource = await serialize(content, {
					mdxOptions: {
						remarkPlugins: [
							remarkGfm, // GitHub Flavored Markdown
							remarkBreaks, // Convert line breaks to <br> tags
							remarkMath, // Math support
						],
						rehypePlugins: [
							rehypeKatex, // Math rendering
						],
					},
				});
				setSerializedContent(mdxSource);
			} catch (error) {
				console.error("Error serializing MDX content:", error);
				setSerializedContent(null);
			}
		};

		void serializeContent();
	}, [content]);

	// Custom components for enhanced styling
	const components = {
		// Fallback for undefined components
		Callout: ({
			children,
			type = "info",
			...props
		}: MDXComponentProps & { type?: string }) => {
			const calloutClasses = {
				info: "border-blue-500 bg-blue-50 dark:bg-blue-950/50",
				warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50",
				error: "border-red-500 bg-red-50 dark:bg-red-950/50",
				success: "border-green-500 bg-green-50 dark:bg-green-950/50",
			};

			return (
				<div
					className={`my-4 rounded-r-lg border-l-4 p-4 ${
						calloutClasses[type as keyof typeof calloutClasses] ||
						calloutClasses.info
					}`}
					{...props}
				>
					{children}
				</div>
			);
		},
		h1: ({ children, ...props }: MDXComponentProps) => (
			<h1 className="text-foreground mt-8 mb-4 text-3xl font-bold" {...props}>
				{children}
			</h1>
		),
		h2: ({ children, ...props }: MDXComponentProps) => (
			<h2
				className="text-foreground mt-6 mb-3 text-2xl font-semibold"
				{...props}
			>
				{children}
			</h2>
		),
		h3: ({ children, ...props }: MDXComponentProps) => (
			<h3 className="text-foreground mt-4 mb-2 text-xl font-medium" {...props}>
				{children}
			</h3>
		),
		h4: ({ children, ...props }: MDXComponentProps) => (
			<h4 className="text-foreground mt-3 mb-2 text-lg font-medium" {...props}>
				{children}
			</h4>
		),
		p: ({ children, ...props }: MDXComponentProps) => (
			<p className="text-foreground mb-4 leading-relaxed" {...props}>
				{children}
			</p>
		),
		ul: ({ children, ...props }: MDXComponentProps) => (
			<ul className="text-foreground mb-4 ml-6 list-disc" {...props}>
				{children}
			</ul>
		),
		ol: ({ children, ...props }: MDXComponentProps) => (
			<ol className="text-foreground mb-4 ml-6 list-decimal" {...props}>
				{children}
			</ol>
		),
		li: ({ children, ...props }: MDXComponentProps) => (
			<li className="mb-1" {...props}>
				{children}
			</li>
		),
		blockquote: ({ children, ...props }: MDXComponentProps) => (
			<blockquote
				className="border-muted-foreground/30 text-muted-foreground mb-4 border-l-4 pl-4 italic"
				{...props}
			>
				{children}
			</blockquote>
		),
		code: ({
			children,
			className,
			...props
		}: MDXComponentProps & { className?: string }) => {
			const match = /language-(\w+)/.exec(className ?? "");
			const language = match ? match[1] : "";

			// If this is inline code (not in a pre block), use simple styling
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

			// For code blocks, use prism-react-renderer
			// Safely extract code content from children
			const extractTextContent = (node: React.ReactNode): string => {
				if (typeof node === "string" || typeof node === "number") {
					return String(node);
				}
				if (React.isValidElement(node)) {
					const props = node.props as { children?: React.ReactNode };
					return props.children ? extractTextContent(props.children) : "";
				}
				if (Array.isArray(node)) {
					return node.map(extractTextContent).join("");
				}
				return "";
			};

			const codeContent = extractTextContent(children);

			return (
				<Highlight
					theme={themes.oneDark}
					code={codeContent.replace(/\n$/, "")}
					language={language}
				>
					{({
						className: highlightClassName,
						style,
						tokens,
						getLineProps,
						getTokenProps,
					}) => (
						<pre
							className={cn(
								"bg-muted mb-4 overflow-x-auto rounded-lg p-4 text-sm",
								highlightClassName
							)}
							style={style}
							{...props}
						>
							{tokens.map((line, i) => (
								<div key={i} {...getLineProps({ line })}>
									{line.map((token, key) => (
										<span key={key} {...getTokenProps({ token })} />
									))}
								</div>
							))}
						</pre>
					)}
				</Highlight>
			);
		},
		pre: ({ children, ...props }: MDXComponentProps) => {
			// If children is a code element, it's already handled by the code component above
			// Just return a simple pre for other cases
			const childrenArray = React.Children.toArray(children);
			const hasCodeChild = childrenArray.some(
				(child) => React.isValidElement(child) && child.type === "code"
			);

			if (hasCodeChild) {
				// Code highlighting is handled by the code component
				return <>{children}</>;
			}

			return (
				<pre
					className="bg-muted mb-4 overflow-x-auto rounded-lg p-4 text-sm"
					{...props}
				>
					{children}
				</pre>
			);
		},
		a: ({
			children,
			href,
			...props
		}: MDXComponentProps & { href?: string }) => (
			<a
				href={href}
				className="text-primary hover:text-primary/80 underline"
				target="_blank"
				rel="noopener noreferrer"
				{...props}
			>
				{children}
			</a>
		),
		// Link component for internal navigation
		Link: ({
			children,
			href,
			...props
		}: MDXComponentProps & { href?: string }) => (
			<a
				href={href}
				className="text-primary hover:text-primary/80 underline"
				{...props}
			>
				{children}
			</a>
		),
		strong: ({ children, ...props }: MDXComponentProps) => (
			<strong className="text-foreground font-semibold" {...props}>
				{children}
			</strong>
		),
		em: ({ children, ...props }: MDXComponentProps) => (
			<em className="text-foreground italic" {...props}>
				{children}
			</em>
		),
		hr: (props: MDXComponentProps) => (
			<hr className="border-border my-8" {...props} />
		),
		// Table components for GFM support
		table: ({ children, ...props }: MDXComponentProps) => (
			<div className="mb-4 overflow-x-auto">
				<table className="border-border border-collapse border" {...props}>
					{children}
				</table>
			</div>
		),
		thead: ({ children, ...props }: MDXComponentProps) => (
			<thead className="bg-muted/50" {...props}>
				{children}
			</thead>
		),
		tbody: ({ children, ...props }: MDXComponentProps) => (
			<tbody {...props}>{children}</tbody>
		),
		tr: ({ children, ...props }: MDXComponentProps) => (
			<tr className="border-border border-b" {...props}>
				{children}
			</tr>
		),
		th: ({ children, ...props }: MDXComponentProps) => (
			<th
				className="border-border border px-4 py-2 text-left font-semibold"
				{...props}
			>
				{children}
			</th>
		),
		td: ({ children, ...props }: MDXComponentProps) => (
			<td className="border-border border px-4 py-2" {...props}>
				{children}
			</td>
		),
		// Generic fallback for any undefined components
		__fallback: ({ children, ...props }: MDXComponentProps) => (
			<div
				className="border-muted-foreground my-4 rounded border border-dashed p-4"
				{...props}
			>
				<div className="text-muted-foreground mb-2 text-sm">
					Undefined Component
				</div>
				{children}
			</div>
		),
	};

	if (!content) {
		return null;
	}

	if (!serializedContent) {
		return (
			<div className="prose prose-neutral dark:prose-invert max-w-none">
				<div className="animate-pulse">
					<div className="bg-muted mb-2 h-4 rounded"></div>
					<div className="bg-muted mb-2 h-4 w-3/4 rounded"></div>
					<div className="bg-muted h-4 w-1/2 rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"prose prose-neutral dark:prose-invert max-w-none",
				className
			)}
		>
			<MDXRemote {...serializedContent} components={components} />
		</div>
	);
};
