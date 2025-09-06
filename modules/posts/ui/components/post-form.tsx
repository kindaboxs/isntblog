"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { MarkdownEditor } from "@/components/global/markdown-editor";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	postInsertSchema,
	type PostInsertSchema,
} from "@/modules/posts/schemas";
import { useTRPC } from "@/trpc/client";

export const PostForm = () => {
	const trpc = useTRPC();

	const form = useForm<PostInsertSchema>({
		resolver: zodResolver(postInsertSchema),
		defaultValues: {
			title: "",
			description: "",
			content: "",
		},
		mode: "all",
	});

	const createPost = useMutation(
		trpc.post.create.mutationOptions({
			onSuccess: async () => {
				toast.success("Post created successfully");
			},

			onError: (error) => {
				toast.error(error.message);
			},
		})
	);

	const isPending = createPost.isPending;

	const onSubmitForm = (values: PostInsertSchema) => {
		createPost.mutate({ ...values });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
				<div className="space-y-4">
					<FormField
						name="title"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input
										placeholder="title"
										type="text"
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="description"
										disabled={isPending}
										rows={3}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<MarkdownEditor
										placeholder="Content"
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" disabled={isPending}>
					{isPending ? "Creating..." : "Create Post"}
				</Button>
			</form>
		</Form>
	);
};
