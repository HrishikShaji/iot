import { SERVER_URL } from "@/lib/variables"
import { PowerSensorType, SwitchSensorType, TemperatureSensorType, WaterSensorType } from "@repo/types"
import mqtt, { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

export default function useMqtt() {
	const [client, setClient] = useState<MqttClient | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState("Disconnected")

	const [switchData, setSwitchData] = useState<SwitchSensorType | null>(null)
	const [temperatureData, setTemperatureData] = useState<TemperatureSensorType | null>(null)
	const [waterLevelData, setWaterLevelData] = useState<WaterSensorType | null>(null)
	const [powerData, setPowerData] = useState<PowerSensorType | null>(null)

	useEffect(() => {
		const mqttClient = mqtt.connect(SERVER_URL, {
			clientId: `switch-client-${Math.random().toString(16).substr(2, 8)}`,
			clean: true,
			keepalive: 60,
			reconnectPeriod: 1000,
			connectTimeout: 30000,
			protocolVersion: 4, // MQTT 3.1.1
			queueQoSZero: false, // Don't queue QoS 0 messages when offline
		})

		mqttClient.on("connect", () => {
			console.log("Dashboard connected to MQTT broker")
			setIsConnected(true)
			setClient(mqttClient)
			setConnectionStatus("Connected")

			const topics = ["switch/state", "sensors/temperature", "sensors/waterlevel", "sensors/power"]
			topics.forEach((topic) => {
				mqttClient.subscribe(topic, (err) => {
					if (err) {
						console.log(`Subscription error for ${topic}:`, err)
					} else {
						console.log(`Subscribed to ${topic} topic`)
					}
				})
			})
		})

		mqttClient.on("message", (topic, message) => {
			try {
				const data = JSON.parse(message.toString())
				console.log("Received message:", { topic, data })

				switch (topic) {
					case "switch/state":
						setSwitchData(data)
						break
					case "sensors/temperature":
						setTemperatureData(data)
						break
					case "sensors/waterlevel":
						setWaterLevelData(data)
						break
					case "sensors/power":
						setPowerData(data)
						break
				}

			} catch (error) {
				console.log("Error parsing message:", error)
			}
		})

		mqttClient.on("error", (err) => {
			console.log("MQTT connection error:", err)
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
		connectionStatus,
		isConnected,
		switchData,
		powerData,
		waterLevelData,
		temperatureData,
		client
	}

}
