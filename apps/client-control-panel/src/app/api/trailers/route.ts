import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

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

		const trailers = await prisma.trailer.findMany({
			where: {
				userId: user.id
			},
			include: {
				user: true
			}
		})

		return NextResponse.json({ trailers });
	} catch (error) {
		console.error('Error fetching shared trailers:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch shared trailers' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth()
		const { name } = await request.json()
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

		const trailer = await prisma.trailer.create({
			data: {
				userId: user.id,
				name
			}
		})

		return NextResponse.json({ trailer });
	} catch (error) {
		console.error('Error creating trailer:', error);
		return NextResponse.json(
			{ error: 'Failed to create trailer' },
			{ status: 500 }
		);
	}
}
