import { SwitchSensorType } from "@repo/types";
import { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	trailerId: string;
}

export default function useSwitchSensor({ email, client, userId, trailerId }: Props) {
	const [switchState, setSwitchState] = useState(false)
	const topic = `switch/state/${trailerId}`;

	// Subscribe to switch state changes
	useEffect(() => {
		if (!client) return;


		// Message handler for incoming switch state updates
		const handleMessage = (topic: string, message: Buffer) => {
			try {
				const data: SwitchSensorType = JSON.parse(message.toString());
				// Update local state when receiving messages from other apps
				setSwitchState(data.state);
				console.log("Received switch state:", data.state);
			} catch (err) {
				console.error("Error parsing message:", err);
			}
		};

		// Subscribe to the topic
		client.subscribe(topic, { qos: 0 }, (err) => {
			if (err) {
				console.error("Subscribe error:", err);
			} else {
				console.log("Subscribed to switch/state");
			}
		});

		// Set up message listener
		client.on("message", handleMessage);

		// Publish initial state
		publishSensorData(switchState);

		// Cleanup
		return () => {
			client.unsubscribe(topic);
			client.off("message", handleMessage);
		};
	}, [client]);

	const toggleSwitch = () => {
		const newState = !switchState;
		setSwitchState(newState);
		publishSensorData(newState);
	}

	const publishSensorData = (newState: boolean) => {
		if (client) {
			const message: SwitchSensorType = {
				userId,
				email,
				state: newState,
				timestamp: new Date().toISOString(),
				device: "main-switch",
			}
			client.publish(topic, JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log("Publish error:", err)
				} else {
					console.log("Switch state published:", message.state)
				}
			})
		}
	}

	return { toggleSwitch, switchState, setSwitchState }
}
