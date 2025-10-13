"use client"
import Header from "@repo/ui/components/elements/Header"
import useMqtt from "@/hooks/useMqtt";
import UserProfile from "./common/UserProfile";
import B2BDashboard from "./B2BDashboard";

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
				title="Admin Dashboard"
				subtitle="View all trailers metrics"
				isConnected={isConnected}
			>
				<UserProfile
					email={email}
					status={status}
				/>
			</Header>
			<B2BDashboard />
		</>
	)
}
