import { postInsertSchema } from "@/modules/posts/schemas";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const postsRouter = createTRPCRouter({
	create: publicProcedure
		.input(postInsertSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					...input,
				},
			});
		}),
});
