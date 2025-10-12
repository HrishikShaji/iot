"use client"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import UserProfileMenu from "@repo/ui/components/elements/UserProfileMenu"

interface Props {
	email: string;
	status: "authenticated" | "unauthenticated" | "loading";
}

export default function UserProfile({ email, status }: Props) {
	const router = useRouter()

	const handleLogout = async () => {
		await signOut({ redirect: false })
		router.push("/auth/login")
	}


	return (
		<UserProfileMenu
			email={email}
			signOut={handleLogout}
			status={status}
		/>
	)
}
