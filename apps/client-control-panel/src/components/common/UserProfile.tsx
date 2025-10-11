"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import UserProfileMenu from "./UserProfileMenu"

export default function UserProfile() {
	const { data: session, status } = useSession()
	const router = useRouter()

	const handleLogout = async () => {
		await signOut({ redirect: false })
		router.push("/auth/login")
	}


	return (
		<UserProfileMenu
			email={session?.user?.email}
			signOut={handleLogout}
			status={status}
		/>
	)
}
