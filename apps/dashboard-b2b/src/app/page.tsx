"use client"

import UserProfile from "@/components/common/UserProfile";
import HomePage from "@/components/HomePage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MqttConnectionStatus from "@/components/common/MqttConnectionStatus";

export default function Home() {
	const router = useRouter()
	const { data: session, status } = useSession()

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/login")
		}
	}, [status, router])

	if (status === "loading") {
		return (
			<div className="h-full flex items-center justify-center">
				<p className="text-lg">Loading...</p>
			</div>
		)
	}

	if (status !== "authenticated" || !session.user?.id || !session.user.email) {
		return null
	}
	return (
		<HomePage
			email={session.user.email}
			status={status}
			userId={session.user.id}
		/>
	);
}
