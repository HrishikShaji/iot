import { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

export interface ClimateData {
	interiorTemperature: number;
	targetTemperature: number;
	humidity: number;
	hvacMode: string;
	fanSpeed: string;
	airQuality: string;
	filterStatus: string;
	energyUsage: number;
}

interface ClimateMessage extends ClimateData {
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

export default function useClimateControl({ email, client, userId, trailerId }: Props) {
	const [climateData, setClimateData] = useState<ClimateData>({
		interiorTemperature: 72,
		targetTemperature: 72,
		humidity: 45,
		hvacMode: "Auto",
		fanSpeed: "Medium",
		airQuality: "Good",
		filterStatus: "Clean",
		energyUsage: 1.2
	});

	const topic = `climate/state/${trailerId}`;

	// Subscribe to climate state changes
	useEffect(() => {
		if (!client) return;

		// Message handler for incoming climate state updates
		const handleMessage = (receivedTopic: string, message: Buffer) => {
			if (receivedTopic === topic) {
				try {
					const data: ClimateMessage = JSON.parse(message.toString());
					// Update local state when receiving messages from other apps
					setClimateData({
						interiorTemperature: data.interiorTemperature,
						targetTemperature: data.targetTemperature,
						humidity: data.humidity,
						hvacMode: data.hvacMode,
						fanSpeed: data.fanSpeed,
						airQuality: data.airQuality,
						filterStatus: data.filterStatus,
						energyUsage: data.energyUsage
					});
					console.log("Received climate data:", data);
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
				console.log("Subscribed to climate/state");
			}
		});

		// Set up message listener
		client.on("message", handleMessage);

		// Publish initial state
		publishClimateData(climateData);

		// Cleanup
		return () => {
			client.unsubscribe(topic);
			client.off("message", handleMessage);
		};
	}, [client]);

	const updateField = (field: keyof ClimateData, value: any) => {
		const newData = { ...climateData, [field]: value };
		setClimateData(newData);
		publishClimateData(newData);
	};

	const publishClimateData = (data: ClimateData) => {
		if (client) {
			const message: ClimateMessage = {
				...data,
				userId,
				email,
				timestamp: new Date().toISOString(),
				device: "climate-control",
			};

			client.publish(topic, JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log("Publish error:", err);
				} else {
					console.log("Climate data published:", message);
				}
			});
		}
	};

	return { climateData, updateField, setClimateData };
}
