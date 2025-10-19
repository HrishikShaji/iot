// app/api/trailers/access/[accessId]/route.ts
import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';

// Update access type
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { accessId: string } }
) {
	try {
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

		const { accessType } = await request.json();

		if (!['VIEW', 'EDIT', 'ADMIN'].includes(accessType)) {
			return NextResponse.json(
				{ error: 'Invalid access type' },
				{ status: 400 }
			);
		}

		const access = await prisma.trailerAccess.findUnique({
			where: { id: params.accessId },
			include: { trailer: true },
		});

		if (!access || access.trailer.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Access not found or unauthorized' },
				{ status: 404 }
			);
		}

		const updatedAccess = await prisma.trailerAccess.update({
			where: { id: params.accessId },
			data: { accessType },
		});

		return NextResponse.json({ access: updatedAccess });
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
	{ params }: { params: { accessId: string } }
) {
	try {
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

		const access = await prisma.trailerAccess.findUnique({
			where: { id: params.accessId },
			include: { trailer: true },
		});

		if (!access || access.trailer.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Access not found or unauthorized' },
				{ status: 404 }
			);
		}

		await prisma.trailerAccess.delete({
			where: { id: params.accessId },
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
