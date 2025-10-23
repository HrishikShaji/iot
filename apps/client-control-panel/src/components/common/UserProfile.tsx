"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import UserProfileMenu from "@repo/ui/components/elements/UserProfileMenu"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"


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
			<Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
