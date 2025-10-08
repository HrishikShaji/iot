import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import app from "@/lib/firebase";
import { LocationSensorType } from "@repo/types";

export default function useLocationMonitoring() {
	const [messages, setMessages] = useState<LocationSensorType[]>([])

	useEffect(() => {
		const database = getDatabase(app);
		const locationsRef = ref(database, 'locations'); // New structure

		const unsubscribe = onValue(locationsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				// Data is already deduplicated by userId
				const locationArray = Object.values(data) as LocationSensorType[];

				// Sort by timestamp
				const sorted = locationArray.sort((a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				);

				setMessages(sorted);
				console.log("SORTED LOCATIONS", sorted)
			} else {
				setMessages([]);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return { messages }
}
