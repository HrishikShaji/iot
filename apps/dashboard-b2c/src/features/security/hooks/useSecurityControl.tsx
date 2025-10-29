import { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

export interface SecurityData {
	systemStatus: string;
	activeCameras: string;
	motionDetection: string;
	doorStatus: string;
	windowStatus: string;
	alarmHistory: string;
	accessLog: string;
	remoteAccess: string;
}

interface SecurityMessage extends SecurityData {
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

export default function useSecurityControl({ email, client, userId, trailerId }: Props) {
	const [securityData, setSecurityData] = useState<SecurityData>({
		systemStatus: "Armed",
		activeCameras: "4 of 4",
		motionDetection: "Active",
		doorStatus: "All locked",
		windowStatus: "All secure",
		alarmHistory: "No recent alerts",
		accessLog: "3 entries today",
		remoteAccess: "Enabled"
	});

	const topic = `security/state/${trailerId}`;

	// Subscribe to security state changes
	useEffect(() => {
		if (!client) return;

		// Message handler for incoming security state updates
		const handleMessage = (receivedTopic: string, message: Buffer) => {
			if (receivedTopic === topic) {
				try {
					const data: SecurityMessage = JSON.parse(message.toString());
					// Update local state when receiving messages from other apps
					setSecurityData({
						systemStatus: data.systemStatus,
						activeCameras: data.activeCameras,
						motionDetection: data.motionDetection,
						doorStatus: data.doorStatus,
						windowStatus: data.windowStatus,
						alarmHistory: data.alarmHistory,
						accessLog: data.accessLog,
						remoteAccess: data.remoteAccess
					});
					console.log("Received security data:", data);
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
				console.log("Subscribed to security/state");
			}
		});

		// Set up message listener
		client.on("message", handleMessage);

		// Publish initial state
		publishSecurityData(securityData);

		// Cleanup
		return () => {
			client.unsubscribe(topic);
			client.off("message", handleMessage);
		};
	}, [client]);

	const updateField = (field: keyof SecurityData, value: any) => {
		const newData = { ...securityData, [field]: value };
		setSecurityData(newData);
		publishSecurityData(newData);
	};

	const publishSecurityData = (data: SecurityData) => {
		if (client) {
			const message: SecurityMessage = {
				...data,
				userId,
				email,
				timestamp: new Date().toISOString(),
				device: "security-control",
			};

			client.publish(topic, JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log("Publish error:", err);
				} else {
					console.log("Security data published:", message);
				}
			});
		}
	};

	return { securityData, updateField, setSecurityData };
}
