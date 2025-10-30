import { prisma } from "@repo/db";

export async function fetchInbox(email: string) {

	const invitations = await prisma.invitation.findMany({
		where: { email },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			email: true,
			status: true,
			createdAt: true,
			expiresAt: true,
			token: true,
			roleId: true,
			role: true,
			trailer: true,
			inviter: true
		},
	});

	return invitations

}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type InboxInvitations = ThenArg<ReturnType<typeof fetchInbox>>

