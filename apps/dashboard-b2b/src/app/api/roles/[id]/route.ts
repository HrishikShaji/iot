import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

// GET single role
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		const role = await prisma.role.findUnique({
			where: { id },
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});

		if (!role) {
			return NextResponse.json(
				{ error: 'Role not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(role);
	} catch (error) {
		console.error('Error fetching role:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch role' },
			{ status: 500 }
		);
	}
}

// PUT - Update role
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		const body = await request.json();
		const { name, description, permissionIds } = body;

		// Check if role exists
		const existingRole = await prisma.role.findUnique({
			where: { id },
		});

		if (!existingRole) {
			return NextResponse.json(
				{ error: 'Role not found' },
				{ status: 404 }
			);
		}

		// If name is being changed, check for conflicts
		if (name && name !== existingRole.name) {
			const nameConflict = await prisma.role.findFirst({
				where: { name },
			});

			if (nameConflict) {
				return NextResponse.json(
					{ error: 'Role with this name already exists' },
					{ status: 400 }
				);
			}
		}

		// Update role and permissions
		const role = await prisma.role.update({
			where: { id },
			data: {
				name,
				description,
				permissions: permissionIds
					? {
						deleteMany: {}, // Remove all existing permissions
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

		return NextResponse.json(role);
	} catch (error) {
		console.error('Error updating role:', error);
		return NextResponse.json(
			{ error: 'Failed to update role' },
			{ status: 500 }
		);
	}
}

// DELETE role
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		// Check if role exists
		const role = await prisma.role.findUnique({
			where: { id },
		});

		if (!role) {
			return NextResponse.json(
				{ error: 'Role not found' },
				{ status: 404 }
			);
		}

		// Prevent deletion if role has users
		// if (role._count.users > 0) {
		// 	return NextResponse.json(
		// 		{ error: 'Cannot delete role with assigned users' },
		// 		{ status: 400 }
		// 	);
		// }

		// Delete role (permissions will cascade delete)
		await prisma.role.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: 'Role deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting role:', error);
		return NextResponse.json(
			{ error: 'Failed to delete role' },
			{ status: 500 }
		);
	}
}
