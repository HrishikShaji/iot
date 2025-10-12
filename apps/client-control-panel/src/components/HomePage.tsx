"use client"
import ControlPanel from "./ControlPanel"
import Header from "./Header"
import useMqtt from "@/hooks/useMqtt"

interface Props {
	email: string;
	userId: string;
	status: "authenticated" | "unauthenticated" | "loading"
}

export default function HomePage({ email, userId, status }: Props) {
	const { client, isConnected, connectionStatus } = useMqtt()

	if (!client) {
		return (
			<div className="h-screen flex items-center justify-center">
				<p className="text-lg">Connecting to broker...</p>
			</div>
		)
	}

	return (
		<>
			<Header
				isConnected={isConnected}
				email={email}
				status={status}
			/>
			<ControlPanel
				client={client}
				email={email}
				userId={userId}
			/>

		</>
	)
}
