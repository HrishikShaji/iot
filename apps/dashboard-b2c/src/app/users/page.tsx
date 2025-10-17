import UserManagement from "@/features/users/components/UserManagement";
import { prisma } from "@repo/db";

async function fetchUsers() {
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
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type UsersWithPosts = ThenArg<ReturnType<typeof fetchUsers>>

export default async function Page() {
	const users: UsersWithPosts = await fetchUsers()
	console.log("USERS", users)
	return (
		<div className="h-full w-full">
			<UserManagement users={users} />
		</div>
	)
}
