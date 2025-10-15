"use client"
import SwitchCard from "@/features/switch/components/SwitchCard"
import TemperatureCard from "@/features/temperature/components/TemperatureCard"
import WaterCard from "@/features/water/components/WaterCard"
import PowerCard from "@/features/power/components/PowerCard"
import LocationCard from "@/features/location/components/LocationCard"
import { MqttClient } from "mqtt"

interface Props {
	userId: string;
	email: string;
	client: MqttClient;
}

export default function ControlPanel({ userId, email, client }: Props) {

	return (
		<div className="h-full p-4 md:p-6 lg:p-8 relative"
			style={{
				backgroundImage: "url('/home_m_2.jpg')",
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}}
		>

			<div className="absolute top-0 left-0 bg-gradient-to-r from-black/50 to-black h-full w-full"></div>

			<div className="grid grid-cols-1 h-full  w-[70%] lg:grid-cols-2 gap-6">
				<SwitchCard
					userId={userId}
					email={email}
					client={client}
				/>
				<TemperatureCard
					email={email}
					userId={userId}
					client={client}
				/>
				<WaterCard
					email={email}
					userId={userId}
					client={client}
				/>
				<PowerCard
					email={email}
					userId={userId}
					client={client}
				/>
				{/* <LocationCard */}
				{/* 	client={client} */}
				{/* 	userId={userId} */}
				{/* 	email={email} */}
				{/* /> */}
			</div>
		</div>
	)
}
