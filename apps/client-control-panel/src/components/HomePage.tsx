"use client"
import ControlPanel from "./ControlPanel"
import useMqtt from "@/hooks/useMqtt"
import Header from "@repo/ui/components/elements/Header"
import UserProfile from "./common/UserProfile";
import { Home } from "@repo/ui/icons"

interface Props {
	email: string;
	userId: string;
	status: "authenticated" | "unauthenticated" | "loading"
}

export default function HomePage({ email, userId, status }: Props) {
	const { client, isConnected, connectionStatus } = useMqtt()

	if (!client) {
		return (
			<div className="h-full flex items-center justify-center">
				<p className="text-lg">Connecting to broker...</p>
			</div>
		)
	}

	return (
		<ControlPanel
			trailerId=""
			client={client}
			email={email}
			userId={userId}
		/>
	)
}
