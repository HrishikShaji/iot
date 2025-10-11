import { MqttClient } from "mqtt";
import useLocationSensor from "../hooks/useLocationSensor";
import { Locate, LocateFixedIcon, LocationEditIcon } from "lucide-react"

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
}

export default function LocationCard({ client, userId, email }: Props) {
	const { location, error, isTracking, startTracking, stopTracking } = useLocationSensor({
		client,
		userId,
		email,
		intervalMs: 60000
	});

	return (
		<LocateFixedIcon color="white" />
	)
}
