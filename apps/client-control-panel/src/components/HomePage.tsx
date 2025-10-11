"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ControlPanel from "./ControlPanel"
import { useEffect, useState } from "react"
import Header from "./Header"
import mqtt, { MqttClient } from "mqtt"
import { SERVER_URL } from "@/lib/variables"

interface Props {
	email: string;
	userId: string;
	status: "authenticated" | "unauthenticated" | "loading"
}

export default function HomePage({ email, userId, status }: Props) {
	const [client, setClient] = useState<MqttClient | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState("Disconnected")

	// Connect to MQTT broker
	useEffect(() => {
		const mqttClient = mqtt.connect(SERVER_URL, {
			clientId: `switch-client-${Math.random().toString(16).substr(2, 8)}`,
			clean: true,
			keepalive: 60,
			reconnectPeriod: 1000,
			connectTimeout: 30000,
			protocolVersion: 4,
			queueQoSZero: false,
		})

		mqttClient.on("connect", () => {
			console.log("Connected to MQTT broker")
			setIsConnected(true)
			setConnectionStatus("Connected")
			setClient(mqttClient)
		})

		mqttClient.on("error", (err) => {
			console.error("MQTT connection error:", err)
			setConnectionStatus(`Error: ${err.message}`)
		})

		mqttClient.on("offline", () => {
			setIsConnected(false)
			setConnectionStatus("Offline")
		})

		mqttClient.on("reconnect", () => {
			setConnectionStatus("Reconnecting...")
		})

		return () => {
			if (mqttClient) {
				mqttClient.end()
			}
		}
	}, [])

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
				status={status}
			/>

		</>
	)
}
