import { NextRequest, NextResponse } from 'next/server';
import { generateInvitationToken, getInvitationExpiry } from '@/lib/invitation-utils';
import { sendInvitationEmail } from '@/lib/email';
import { prisma } from '@repo/db';
import { auth } from '../../../../../auth';
import { checkPermission } from '@/features/permissions/lib/checkPermissions';

export async function POST(request: NextRequest) {
	try {
		const { email, roleId, trailerId, trailerAccessRoleId } = await request.json();
		const session = await auth()
		console.log("its here", trailerAccessRoleId)

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

		const { hasPermission } = await checkPermission({
			scope: "trailer",
			resource: "trailers",
			action: "create",
			roleId: trailerAccessRoleId
		})

		console.log("Has Permission", hasPermission)

		if (!hasPermission) {
			console.log("no permission===>>>>>", hasPermission)
			return NextResponse.json(
				{ error: 'Only owner and co-owner can send invites' },
				{ status: 401 }
			);

		}

		console.log("TRAILER ID:", trailerId)

		const existingUser = await prisma.user.findFirst({
			where: {
				email
			}
		})

		if (!roleId) {
			console.log('no email')
			return NextResponse.json(
				{ error: 'Role is required' },
				{ status: 400 }
			);
		}
		if (!trailerId) {
			console.log('no trailer')
			return NextResponse.json(
				{ error: 'Trailer is required' },
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

		// // Check if user has a trailer
		// const userWithTrailer = await prisma.user.findUnique({
		// 	where: { id: user.id },
		// 	include: { trailers: true },
		// });
		//
		// if (!userWithTrailer?.trailers.length) {
		// 	console.log('no trailer')
		// 	return NextResponse.json(
		// 		{ error: 'You do not have a trailer to share' },
		// 		{ status: 400 }
		// 	);
		// }

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
				trailerId,
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
		const existingUserAccess = await prisma.user.findUnique({
			where: { email },
			include: {
				trailerAccesses: {
					where: { trailerId },
				},
			},
		});

		if (existingUserAccess?.trailerAccesses.length) {
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
				trailerId,
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

		if (!existingUser) {
			await sendInvitationEmail(email, token, user.email);
		}

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
