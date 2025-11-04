import { prisma } from "@repo/db";

interface CheckPermissionParams {
	roleId: string;
	action: string;
	resource: string;
	scope?: string;
}

interface PermissionCheckResult {
	hasPermission: boolean;
	matchedPermission?: {
		id: string;
		actions: string[];
		resource: string;
		scope: string;
		context: string;
	};
}

export async function checkPermission({
	roleId,
	action,
	resource,
	scope = 'all'
}: CheckPermissionParams): Promise<PermissionCheckResult> {
	try {
		// Fetch the role with its permissions
		const role = await prisma.role.findUnique({
			where: { id: roleId },
			include: {
				permissions: {
					include: {
						permission: true
					}
				}
			}
		});

		// If role doesn't exist, no permission
		if (!role) {
			return { hasPermission: false };
		}

		// Check each permission associated with the role
		for (const rolePermission of role.permissions) {
			const permission = rolePermission.permission;

			// Check if the permission matches the resource
			if (permission.resource !== resource) {
				continue;
			}

			// Check if the permission's scope matches (or if permission has "all" scope)
			if (permission.scope !== 'all' && permission.scope !== scope) {
				continue;
			}

			// Check if the action is in the actions array
			if (permission.actions.includes(action)) {
				return {
					hasPermission: true,
					matchedPermission: {
						id: permission.id,
						actions: permission.actions,
						resource: permission.resource,
						scope: permission.scope,
						context: permission.context
					}
				};
			}
		}

		// No matching permission found
		return { hasPermission: false };
	} catch (error) {
		console.error('Error checking permission:', error);
		throw new Error('Failed to check permission');
	}
}
