import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';

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

		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const sharedTrailers = await prisma.trailerAccess.findMany({
			where: { userId: user.id },
			include: {
				trailer: {
					include: {
						user: {
							select: {
								email: true,
							},
						},
					},
				},
				role: {
					select: {
						id: true,
						name: true,
						description: true
					}
				}
			},
		});

		return NextResponse.json({ sharedTrailers });
	} catch (error) {
		console.error('Error fetching shared trailers:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch shared trailers' },
			{ status: 500 }
		);
	}
}
