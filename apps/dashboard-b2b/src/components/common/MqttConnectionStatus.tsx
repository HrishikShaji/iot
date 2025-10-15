"use client"
import { useMqtt } from "@/contexts/MqttContext"
import { Wifi, WifiOff } from "lucide-react"

export default function MqttConnectionStatus() {
	const { isConnected } = useMqtt()

	if (!isConnected) {
		return <WifiOff className="h-5 w-5 text-red-600" />
	}

	return (
		<Wifi className="h-5 w-5 text-green-600" />
	)
}
