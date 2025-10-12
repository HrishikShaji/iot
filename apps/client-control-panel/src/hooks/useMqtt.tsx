import { SERVER_URL } from "@/lib/variables"
import mqtt, { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

export default function useMqtt() {
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

	return {
		client,
		isConnected,
		connectionStatus
	}

}
