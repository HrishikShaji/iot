// app/api/trailers/access/[accessId]/route.ts
import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';

// Update access type
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ accessId: string }> }
) {
	try {
		const { accessId } = await params
		console.log("this is access id:", accessId)
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

		console.log("CURRENT USER:", user)
		const { accessType, roleId } = await request.json();

		if (!roleId) {
			return NextResponse.json(
				{ error: 'Invalid role' },
				{ status: 400 }
			);
		}

		const access = await prisma.trailerAccess.findUnique({
			where: { id: accessId },
			include: { trailer: true, user: true },
		});

		if (!access || access.trailer.userId !== user.id) {
			console.log('access not found', access)
			return NextResponse.json(
				{ error: 'Access not found or unauthorized' },
				{ status: 404 }
			);
		}

		const updatedAccess = await prisma.trailerAccess.update({
			where: { id: accessId },
			data: { roleId },
		});

		const updatedUser = await prisma.user.update({
			where: { id: access.userId },
			data: {
				roleId
			}
		})

		console.log("updating user:", updatedUser.email)


		return NextResponse.json({ access: updatedAccess, updatedUser });
	} catch (error) {
		console.error('Error updating access:', error);
		return NextResponse.json(
			{ error: 'Failed to update access' },
			{ status: 500 }
		);
	}
}

// Revoke access
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ accessId: string }> }
) {
	try {
		const { accessId } = await params
		const session = await auth()
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const user = session.user;

		console.log("CURRENT USER:", user)

		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const access = await prisma.trailerAccess.findUnique({
			where: { id: accessId },
			include: { trailer: true, user: true },
		});

		console.log("USER WITH ACCESS", access)

		if (!access || access.trailer.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Access not found or unauthorized' },
				{ status: 404 }
			);
		}

		await prisma.trailerAccess.delete({
			where: { id: accessId },
		});

		return NextResponse.json({ message: 'Access revoked successfully' });
	} catch (error) {
		console.error('Error revoking access:', error);
		return NextResponse.json(
			{ error: 'Failed to revoke access' },
			{ status: 500 }
		);
	}
}
