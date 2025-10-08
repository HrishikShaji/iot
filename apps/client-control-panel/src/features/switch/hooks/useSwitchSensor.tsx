import { SwitchSensorType } from "@repo/types";
import { MqttClient } from "mqtt"
import { useEffect, useState } from "react"

interface Props {
	client: MqttClient;
	isConnected: boolean;
	userId: string;
	email: string;
}

export default function useSwitchSensor({ email, client, isConnected, userId }: Props) {
	const [switchState, setSwitchState] = useState(false)

	const toggleSwitch = () => {
		const newState = !switchState
		setSwitchState(newState)
		if (client && isConnected) {
			const newState = !switchState
			setSwitchState(newState)
			publishSensorData(newState)
		}
	}

	useEffect(() => {
		publishSensorData(switchState)
	}, [])

	const publishSensorData = (newState: boolean) => {
		if (client && isConnected) {

			const message: SwitchSensorType = {
				userId,
				email,
				state: newState,
				timestamp: new Date().toISOString(),
				device: "main-switch",
			}

			client.publish("switch/state", JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.error("Publish error:", err)
				} else {
					console.log("Switch state published:", message.state)
				}
			})
		}
	}

	return { toggleSwitch, switchState, setSwitchState }

}
