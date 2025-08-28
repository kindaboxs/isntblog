import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { createTRPCContext } from "@/trpc/init";
import { createQueryClient } from "@/trpc/query-client";
import { appRouter, createCaller } from "@/trpc/routers";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
	const heads = new Headers(await headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
	});
});

export const getQueryClient = cache(createQueryClient);
export const caller = createCaller(createContext);

export const trpc = createTRPCOptionsProxy({
	ctx: createContext,
	router: appRouter,
	queryClient: getQueryClient,
});
