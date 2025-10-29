import { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

export interface EnergyData {
	currentCharge: number;
	voltage: number;
	currentDraw: number;
	temperature: number;
	totalChargeCycles: number;
	health: string;
	lastCharged: string;
	estimatedRuntime: number;
	chargingStatus: string;
}

interface EnergyMessage extends EnergyData {
	userId: string;
	email: string;
	timestamp: string;
	device: string;
}

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	trailerId: string;
}

export default function useEnergyControl({ email, client, userId, trailerId }: Props) {
	const [energyData, setEnergyData] = useState<EnergyData>({
		currentCharge: 95,
		voltage: 48.2,
		currentDraw: 12.5,
		temperature: 32,
		totalChargeCycles: 1247,
		health: "Excellent",
		lastCharged: "1 hour ago",
		estimatedRuntime: 18,
		chargingStatus: "Not charging"
	});

	const topic = `energy/state/${trailerId}`;

	// Subscribe to energy state changes
	useEffect(() => {
		if (!client) return;

		// Message handler for incoming energy state updates
		const handleMessage = (receivedTopic: string, message: Buffer) => {
			if (receivedTopic === topic) {
				try {
					const data: EnergyMessage = JSON.parse(message.toString());
					// Update local state when receiving messages from other apps
					setEnergyData({
						currentCharge: data.currentCharge,
						voltage: data.voltage,
						currentDraw: data.currentDraw,
						temperature: data.temperature,
						totalChargeCycles: data.totalChargeCycles,
						health: data.health,
						lastCharged: data.lastCharged,
						estimatedRuntime: data.estimatedRuntime,
						chargingStatus: data.chargingStatus
					});
					console.log("Received energy data:", data);
				} catch (err) {
					console.error("Error parsing message:", err);
				}
			}
		};

		// Subscribe to the topic
		client.subscribe(topic, { qos: 0 }, (err) => {
			if (err) {
				console.error("Subscribe error:", err);
			} else {
				console.log("Subscribed to energy/state");
			}
		});

		// Set up message listener
		client.on("message", handleMessage);

		// Publish initial state
		publishEnergyData(energyData);

		// Cleanup
		return () => {
			client.unsubscribe(topic);
			client.off("message", handleMessage);
		};
	}, [client]);

	const updateField = (field: keyof EnergyData, value: any) => {
		const newData = { ...energyData, [field]: value };
		setEnergyData(newData);
		publishEnergyData(newData);
	};

	const publishEnergyData = (data: EnergyData) => {
		if (client) {
			const message: EnergyMessage = {
				...data,
				userId,
				email,
				timestamp: new Date().toISOString(),
				device: "energy-control",
			};

			client.publish(topic, JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log("Publish error:", err);
				} else {
					console.log("Energy data published:", message);
				}
			});
		}
	};

	return { energyData, updateField, setEnergyData };
}
