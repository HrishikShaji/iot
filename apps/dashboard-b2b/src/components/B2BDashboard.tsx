"use client"
import TemperatureMonitoring from "@/features/temperature/components/TemperatureMonitoring"
import SwitchMonitoring from "@/features/switch/components/SwitchMonitoring"
import LocationMonitoring from "@/features/location/components/LocationMonitoring"
import { Button } from "@repo/ui/components/ui/button"

export default function B2BDashboard() {
	return (
		<div className="h-full  md:p-6 lg:p-8 relative"
		>
			<LocationMonitoring />
		</div>
	)
}
