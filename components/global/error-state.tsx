"use client";

import { useEffect } from "react";
import Link from "next/link";

import { AlertTriangleIcon, ArrowLeftIcon, RefreshCcwIcon } from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const ErrorState = ({
	title,
	description,
	error,
	resetAction,
	resetErrorBoundaryAction,
}: {
	title?: string;
	description?: string;
	error?: Error & { digest?: string };
	resetAction?: () => void;
	resetErrorBoundaryAction?: (...args: unknown[]) => void;
}) => {
	const isDev = process.env.NODE_ENV !== "production";

	useEffect(() => {
		if (error) {
			console.error(error);
		}
	}, [error]);

	return (
		<div className="mt-8 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Alert variant="destructive">
					<AlertTriangleIcon className="size-4" />
					<AlertTitle>{title ?? "Oops! Something went wrong"}</AlertTitle>
					<AlertDescription>
						{description ??
							"We&apos;re sorry, but we encountered an unexpected error."}
					</AlertDescription>
				</Alert>

				<div className="mt-4 space-y-4">
					{resetAction && (
						<Button className="w-full" onClick={resetAction}>
							<RefreshCcwIcon className="size-4" />
							Try again
						</Button>
					)}
					{resetErrorBoundaryAction && (
						<Button className="w-full" onClick={resetErrorBoundaryAction}>
							<RefreshCcwIcon className="size-4" />
							Try again
						</Button>
					)}
					<Button variant="outline" className="w-full" asChild>
						<Link href="/">
							<ArrowLeftIcon className="size-4" />
							Go Home
						</Link>
					</Button>

					{isDev ? (
						<Accordion type="single" collapsible className="w-full">
							<AccordionItem value="error-details">
								<AccordionTrigger>View Error Details</AccordionTrigger>
								<AccordionContent>
									<div className="bg-muted rounded-md p-4">
										<h3 className="mb-2 font-semibold">Error Message:</h3>
										<p className="mb-4 text-sm">{error?.message}</p>

										<h3 className="mb-2 font-semibold">Error Stack Trace:</h3>
										<pre className="overflow-x-auto text-xs whitespace-pre-wrap">
											{error?.stack}
										</pre>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					) : null}
				</div>
			</div>
		</div>
	);
};
