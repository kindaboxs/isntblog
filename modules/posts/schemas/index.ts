import { z } from "zod";

export const postInsertSchema = z.object({
	title: z
		.string()
		.min(1, { message: "Title is required" })
		.max(100, { message: "Title is too long" }),
	description: z.string().max(200, { message: "Description is too long" }),
	content: z
		.string()
		.min(1, { message: "Content is required" })
		.max(10000, { message: "Content is too long" }),
});

export type PostInsertSchema = z.infer<typeof postInsertSchema>;
