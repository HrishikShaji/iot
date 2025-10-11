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
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import useLocationSensor from "@/features/location/hooks/useLocationSensor"
import LocationCard from "@/features/location/components/LocationCard"
import { prisma } from "@repo/db"
import { Button } from "@repo/ui/components/ui/button"

export default function ControlPanel() {
	const [client, setClient] = useState<MqttClient | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState("Disconnected")
	const router = useRouter()
	const { data: session, status } = useSession()

	// Handle authentication redirect
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/login")
		}
	}, [status, router])

	// Connect to MQTT broker
	useEffect(() => {
		// Don't connect if not authenticated
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
	// Show loading state while checking authentication
	if (status === "loading") {
		return (
			<div className="h-screen flex items-center justify-center">
				<p className="text-lg">Loading...</p>
			</div>
		)
	}

	// Don't render anything if not authenticated (redirect will happen)
	if (status !== "authenticated" || !session.user?.id || !session.user.email) {
		return null
	}

	// Don't render controls until MQTT client is connected
	if (!client) {
		return (
			<div className="h-screen flex items-center justify-center">
				<p className="text-lg">Connecting to broker...</p>
			</div>
		)
	}

	console.log(session)
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
						userId={session.user.id}
						email={session.user.email}
					/>
					<UserProfile />
				</div>
			</div>

			<div className="absolute top-0 left-0 bg-gradient-to-r from-black/50 to-black h-full w-full"></div>

			<div className="grid grid-cols-1 absolute top-40 right-10 w-[40%] lg:grid-cols-2 gap-6">
				<SwitchCard
					userId={session.user.id}
					email={session.user.email}
					isConnected={isConnected}
					client={client}
				/>
				<TemperatureCard
					email={session.user.email}
					userId={session.user.id}
					isConnected={isConnected}
					client={client}
				/>
				<WaterCard
					email={session.user.email}
					userId={session.user.id}
					isConnected={isConnected}
					client={client}
				/>
				<PowerCard
					email={session.user.email}
					userId={session.user.id}
					isConnected={isConnected}
					client={client}
				/>
			</div>
		</div>
	)
}
