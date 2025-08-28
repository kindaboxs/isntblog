import { Loader2Icon } from "lucide-react";

interface Props {
	title: string;
	description: string;
}

export const LoadingState = ({ title, description }: Props) => {
	return (
		<div className="mx-auto mt-8 flex flex-col items-center justify-center gap-y-6">
			<Loader2Icon className="size-6 animate-spin" />
			<div className="flex flex-col items-center gap-y-2">
				<h6 className="text-lg font-semibold">{title}</h6>
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
		</div>
	);
};
