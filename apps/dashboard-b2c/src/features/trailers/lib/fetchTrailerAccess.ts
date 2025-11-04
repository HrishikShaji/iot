import { prisma } from "@repo/db";

export async function fetchTrailerAccess({
	trailerId,
	userId
}: {
	trailerId: string;
	userId: string
}) {
	const trailer = await prisma.trailerAccess.findUnique({
		where: {
			userId_trailerId: {
				userId,
				trailerId
			}
		},
	});
	return trailer;
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type TrailerAccessInfo = ThenArg<ReturnType<typeof fetchTrailerAccess>>;
