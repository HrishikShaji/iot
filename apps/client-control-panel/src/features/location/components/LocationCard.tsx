import { MqttClient } from "mqtt";
import useLocationSensor from "../hooks/useLocationSensor";
import { Locate, LocateFixedIcon, LocationEditIcon } from "lucide-react"

interface Props {
	client: MqttClient;
	isConnected: boolean;
	userId: string;
	email: string;
}

export default function LocationCard({ client, isConnected, userId, email }: Props) {
	const { location, error, isTracking, startTracking, stopTracking } = useLocationSensor({
		client,
		isConnected,
		userId,
		email,
		intervalMs: 60000
	});

	return (
		<LocateFixedIcon color="white" />
	)
}
