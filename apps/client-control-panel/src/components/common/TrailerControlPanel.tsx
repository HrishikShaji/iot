"use client"

import { useRouter } from "next/navigation";
import ControlPanel from "../ControlPanel";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useMqtt from "@/hooks/useMqtt"

interface Props {
	trailerId: string;
}

export default function TrailerControlPanel({ trailerId }: Props) {
	const router = useRouter()
	const { data: session, status } = useSession()
	const { client, isConnected, connectionStatus } = useMqtt()

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

	if (!client) {
		return <div>No client</div>
	}
	return (
		<div>
			<ControlPanel
				client={client}
				email={session.user.email}
				userId={session.user.id}
				trailerId={trailerId}
			/>
		</div>
	)
}
