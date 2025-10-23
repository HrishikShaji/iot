import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export async function GET(request: NextRequest) {
	try {
		const session = await auth()
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);

		}
		const user = session.user;

		if (!user || !user.email) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const invitations = await prisma.invitation.findMany({
			where: { email: user.email },
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
		console.log("INVITATIONS:", invitations)
		return NextResponse.json({ invitations });
	} catch (error) {
		console.error('Error fetching invitations:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch invitations' },
			{ status: 500 }
		);
	}
}
