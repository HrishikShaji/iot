"use client"
import ControlPanel from "./ControlPanel"
import useMqtt from "@/hooks/useMqtt"
import Header from "@repo/ui/components/elements/Header"
import UserProfile from "./common/UserProfile";

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
				title="Trailer Control Panel"
				subtitle="Interactive sensor control with sliders and toggles"
				isConnected={isConnected}
			>
				<UserProfile
					email={email}
					status={status}
				/>
			</Header>
			<ControlPanel
				client={client}
				email={email}
				userId={userId}
			/>

		</>
	)
}
