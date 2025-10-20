import { NextRequest, NextResponse } from 'next/server';
import { generateInvitationToken, getInvitationExpiry } from '@/lib/invitation-utils';
import { sendInvitationEmail } from '@/lib/email';
import { prisma } from '@repo/db';
import { auth } from '../../../../../auth';

export async function POST(request: NextRequest) {
	try {
		console.log("its here")
		const session = await auth()

		if (!session) {
			console.log('no session')
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);

		}

		const user = session.user

		if (!user) {
			console.log('no user')
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { email, roleId } = await request.json();

		if (!roleId) {
			console.log('no email')
			return NextResponse.json(
				{ error: 'Role is required' },
				{ status: 400 }
			);
		}

		if (!email || !email.includes('@')) {
			console.log('no email')
			return NextResponse.json(
				{ error: 'Invalid email address' },
				{ status: 400 }
			);
		}

		// Check if user has a trailer
		const userWithTrailer = await prisma.user.findUnique({
			where: { id: user.id },
			include: { trailer: true },
		});

		if (!userWithTrailer?.trailer) {
			console.log('no trailer')
			return NextResponse.json(
				{ error: 'You do not have a trailer to share' },
				{ status: 400 }
			);
		}

		// Check if user is trying to invite themselves
		if (email === user.email) {
			console.log('cannot invite yourself')
			return NextResponse.json(
				{ error: 'You cannot invite yourself' },
				{ status: 400 }
			);
		}

		// Check if invitation already exists
		const existingInvitation = await prisma.invitation.findFirst({
			where: {
				email,
				trailerId: userWithTrailer.trailer.id,
				status: 'PENDING',
				expiresAt: { gt: new Date() },
			},
		});

		if (existingInvitation) {
			console.log('active invitation')
			return NextResponse.json(
				{ error: 'An active invitation already exists for this email' },
				{ status: 400 }
			);
		}

		// Check if user already has access
		const existingUser = await prisma.user.findUnique({
			where: { email },
			include: {
				trailerAccesses: {
					where: { trailerId: userWithTrailer.trailer.id },
				},
			},
		});

		if (existingUser?.trailerAccesses.length) {
			console.log('already has access')
			return NextResponse.json(
				{ error: 'This user already has access to your trailer' },
				{ status: 400 }
			);
		}

		// Create invitation
		const token = generateInvitationToken();
		const expiresAt = getInvitationExpiry();

		const invitation = await prisma.invitation.create({
			data: {
				roleId,
				email,
				inviterId: user.id,
				trailerId: userWithTrailer.trailer.id,
				token,
				expiresAt,
				status: 'PENDING',
			},
		});

		// Send invitation email
		if (!user.email) {
			console.log('no email to sent')
			return NextResponse.json(
				{ error: 'Failed to send invitation becaouse no email' },
				{ status: 500 }
			);

		}
		await sendInvitationEmail(email, token, user.email);

		return NextResponse.json({
			message: 'Invitation sent successfully',
			invitation: {
				id: invitation.id,
				email: invitation.email,
				expiresAt: invitation.expiresAt,
			},
		});
	} catch (error) {
		console.error('Error sending invitation:', error);
		return NextResponse.json(
			{ error: 'Failed to send invitation' },
			{ status: 500 }
		);
	}
}
