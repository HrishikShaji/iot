"use client"
import { useState, useEffect } from "react"
import mqtt, { type MqttClient } from "mqtt"
import { Power, Wifi, WifiOff } from "lucide-react"
import { SERVER_URL } from "@/lib/variables"
import SwitchCard from "@/features/switch/components/SwitchCard"
import TemperatureCard from "@/features/temperature/components/TemperatureCard"
import WaterCard from "@/features/water/components/WaterCard"
import PowerCard from "@/features/power/components/PowerCard"
import UserProfile from "./common/UserProfile"
import LocationCard from "@/features/location/components/LocationCard"

interface Props {
	userId: string;
	email: string;
	status: "authenticated" | "unauthenticated" | "loading"
}

export default function ControlPanel({ userId, email, status }: Props) {
	const [client, setClient] = useState<MqttClient | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState("Disconnected")

	// Connect to MQTT broker
	useEffect(() => {
		if (status !== "authenticated") {
			return
		}
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
	}, [status])

	if (!client) {
		return (
			<div className="h-screen flex items-center justify-center">
				<p className="text-lg">Connecting to broker...</p>
			</div>
		)
	}

	return (
		<div className="h-screen p-4 md:p-6 lg:p-8 relative"
			style={{
				backgroundImage: "url('/home_m_2.jpg')",
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}}
		>
			<div className="text-center space-y-2 px-10 py-5 w-full flex left-0 top-0 justify-between absolute z-10 items-center">
				<div className="text-left">
					<h1 className="text-4xl font-bold text-white">Trailer Control Panel</h1>
					<p className="text-muted-foreground text-lg">Interactive sensor control with sliders and toggles</p>
				</div>
				<div className="flex gap-2 items-center">
					{isConnected ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
					<LocationCard
						client={client}
						isConnected={isConnected}
						userId={userId}
						email={email}
					/>
					<UserProfile
						email={email}
						status={status}
					/>
				</div>
			</div>

			<div className="absolute top-0 left-0 bg-gradient-to-r from-black/50 to-black h-full w-full"></div>

			<div className="grid grid-cols-1 absolute top-40 right-10 w-[40%] lg:grid-cols-2 gap-6">
				<SwitchCard
					userId={userId}
					email={email}
					isConnected={isConnected}
					client={client}
				/>
				<TemperatureCard
					email={email}
					userId={userId}
					isConnected={isConnected}
					client={client}
				/>
				<WaterCard
					email={email}
					userId={userId}
					isConnected={isConnected}
					client={client}
				/>
				<PowerCard
					email={email}
					userId={userId}
					isConnected={isConnected}
					client={client}
				/>
			</div>
		</div>
	)
}
