import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

// GET all roles
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const context = searchParams.get("context")

	if (!context) {
		return NextResponse.json(
			{ error: 'No context' },
			{ status: 400 }
		);

	}
	try {
		const roles = await prisma.role.findMany({
			where: {
				context
			},
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
				_count: {
					select: {
						users: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Format the response
		const formattedRoles = roles.map((role) => ({
			id: role.id,
			name: role.name,
			description: role.description,
			userCount: role._count.users,
			permissionCount: role.permissions.length,
			permissions: role.permissions.map((rp) => rp.permission),
			createdAt: role.createdAt,
			updatedAt: role.updatedAt,
		}));

		return NextResponse.json(formattedRoles);
	} catch (error) {
		console.error('Error fetching roles:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch roles' },
			{ status: 500 }
		);
	}
}
