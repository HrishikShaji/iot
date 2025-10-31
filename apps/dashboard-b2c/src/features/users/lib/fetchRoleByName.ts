import { prisma } from "@repo/db";

export default async function fetchRoleByName({ context, name }: { context: "B2B" | "B2C", name: string }) {
	const role = await prisma.role.findFirst({
		where: {
			context,
			name
		},
	});

	return role

}

