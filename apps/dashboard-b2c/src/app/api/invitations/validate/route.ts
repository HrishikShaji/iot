// app/api/invitations/validate/route.ts
import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const token = request.nextUrl.searchParams.get('token');

		if (!token) {
			return NextResponse.json(
				{ error: 'Token is required' },
				{ status: 400 }
			);
		}

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
			},
		});

		if (!invitation) {
			return NextResponse.json(
				{ error: 'Invalid invitation token' },
				{ status: 404 }
			);
		}

		if (invitation.status !== 'PENDING') {
			return NextResponse.json(
				{ error: 'This invitation has already been used' },
				{ status: 400 }
			);
		}

		if (invitation.expiresAt < new Date()) {
			await prisma.invitation.update({
				where: { id: invitation.id },
				data: { status: 'EXPIRED' },
			});

			return NextResponse.json(
				{ error: 'This invitation has expired' },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			valid: true,
			invitation: {
				email: invitation.email,
				inviterEmail: invitation.inviter.email,
				trailerName: invitation.trailer.name,
			},
		});
	} catch (error) {
		console.error('Error validating invitation:', error);
		return NextResponse.json(
			{ error: 'Failed to validate invitation' },
			{ status: 500 }
		);
	}
}
