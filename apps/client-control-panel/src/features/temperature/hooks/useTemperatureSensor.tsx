import { TemperatureSensorType } from "@repo/types";
import { MqttClient } from "mqtt"
import { useEffect, useState } from "react";

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
}

export default function useTemperatureSensor({ email, userId, client }: Props) {
	const [temperatureData, setTemperatureData] = useState<TemperatureSensorType>({
		temperature: 25.0,
		humidity: 60.0,
		sensor: "DHT22",
		location: "Living Room",
		enabled: true,
		userId,
		email,
		timestamp: new Date().toISOString()
	})
	const handleTemperatureChange = (field: string, value: any) => {
		const newData = { ...temperatureData, [field]: value }
		setTemperatureData(newData)
		publishSensorData(newData)
	}

	useEffect(() => {
		publishSensorData(temperatureData)
	}, [])

	const publishSensorData = (data: TemperatureSensorType) => {
		if (client && data.enabled) {


			client.publish("sensors/temperature", JSON.stringify(data), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log(`Publish error for Temperature:`, err)
				} else {
					console.log(`Temperature data published:`, data)
				}
			})
		}
	}

	return { temperatureData, handleTemperatureChange }

}
