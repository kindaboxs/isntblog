import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PostForm } from "@/modules/posts/ui/components/post-form";

export const PostSubmitView = () => {
	return (
		<div className="w-full">
			<Card className="mx-auto mt-12">
				<CardHeader>
					<CardTitle>Create Post</CardTitle>
					<CardDescription>Submit a new post</CardDescription>
				</CardHeader>
				<CardContent>
					<PostForm />
				</CardContent>
			</Card>
		</div>
	);
};
