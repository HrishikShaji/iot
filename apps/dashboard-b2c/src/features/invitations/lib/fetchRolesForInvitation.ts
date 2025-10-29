import { prisma } from "@repo/db";

export async function fetchRolesForInvitation(context: "B2C" | "B2B") {
	const roles = await prisma.role.findMany({
		where: {
			context
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return roles
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type RolesForInvitation = ThenArg<ReturnType<typeof fetchRolesForInvitation>>

