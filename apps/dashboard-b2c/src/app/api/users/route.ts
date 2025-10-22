import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export async function GET(request: NextRequest) {
	const session = await auth()
	if (!session?.user) {
		return NextResponse.json(
			{ error: 'No user' },
			{ status: 400 }
		);

	}
	try {
		const users = await prisma.user.findMany({
			where: {
				id: {
					not: session.user.id
				}
			}
		})

		return NextResponse.json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		);
	}
}
