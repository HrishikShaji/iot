import { LocationSensorType } from "@repo/types";
import { MqttClient } from "mqtt";
import { useEffect, useState, useRef } from "react";

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	intervalMs?: number;
}

export default function useLocationSensor({
	email,
	client,
	userId,
	intervalMs = 30000
}: Props) {
	const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isTracking, setIsTracking] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const publishLocationData = (lat: number, lon: number) => {
		if (client) {
			const message: LocationSensorType = {
				userId,
				email,
				latitude: lat,
				longitude: lon,
				timestamp: new Date().toISOString(),
				device: "location-sensor",
			};

			// Publish to a user-specific topic so it can be stored per-user
			client.publish(`location/user/${userId}`, JSON.stringify(message), { qos: 0, retain: true }, (err) => {
				if (err) {
					console.log("Publish error:", err);
				} else {
					console.log("Location published:", { lat, lon });
				}
			});
		}
	};

	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setLocation({ latitude, longitude });
				setError(null);
				publishLocationData(latitude, longitude);
			},
			(err) => {
				setError(err.message);
				console.error("Location error:", err);
			}
		);
	};

	const startTracking = () => {
		setIsTracking(true);
		getCurrentLocation();

		intervalRef.current = setInterval(() => {
			getCurrentLocation();
		}, intervalMs);
	};

	const stopTracking = () => {
		setIsTracking(false);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	useEffect(() => {
		startTracking();
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return {
		location,
		error,
		isTracking,
		startTracking,
		stopTracking,
		getCurrentLocation
	};
}
