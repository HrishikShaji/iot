import { prisma } from "@repo/db";

interface PermissionCheck {
	userId: string;
	action: string;
	resource: string;
	scope?: string;
	organizationId?: string; // for B2B context
}

export async function checkUserPermission({
	userId,
	action,
	resource,
	scope = 'all',
	organizationId
}: PermissionCheck): Promise<boolean> {
	try {
		// // Get user with their role and permissions
		// const user = await prisma.user.findUnique({
		// 	where: { id: userId },
		// 	include: {
		// 		role: {
		// 			include: {
		// 				permissions: {
		// 					include: {
		// 						permission: true
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// });
		//
		// if (!user || !user.role) {
		// 	return false;
		// }
		// console.log("User permissions:", user.role.permissions)
		// // Check if user's role has the required permission
		// const hasPermission = user.role.permissions.some(rp => {
		// 	const perm = rp.permission;
		//
		// 	// Match action and resource
		// 	const actionMatch =
		// 		perm.actions.includes(action) ||
		// 		perm.actions.includes('*');
		// 	const resourceMatch = perm.resource === resource || perm.resource === '*';
		// 	const scopeMatch = perm.scope === scope || perm.scope === 'all';
		// 	console.log("Action Match:", actionMatch)
		// 	console.log("Resource Match:", resourceMatch)
		// 	console.log("Scope Match:", scopeMatch)
		//
		// 	// Context validation
		// 	// const contextMatch =
		// 	// 	perm.context === 'both' ||
		// 	// 	(organizationId && perm.context === 'B2B') ||
		// 	// 	(!organizationId && perm.context === 'B2C');
		//
		// 	return actionMatch && resourceMatch && scopeMatch;
		// });
		//
		// // Additional check: verify organization context for B2B
		// // if (organizationId && user.role.context === 'B2B') {
		// // 	if (user.role.organizationId !== organizationId) {
		// // 		return false;
		// // 	}
		// // }
		//
		return true;
	} catch (error) {
		console.error('Permission check error:', error);
		return false;
	}
}
