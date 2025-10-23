import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const session = await auth()
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const user = session.user;

		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const invitation = await prisma.invitation.findUnique({
			where: { id },
		});

		if (!invitation || invitation.inviterId !== user.id) {
			return NextResponse.json(
				{ error: 'Invitation not found' },
				{ status: 404 }
			);
		}

		await prisma.invitation.update({
			where: { id },
			data: { status: 'EXPIRED' },
		});

		return NextResponse.json({ message: 'Invitation revoked successfully' });
	} catch (error) {
		console.error('Error revoking invitation:', error);
		return NextResponse.json(
			{ error: 'Failed to revoke invitation' },
			{ status: 500 }
		);
	}
}
