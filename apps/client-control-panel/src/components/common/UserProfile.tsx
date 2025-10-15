"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import UserProfileMenu from "@repo/ui/components/elements/UserProfileMenu"
import { useEffect } from "react"


export default function UserProfile() {
	const router = useRouter()
	const { data: session, status } = useSession()

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/login")
		}
	}, [status, router])

	if (status === "loading") {
		return (
			<div className="h-screen flex items-center justify-center">
				<p className="text-lg">Loading...</p>
			</div>
		)
	}

	if (status !== "authenticated" || !session.user?.id || !session.user.email) {
		return null
	}

	const handleLogout = async () => {
		await signOut({ redirect: false })
		router.push("/auth/login")
	}


	return (
		<UserProfileMenu
			email={session.user.email}
			signOut={handleLogout}
			status={status}
		/>
	)
}
