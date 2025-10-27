import { prisma } from "@repo/db";

export default async function fetchInvitations({ trailerId, userId }: { trailerId: string; userId: string; }) {
	const invitations = await prisma.invitation.findMany({
		where: { inviterId: userId, trailerId },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			email: true,
			status: true,
			createdAt: true,
			expiresAt: true,
			roleId: true
		},
	});
	return invitations
}
