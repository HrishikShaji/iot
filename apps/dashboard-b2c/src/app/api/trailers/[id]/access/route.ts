import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';

// Get all users with access to a trailer
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
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

		// Check if user owns this trailer
		const trailer = await prisma.trailer.findUnique({
			where: { id: params.id },
		});

		if (!trailer || trailer.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Trailer not found or unauthorized' },
				{ status: 404 }
			);
		}

		const accesses = await prisma.trailerAccess.findMany({
			where: { trailerId: params.id },
			include: {
				user: {
					select: {
						id: true,
						email: true,
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
			orderBy: { grantedAt: 'desc' },
		});

		return NextResponse.json({ accesses });
	} catch (error) {
		console.error('Error fetching trailer access:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch trailer access' },
			{ status: 500 }
		);
	}
}
