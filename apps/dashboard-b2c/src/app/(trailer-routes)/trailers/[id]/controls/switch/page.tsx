"use client"
import { useMqtt } from "@/contexts/MqttContext";
import SwitchCard from "@/features/switch/components/SwitchCard";
import SwitchChart1 from "@/features/switch/components/SwitchChart1";
import SwitchStatsTable from "@/features/switch/components/SwitchStatsTable";
import useSwitchMonitoring from "@/features/switch/hooks/useSwitchMonitoring";
import { useSession } from "next-auth/react";

export default function Page() {
	const { client } = useMqtt()
	const { status, data } = useSession()
	const { messages } = useSwitchMonitoring()
	if (!client) return <div>No Client</div>
	if (status === "loading") return <div>Loading...</div>
	if (status === "unauthenticated") return <div>Unauthenticated</div>
	if (!data?.user.id || !data.user.email) return <div>No user</div>
	return (
		<div className="p-10">
			<SwitchCard client={client} userId={data.user.id} email={data.user.email} />
			<div className="flex gap-5">
				<div className="flex-1">
					<SwitchChart1 messages={messages} />
				</div>
				<div className="flex-1">
					<SwitchStatsTable messages={messages} />
				</div>
			</div>
		</div>
	)
}
