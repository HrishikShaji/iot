"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ControlPanel from "./ControlPanel"
import { useEffect } from "react"

export default function HomePage() {
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

	return (
		<div></div>
	)
}
