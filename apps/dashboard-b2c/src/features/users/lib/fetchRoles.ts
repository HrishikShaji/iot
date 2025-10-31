import { prisma } from "@repo/db";

export default async function fetchRoles(context: "B2B" | "B2C") {
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

	return roles

}
