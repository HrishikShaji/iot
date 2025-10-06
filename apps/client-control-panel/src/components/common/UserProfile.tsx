"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UserProfile() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleLogout = async () => {
		setIsLoggingOut(true)
		await signOut({ redirect: false })
		router.push("/auth/login")
	}

	if (status === "loading") {
		return <div>Loading...</div>
	}

	if (status === "unauthenticated" || !session) {
		return null
	}

	return (
		<div style={{
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "1rem"
		}}>
			<div>
				<p style={{ margin: 0, fontWeight: "bold" }}>
					Welcome, {session.user?.email}
				</p>
				<p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
					Logged in
				</p>
			</div>

			<button
				onClick={handleLogout}
				disabled={isLoggingOut}
				style={{
					padding: "0.5rem 1rem",
					backgroundColor: "#dc2626",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: isLoggingOut ? "not-allowed" : "pointer",
					opacity: isLoggingOut ? 0.6 : 1
				}}
			>
				{isLoggingOut ? "Logging out..." : "Logout"}
			</button>
		</div>
	)
}
