"use client"
import TemperatureMonitoring from "@/features/temperature/components/TemperatureMonitoring"
import SwitchMonitoring from "@/features/switch/components/SwitchMonitoring"
import LocationMonitoring from "@/features/location/components/LocationMonitoring"

export default function B2BDashboard() {
	return (
		<div>
			<SwitchMonitoring />
			<TemperatureMonitoring />
			<LocationMonitoring />
		</div>
	)
}
