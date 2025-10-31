import { prisma } from "@repo/db";

export async function fetchPermissions({ trailerId, userId }: { trailerId: string; userId: string }) {
	const trailer = await prisma.trailerAccess.findUnique({
		where: {
			userId_trailerId: {
				userId,
				trailerId
			}
		},
		include: {
			trailer: true,
			role: {
				include: {
					permissions: {
						include: {
							permission: true
						}
					}
				}
			}
		},
	});
	return trailer
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type UserTrailerPermissions = ThenArg<ReturnType<typeof fetchPermissions>>

