"use client"
import SensorCard from "./SensorCard"
import PowerMonitoring from "@/features/power/components/PowerMonitoring"
import PowerInfo from "@/features/power/components/PowerInfo"
import WaterMonitoring from "@/features/water/components/WaterMonitoring"
import WaterInfo from "@/features/water/components/WaterInfo"
import TemperatureMonitoring from "@/features/temperature/components/TemperatureMonitoring"
import TemperatureInfo from "@/features/temperature/components/TemperatureInfo"
import SwitchMonitoring from "@/features/switch/components/SwitchMonitoring"
import SwitchInfo from "@/features/switch/components/SwitchInfo"
import { PowerSensorType, SwitchSensorType, TemperatureSensorType, WaterSensorType } from "@repo/types"

interface Props {
	switchData: SwitchSensorType | null;
	powerData: PowerSensorType | null;
	temperatureData: TemperatureSensorType | null;
	waterLevelData: WaterSensorType | null;
}


export default function Dashboard({ waterLevelData, powerData, switchData, temperatureData }: Props) {

	return (
		<div className="flex-1 min-h-0 w-full overflow-auto">
			<div className="h-full p-4 md:p-6 lg:p-8 relative"
				style={{
					backgroundImage: "url('/home_m_2.jpg')",
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center'
				}}
			>
				{/* Sensor Controls Grid */}
				<div className="absolute top-0 left-0  bg-gradient-to-r from-black/50 to-black h-full w-full"></div>

				<div className=" px-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<SensorCard
						title="Switch  Sensor"
						icon={<SwitchMonitoring trailerId="" />}
					>
						<SwitchInfo switchData={switchData} />
					</SensorCard>
					<SensorCard
						title="Temperature Sensor"
						icon={<TemperatureMonitoring />}
					>
						<TemperatureInfo temperatureData={temperatureData} />
					</SensorCard>
					<SensorCard
						title="Water Sensor"
						icon={<WaterMonitoring />}
					>
						<WaterInfo waterLevelData={waterLevelData} />
					</SensorCard>
					<SensorCard
						title="Power Sensor"
						icon={<PowerMonitoring />}
					>
						<PowerInfo powerData={powerData} />
					</SensorCard>
				</div>

			</div>
		</div>
	)
}
