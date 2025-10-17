
"use client"
import useMqtt from "@/hooks/useMqtt"
import Header from "@repo/ui/components/elements/Header"
import UserProfile from "./common/UserProfile";
import Dashboard from "./Dashboard";

interface Props {
	email: string;
	userId: string;
	status: "authenticated" | "unauthenticated" | "loading"
}

export default function HomePage({ email, userId, status }: Props) {
	const { client, isConnected, switchData, temperatureData, waterLevelData, powerData } = useMqtt()

	if (!client) {
		return (
			<div className="h-full flex items-center justify-center">
				<p className="text-lg">Connecting to broker...</p>
			</div>
		)
	}

	return (
		<>
			{/* <div className="p-10 bg-red-500 w-full">hello</div> */}
			<Dashboard
				switchData={switchData}
				powerData={powerData}
				waterLevelData={waterLevelData}
				temperatureData={temperatureData}
			/>
		</>
	)
}
