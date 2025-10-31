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

// POST - Create new role
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, description, permissionIds, context } = body;

		if (!name) {
			return NextResponse.json(
				{ error: 'Role name is required' },
				{ status: 400 }
			);
		}

		// Check if role already exists
		const existingRole = await prisma.role.findFirst({
			where: { name },
		});

		if (existingRole) {
			return NextResponse.json(
				{ error: 'Role with this name already exists' },
				{ status: 400 }
			);
		}

		// Create role with permissions
		const role = await prisma.role.create({
			data: {
				name,
				description,
				context,
				permissions: permissionIds
					? {
						create: permissionIds.map((permissionId: string) => ({
							permissionId,
						})),
					}
					: undefined,
			},
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});

		return NextResponse.json(role, { status: 201 });
	} catch (error) {
		console.error('Error creating role:', error);
		return NextResponse.json(
			{ error: 'Failed to create role' },
			{ status: 500 }
		);
	}
}
