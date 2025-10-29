import { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

export interface WaterData {
	freshWater: string;
	grayWater: string;
	waterPressure: number;
	waterTemperature: number;
	pumpStatus: string;
	filterStatus: string;
	dailyUsage: number;
	leakDetection: string;
}

interface WaterMessage extends WaterData {
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

export default function useWaterControl({ email, client, userId, trailerId }: Props) {
	const [waterData, setWaterData] = useState<WaterData>({
		freshWater: "78% (156L)",
		grayWater: "23% (46L)",
		waterPressure: 45,
		waterTemperature: 68,
		pumpStatus: "Auto",
		filterStatus: "Good (87%)",
		dailyUsage: 45,
		leakDetection: "No leaks detected"
	});

	const topic = `water/state/${trailerId}`;

	// Subscribe to water state changes
	useEffect(() => {
		if (!client) return;

		// Message handler for incoming water state updates
		const handleMessage = (receivedTopic: string, message: Buffer) => {
			if (receivedTopic === topic) {
				try {
					const data: WaterMessage = JSON.parse(message.toString());
					// Update local state when receiving messages from other apps
					setWaterData({
						freshWater: data.freshWater,
						grayWater: data.grayWater,
						waterPressure: data.waterPressure,
						waterTemperature: data.waterTemperature,
						pumpStatus: data.pumpStatus,
						filterStatus: data.filterStatus,
						dailyUsage: data.dailyUsage,
						leakDetection: data.leakDetection
					});
					console.log("Received water data:", data);
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
				console.log("Subscribed to water/state");
			}
		});

		// Set up message listener
		client.on("message", handleMessage);

		// Publish initial state
		publishWaterData(waterData);

		// Cleanup
		return () => {
			client.unsubscribe(topic);
			client.off("message", handleMessage);
		};
	}, [client]);

	const updateField = (field: keyof WaterData, value: any) => {
		const newData = { ...waterData, [field]: value };
		setWaterData(newData);
		publishWaterData(newData);
	};

	const publishWaterData = (data: WaterData) => {
		if (client) {
			const message: WaterMessage = {
				...data,
				userId,
				email,
				timestamp: new Date().toISOString(),
				device: "water-control",
			};

			client.publish(topic, JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log("Publish error:", err);
				} else {
					console.log("Water data published:", message);
				}
			});
		}
	};

	return { waterData, updateField, setWaterData };
}
