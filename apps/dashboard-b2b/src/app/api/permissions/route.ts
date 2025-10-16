import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

// GET all permissions
export async function GET() {
	try {
		const permissions = await prisma.permission.findMany({
			include: {
				_count: {
					select: {
						roles: true,
					},
				},
			},
			orderBy: [
				{ resource: 'asc' },
				{ action: 'asc' },
			],
		});

		// Format the response
		const formattedPermissions = permissions.map((permission) => ({
			id: permission.id,
			action: permission.action,
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
		const { action, resource, scope = 'all', description, context } = body;

		if (!action || !resource) {
			return NextResponse.json(
				{ error: 'Action and resource are required' },
				{ status: 400 }
			);
		}

		// Check if permission already exists
		const existingPermission = await prisma.permission.findUnique({
			where: {
				action_resource_scope_context: {
					action,
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
				action,
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
