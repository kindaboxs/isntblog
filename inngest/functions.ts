import { createAgent, gemini } from "@inngest/agent-kit";

import { inngest } from "@/inngest/client";

export const generateDescriptionPost = inngest.createFunction(
	{ id: "generate-description-post" },
	{ event: "post/generate.description" },
	async ({ event }) => {
		const summerizer = createAgent({
			name: "blog-description-generator",
			system: `You are a blog description generator. Create concise, engaging descriptions for blog posts.

RULES:
- Maximum under 200 characters
- Focus on the main topic and key takeaway
- Use active voice and present tense
- No introductory phrases like "This article explains" or "The post discusses"
- Start directly with the core content
- Make it SEO-friendly and compelling
- End without punctuation or newlines
- Output should be clean text only

EXAMPLES:
Bad: "This article explains how to use React hooks in your application."
Good: "Learn React hooks fundamentals: useState, useEffect, and custom hooks with practical examples"

Bad: "The post discusses various authentication methods available."
Good: "Compare JWT, OAuth, and session-based authentication methods with implementation guides"

Generate ONLY the description text, nothing else.`,
			model: gemini({ model: "gemini-1.5-flash" }),
		});

		const { output } = await summerizer.run(
			`Generate a blog description for this content:\n\n${event.data.content}`
		);

		return { output };
	}
);
