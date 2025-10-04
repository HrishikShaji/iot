"use client"

import { prisma } from "@repo/db"

export default async function Page() {
	const users = await prisma.user.findMany()
	console.log("USERS:", users)
	return (
		<div>{users.length > 0 ? users[0].email : "No USERS YET"}</div>
	)
}
