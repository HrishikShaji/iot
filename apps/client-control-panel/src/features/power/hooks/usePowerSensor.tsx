import { PowerSensorType } from "@repo/types";
import { MqttClient } from "mqtt"
import { useEffect, useState } from "react";

interface Props {
	client: MqttClient;
	isConnected: boolean;
	userId: string;
	email: string;
}

export default function usePowerSensor({ email, client, isConnected, userId }: Props) {
	const [powerData, setPowerData] = useState<PowerSensorType>({
		voltage: 220.0,
		current: 5.5,
		power: 1210,
		frequency: 50.0,
		powerFactor: 0.95,
		sensor: "Power Meter",
		phase: "Single",
		enabled: true,
		monitoring: true,
		userId,
		email,
		timestamp: new Date().toISOString()
	})

	useEffect(() => {
		publishSensorData(powerData)
	}, [])

	const publishSensorData = (data: PowerSensorType) => {
		if (client && isConnected && data.enabled) {
			client.publish("sensors/power", JSON.stringify(data), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.error(`Publish error for power:`, err)
				} else {
					console.log(`power data published:`, data)
				}
			})
		}
	}

	const handlePowerChange = (field: string, value: any) => {
		const newData = { ...powerData, [field]: value }
		setPowerData(newData)
		publishSensorData(newData)
	}

	return { powerData, handlePowerChange }

}
