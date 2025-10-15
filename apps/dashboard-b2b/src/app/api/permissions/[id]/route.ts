import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

// GET single permission
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		const permission = await prisma.permission.findUnique({
			where: { id },
			include: {
				roles: {
					include: {
						role: true,
					},
				},
				_count: {
					select: {
						roles: true,
					},
				},
			},
		});

		if (!permission) {
			return NextResponse.json(
				{ error: 'Permission not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(permission);
	} catch (error) {
		console.error('Error fetching permission:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch permission' },
			{ status: 500 }
		);
	}
}

// PUT - Update permission
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		const body = await request.json();
		const { action, resource, scope, description } = body;

		// Check if permission exists
		const existingPermission = await prisma.permission.findUnique({
			where: { id },
		});

		if (!existingPermission) {
			return NextResponse.json(
				{ error: 'Permission not found' },
				{ status: 404 }
			);
		}

		// If the unique combination is being changed, check for conflicts
		if (
			action &&
			resource &&
			scope &&
			(action !== existingPermission.action ||
				resource !== existingPermission.resource ||
				scope !== existingPermission.scope)
		) {
			const conflict = await prisma.permission.findUnique({
				where: {
					action_resource_scope: {
						action,
						resource,
						scope,
					},
				},
			});

			if (conflict) {
				return NextResponse.json(
					{ error: 'Permission with this combination already exists' },
					{ status: 400 }
				);
			}
		}

		// Update permission
		const permission = await prisma.permission.update({
			where: { id },
			data: {
				action,
				resource,
				scope,
				description,
			},
			include: {
				_count: {
					select: {
						roles: true,
					},
				},
			},
		});

		return NextResponse.json(permission);
	} catch (error) {
		console.error('Error updating permission:', error);
		return NextResponse.json(
			{ error: 'Failed to update permission' },
			{ status: 500 }
		);
	}
}

// DELETE permission
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		// Check if permission exists
		const permission = await prisma.permission.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						roles: true,
					},
				},
			},
		});

		if (!permission) {
			return NextResponse.json(
				{ error: 'Permission not found' },
				{ status: 404 }
			);
		}

		// Optionally prevent deletion if permission is assigned to roles
		if (permission._count.roles > 0) {
			return NextResponse.json(
				{ error: 'Cannot delete permission assigned to roles' },
				{ status: 400 }
			);
		}

		// Delete permission
		await prisma.permission.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: 'Permission deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting permission:', error);
		return NextResponse.json(
			{ error: 'Failed to delete permission' },
			{ status: 500 }
		);
	}
}
