import { prisma } from "@repo/db";

export async function fetchTrailer({ trailerId, userId }: { trailerId: string; userId: string }) {

	const trailer = await prisma.trailer.findUnique({
		where: { id: trailerId },
		include: {
			user: {
				include: {
					role: true
				}
			},
			sharedWith: {
				where: { userId },
				include: {
					role: true
				}
			},
		},
	});

	return trailer

}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type TrailerInfo = ThenArg<ReturnType<typeof fetchTrailer>>

