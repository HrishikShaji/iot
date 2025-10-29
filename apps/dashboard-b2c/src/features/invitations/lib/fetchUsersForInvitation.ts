import { prisma } from "@repo/db";

export async function fetchUsersForInvitation(userId: string) {
	const users = await prisma.user.findMany({
		where: {
			id: {
				not: userId
			}
		}
	})

	return users
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type UsersForInvitation = ThenArg<ReturnType<typeof fetchUsersForInvitation>>

