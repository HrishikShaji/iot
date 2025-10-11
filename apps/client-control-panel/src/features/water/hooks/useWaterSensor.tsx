import { WaterSensorType } from "@repo/types";
import { MqttClient } from "mqtt"
import { useEffect, useState } from "react";

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
}

export default function useWaterSensor({ email, userId, client }: Props) {
	const [waterLevelData, setWaterLevelData] = useState<WaterSensorType>({
		level: 75,
		capacity: 1000,
		status: "normal",
		sensor: "Ultrasonic",
		location: "Main Tank",
		enabled: true,
		alertsEnabled: true,
		userId,
		email,
		timestamp: new Date().toISOString()
	})

	useEffect(() => {
		publishSensorData(waterLevelData)
	}, [])

	const publishSensorData = (data: WaterSensorType) => {
		if (client && data.enabled) {

			client.publish("sensors/waterlevel", JSON.stringify(data), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log(`Publish error for water:`, err)
				} else {
					console.log(`water data published:`, data)
				}
			})
		}
	}

	const handleWaterLevelChange = (field: string, value: any) => {
		const newData = { ...waterLevelData, [field]: value }
		setWaterLevelData(newData)
		publishSensorData(newData)
	}

	return { waterLevelData, handleWaterLevelChange }
}
