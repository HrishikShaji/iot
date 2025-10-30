import { prisma } from "@repo/db";

export async function validateInvitation(token: string) {
	const invitation = await prisma.invitation.findUnique({
		where: { token },
		include: {
			inviter: {
				select: {
					email: true,
				},
			},
			trailer: {
				select: {
					name: true,
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
	});

	return invitation
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type ValidatedInvitation = ThenArg<ReturnType<typeof validateInvitation>>

