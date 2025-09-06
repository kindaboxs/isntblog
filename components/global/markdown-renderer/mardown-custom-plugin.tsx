import { type Root } from "react-dom/client";

export const markdownCustomPlugin = () => (tree: Root) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const visit = (node: any, callback: (node: any) => void) => {
		callback(node);
		if (node.children) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			node.children.forEach((child: any) => visit(child, callback));
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	visit(tree, (node: any) => {
		if (node.type === "code" && node.meta) {
			// Extract title from meta string like 'title="auth.ts"'
			const titleMatch = node.meta.match(/title="([^"]*)"/);
			if (titleMatch) {
				node.data = node.data ?? {};
				node.data.hProperties = node.data.hProperties ?? {};
				node.data.hProperties.title = titleMatch[1];
			}
		}
	});
};
