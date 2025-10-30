import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';

// Get all users with access to a trailer
export async function GET(
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

		// Check if user owns this trailer
		const trailer = await prisma.trailer.findUnique({
			where: { id },
		});


		return NextResponse.json({ trailer });
	} catch (error) {
		console.error('Error fetching trailer access:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch trailer access' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		// Check if user owns this trailer
		const trailer = await prisma.trailer.delete({
			where: { id },
		});


		return NextResponse.json({ trailer });
	} catch (error) {
		console.error('Error deleting trailer :', error);
		return NextResponse.json(
			{ error: 'Failed to deleting trailer' },
			{ status: 500 }
		);
	}
}
