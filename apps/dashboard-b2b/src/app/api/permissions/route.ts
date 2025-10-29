import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

// GET all permissions
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
		const permissions = await prisma.permission.findMany({
			where: {
				context
			},
			include: {
				_count: {
					select: {
						roles: true,
					},
				},
			},
			orderBy: [
				{ resource: 'asc' },
			],
		});

		// Format the response
		const formattedPermissions = permissions.map((permission) => ({
			id: permission.id,
			actions: permission.actions,
			resource: permission.resource,
			scope: permission.scope,
			description: permission.description,
			roleCount: permission._count.roles,
			createdAt: permission.createdAt,
			updatedAt: permission.updatedAt,
		}));

		return NextResponse.json(formattedPermissions);
	} catch (error) {
		console.error('Error fetching permissions:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch permissions' },
			{ status: 500 }
		);
	}
}

// POST - Create new permission
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { actions, resource, scope = 'all', description, context } = body;

		if (!actions || !Array.isArray(actions) || actions.length === 0 || !resource) {
			console.log("Actions:", actions, resource)
			return NextResponse.json(
				{ error: 'Actions (array) and resource are required' },
				{ status: 400 }
			);
		}

		// Check if permission already exists
		const existingPermission = await prisma.permission.findUnique({
			where: {
				resource_scope_context: {
					resource,
					scope,
					context
				},
			},
		});

		if (existingPermission) {
			return NextResponse.json(
				{ error: 'Permission with this combination already exists' },
				{ status: 400 }
			);
		}

		// Create permission
		const permission = await prisma.permission.create({
			data: {
				actions,
				resource,
				scope,
				description,
				context
			},
			include: {
				_count: {
					select: {
						roles: true,
					},
				},
			},
		});

		return NextResponse.json(permission, { status: 201 });
	} catch (error) {
		console.error('Error creating permission:', error);
		return NextResponse.json(
			{ error: 'Failed to create permission' },
			{ status: 500 }
		);
	}
}
