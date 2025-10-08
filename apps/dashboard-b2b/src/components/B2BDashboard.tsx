"use client"
import TemperatureMonitoring from "@/features/temperature/components/TemperatureMonitoring"
import SwitchMonitoring from "@/features/switch/components/SwitchMonitoring"

export default function B2BDashboard() {
	return (
		<div>
			<SwitchMonitoring />
			<TemperatureMonitoring />
		</div>
	)
}
