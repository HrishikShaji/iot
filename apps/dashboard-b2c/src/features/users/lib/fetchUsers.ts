import { prisma } from "@repo/db";

export async function fetchUsers() {
	const response = await prisma.user.findMany({
		where: {
			role: {
				context: "B2C"
			}
		},
		include: {
			role: true
		}
	})

	return response
}
