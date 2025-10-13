"use client"
import TemperatureMonitoring from "@/features/temperature/components/TemperatureMonitoring"
import SwitchMonitoring from "@/features/switch/components/SwitchMonitoring"
import LocationMonitoring from "@/features/location/components/LocationMonitoring"
import { Button } from "@repo/ui/components/ui/button"

export default function B2BDashboard() {
	return (
		<div className="h-screen p-4 md:p-6 lg:p-8 relative"
			style={{
				backgroundImage: "url('/home_m_2.jpg')",
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}}
		>

			<div className="absolute top-0 left-0 bg-gradient-to-r from-black/50 to-black h-full w-full"></div>

			<div className="w-full  absolute top-40 left-0">
				<LocationMonitoring />
			</div>
		</div>
	)
}
