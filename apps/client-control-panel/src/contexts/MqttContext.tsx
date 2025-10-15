"use client"
import { SERVER_URL } from "@/lib/variables"
import mqtt, { MqttClient, IClientOptions } from "mqtt"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface MqttContextType {
	client: MqttClient | null
	isConnected: boolean
	connectionStatus: string
	subscribe: (topic: string, callback: (topic: string, message: Buffer) => void) => void
	unsubscribe: (topic: string) => void
	publish: (topic: string, message: string) => void
}

const MqttContext = createContext<MqttContextType | undefined>(undefined)

interface MqttProviderProps {
	children: ReactNode
	options?: IClientOptions
}

export function MqttProvider({ children, options }: MqttProviderProps) {
	const [client, setClient] = useState<MqttClient | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState("Disconnected")

	const [messageHandlers, setMessageHandlers] = useState<Map<string, (topic: string, message: Buffer) => void>>(new Map())

	useEffect(() => {
		const defaultOptions: IClientOptions = {
			clientId: `switch-client-${Math.random().toString(16).substr(2, 8)}`,
			clean: true,
			keepalive: 60,
			reconnectPeriod: 1000,
			connectTimeout: 30000,
			protocolVersion: 4,
			queueQoSZero: false,
			...options
		}

		const mqttClient = mqtt.connect(SERVER_URL, defaultOptions)

		mqttClient.on("connect", () => {
			console.log("Connected to MQTT broker")
			setIsConnected(true)
			setConnectionStatus("Connected")
			setClient(mqttClient)

			messageHandlers.forEach((_, topic) => {
				mqttClient.subscribe(topic, (err) => {
					if (err) {
						console.error(`Failed to subscribe to ${topic}:`, err)
					}
				})
			})
		})

		mqttClient.on("message", (topic: string, message: Buffer) => {
			const handler = messageHandlers.get(topic)
			if (handler) {
				handler(topic, message)
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

		mqttClient.on("end", () => {
			setIsConnected(false)
			setConnectionStatus("Disconnected")
		})

		setClient(mqttClient)

		return () => {
			if (mqttClient) {
				mqttClient.end()
			}
		}
	}, [options])

	const subscribe = (topic: string, callback: (topic: string, message: Buffer) => void) => {
		setMessageHandlers(prev => new Map(prev).set(topic, callback))

		if (client && isConnected) {
			client.subscribe(topic, (err) => {
				if (err) {
					console.error(`Failed to subscribe to ${topic}:`, err)
				} else {
					console.log(`Subscribed to ${topic}`)
				}
			})
		}
	}

	const unsubscribe = (topic: string) => {
		setMessageHandlers(prev => {
			const newHandlers = new Map(prev)
			newHandlers.delete(topic)
			return newHandlers
		})

		if (client && isConnected) {
			client.unsubscribe(topic, (err) => {
				if (err) {
					console.error(`Failed to unsubscribe from ${topic}:`, err)
				} else {
					console.log(`Unsubscribed from ${topic}`)
				}
			})
		}
	}

	const publish = (topic: string, message: string) => {
		if (client && isConnected) {
			client.publish(topic, message, (err) => {
				if (err) {
					console.error(`Failed to publish to ${topic}:`, err)
				}
			})
		} else {
			console.warn("MQTT client not connected. Cannot publish message.")
		}
	}

	const value: MqttContextType = {
		client,
		isConnected,
		connectionStatus,
		subscribe,
		unsubscribe,
		publish
	}

	return (
		<MqttContext.Provider value={value}>
			{children}
		</MqttContext.Provider>
	)
}

export function useMqtt() {
	const context = useContext(MqttContext)
	if (context === undefined) {
		throw new Error("useMqtt must be used within a MqttProvider")
	}
	return context
}
