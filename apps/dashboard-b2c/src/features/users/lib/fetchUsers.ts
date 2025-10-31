import { prisma } from "@repo/db";

export async function fetchUsers() {
	const response = await prisma.user.findMany({})

	return response
}
