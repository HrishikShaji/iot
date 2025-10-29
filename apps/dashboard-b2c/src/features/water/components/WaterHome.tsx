"use client"
import { useMqtt } from "@/contexts/MqttContext";
import { useSession } from "next-auth/react";
import WaterControl from "./WaterControl";

interface Props {
	trailerId: string;
}

export default function WaterHome({ trailerId }: Props) {
	const { client } = useMqtt()
	const { status, data } = useSession()
	if (!client) return <div>No Client</div>
	if (status === "loading") return <div>Loading...</div>
	if (status === "unauthenticated") return <div>Unauthenticated</div>
	if (!data?.user.id || !data.user.email) return <div>No user</div>
	return (
		<div className="p-10">
			<WaterControl trailerId={trailerId} client={client} userId={data.user.id} email={data.user.email} />
		</div>
	)
}
