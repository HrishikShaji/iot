import { prisma } from "@repo/db";

export default async function fetchTrailerAccesses(id: string) {
	const accesses = await prisma.trailerAccess.findMany({
		where: { trailerId: id },
		include: {
			user: {
				select: {
					id: true,
					email: true,
				},
			},
			role: {
				select: {
					id: true,
					description: true,
					name: true
				}
			}
		},
		orderBy: { grantedAt: 'desc' },
	});

	return accesses

}
