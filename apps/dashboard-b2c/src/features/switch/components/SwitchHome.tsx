"use client"
import { useMqtt } from "@/contexts/MqttContext";
import SwitchCard from "@/features/switch/components/SwitchCard";
import { useSession } from "next-auth/react";

interface Props {
	trailerId: string;
}

export default function SwitchHome({ trailerId }: Props) {
	const { client } = useMqtt()
	const { status, data } = useSession()
	if (!client) return <div>No Client</div>
	if (status === "loading") return <div>Loading...</div>
	if (status === "unauthenticated") return <div>Unauthenticated</div>
	if (!data?.user.id || !data.user.email) return <div>No user</div>
	return (
		<div className="p-10">
			<SwitchCard trailerId={trailerId} client={client} userId={data.user.id} email={data.user.email} />
		</div>
	)
}
